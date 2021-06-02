const eventMap = {
  tap: "onClick",
  confirm: "onKeyDown",
}

let clock = 0

function generate(asset) {
  let tree = asset.ast
  let tag = asset.parent.tag
  let children = tree.children
  let iskid = asset.parent.type === "wxml"

  let state = {
    imports: [],
    methods: [],
    blocks: {}
  }

  let code = "<div>"
  for (let i = 0; i < children.length; i++) {
    const kid = children[i]
    const next = children[i + 1]
    const block = generateNode(kid, state, asset, next)
    state.blocks[clock++] = block
    code += block
  }
  code += "</div>"
  let { imports, methods } = state
  let hook = generateHook(tag, methods, iskid)
  return { hook, code, imports, blocks: state.blocks }
}

function lifeCode(methods) {
  let method = methods.join(",")
  let life = `onLoad,onUnload,onShow,onHide`
  let code = `fre.useEffect(()=>{
    const params = window.getUrl(window.location.href)
    onLoad && onLoad(params)
    onShow && onShow(params)
    return () => {
      onUnload && onUnload(params)
      onHide && onHide(params)
    }
  },[])`
  return {
    life,
    code,
    method,
  }
}

function generateHook(tag, methods, iskid) {
  let { life, code, method } = lifeCode(methods)
  let constant
  if (tag) {
    constant = `const {properties:data, methods:{${method}},${life}} = useComponent(fre.useState({})[1], props,'${tag}')`
  } else {
    constant = `const {data, ${life}, ${method}} = usePage(${iskid ? "null" : "fre.useState({})[1]"
      }, props)`
  }
  return iskid
    ? `${constant}`
    : `${constant}
    ${code}
    `
}
function generateNode(node, state, asset, nextNode) {
  if (typeof node === "string") {
    let compiled = compileExpression(node, "text")
    return `${compiled}`
  } else if (node.name === "template") {
    const { is, name } = node.attributes
    if (is) {
      state.blocks[is] = ''
      return `$template$${is}$`
    } else {
      let code = node.children
        .map((item) => generateNode(item, state, asset))
        .join("\n")
      state.blocks[name] = code
      return code

    }
  } else {
    let code = `<${titleCase(node.name)} `
    code += generateProps(node, state, asset)
    if (node.children) {
      code += `${node.children
        .map((item, index) =>
          generateNode(item, state, asset, node.children[index + 1])
        )
        .join("\n")}`
    }
    code += `</${titleCase(node.name)}>`

    if (node.name === "import") code = ""
    if (node.directives) {
      code = generateDirect(node, code, nextNode)
    }
    return code
  }
}

let ifcode = ""

function generateDirect(node, code, next) {
  for (let i = 0; i < node.directives.length; i++) {
    const [name, value] = node.directives[i]
    const compiled = compileExpression(value, "direct")
    if (code[0] === "{") {
      code = `<>${code}</>`
    }
    if (name === "wx:for") {
      const item = findItem(node)
      code = `{$for(
                  ${compiled}, 
                  (${item}) => (${code})
              )}`
    }

    if (name === "wx:if") {
      ifcode += `{${compiled}?${code}:`
      if (isElse(next)) {
        continue
      } else {
        code = ifcode + "null}"
        ifcode = ""
      }
    }

    if (name === "wx:elseif") {
      ifcode += `${compiled}?${code}:`
      if (isElse(next)) {
        continue
      } else {
        code = ifcode + "null}"
        ifcode = ""
      }
    }

    if (name === "wx:else") {
      if (ifcode === "") {
        ifcode += `{!${compiled}?${code}:null}`
      } else {
        ifcode += `${code}}`
      }
      code = ifcode
      ifcode = ""
    }
    return code
  }
}

function isElse(node) {
  if (node) {
    for (const name in node.attributes) {
      if (name.indexOf("else") > -1) return true
    }
  }
  return false
}

function findItem(node) {
  const item = node.directives.find((item) => item[0] === "wx:for-item")
  return item ? item[1] : "item"
}

function generateProps(node, state, asset) {
  let code = ""
  for (let name in node.attributes) {
    const value = node.attributes[name]
    if (name.startsWith("wx:")) {
      node.directives = node.directives || []
      node.directives.push([name, value])
    } else if (name.startsWith("bind")) {
      if (state.methods.indexOf(value) < 0) {
        state.methods.push(value)
      }
      const n = name.replace("bind:", "").replace("bind", "")
      code += ` ${eventMap[n] || n}={e => ${value}(e)} `
    } else if (node.name === "import") {
      state.imports.push(value)
    } else {
      let compiled = compileExpression(value, node.type)
      code += `${name}=${compiled}`
    }
  }
  code += ` ${getHash(asset, node)} >`
  return code
}

function compileExpression(expression, type) {
  const exps = expression.match(/{{(.+)}}/g)
  switch (type) {
    case "direct":
      return expression.replace(/{{/g, "").replace(/}}/g, "")
    case "text":
      return exps
        ? expression.replace(/{{/g, "{").replace(/}}/g, "}")
        : expression
    case "component":
      if (!exps) return `"${expression}"`
      return expression.replace(/{{/g, "{").replace(/}}/g, "}")
    case "node":
      if (!exps) return `"${expression}"`
      expression = expression.replace(/{{/g, "${").replace(/}}/g, "}")
      return expression.indexOf("$") > -1
        ? "{`" + expression + "`}"
        : expression
  }
}

function getHash(asset, node) {
  if (!node.attributes.class) return ""
  let hash = ""
  if (asset.parent.tag) {
    hash = asset.hash.slice(0, 6)
  } else {
    let p = asset.parent
    if (p.parent.type !== "wxml") p = p.parent
    const wxml = p.siblingAssets.get(".wxml") || asset
    hash = wxml.hash.slice(0, 6)
  }
  return `data-w-${hash}`
}

const titleCase = (str) =>
  "remotes." +
  str.slice(0, 1).toUpperCase() +
  str.replace(/\-(\w)/g, (_, letter) => letter.toUpperCase()).slice(1)

module.exports = generate
