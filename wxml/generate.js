const { getName } = require("../core/hoist/util")

const eventMap = {
  tap: "onClick",
  confirm: "onKeyDown",
}

function generate(asset) {
  let tree = asset.ast
  let tag = tree.type
  let children = tree.children

  let state = {
    imports: [],
    methods: [],
  }

  let code = ""

  if (children.length > 1) {
    children.forEach((c) => (code += generateNode(c, state, asset)))
  } else {
    var root = children[0]
    code += generateNode(root, state, asset)
    if (root.name === "template") {
      const key = root.attributes.name
      asset.id = asset.parent.symbols.get(key)
    }
  }

  let { imports, methods } = state
  let hook = generateHook(tag, methods, root && root.name === "template")
  return { hook, code, imports }
}

function lifeCode() {
  let life = `onLoad,onUnload,onShow,onHide`
  let code = `fre.useEffect(()=>{
    const params = window.getUrl(window.location.href)
    onShow && onShow(params)
    return onHide && onHide(params)
  },[])
  fre.useLayout(()=>{
    const params = window.getUrl(window.location.href)
    onLoad && onLoad(params)
    return onUnload && onUnload(params)
  },[])`
  return {
    life,
    code,
  }
}

function generateHook(tag, methods, isTemplate) {
  let { life, code } = lifeCode(tag)
  let decode
  if (tag) {
    decode = `const {properties:data, methods:{${methods.join(
      ","
    )}},${life}} = useComponent(fre.useState({})[1], props,'${tag}')`
  } else {
    decode = `const {data, ${life}, ${methods.join(",")}} = usePage(${
      isTemplate ? "null" : "fre.useState({})[1]"
    }, props)`
  }
  return isTemplate
    ? `${decode}`
    : `${decode}
    ${code}
    `
}

function generateNode(node, state, asset, nextNode) {
  if (typeof node === "string") {
    let compiled = compileExpression(node, "text")
    return `${compiled}`
  } else if (node.name === "template") {
    const is = node.attributes.is
    const name = is ? '"' + getName(asset, "template", is) + '"' : null
    let code = name ? `{window.remotes[${name}]()}` : ""
    if (node.children) {
      code += `${node.children
        .map((item) => generateNode(item, state, asset))
        .join("\n")}`
    }
    if (is) {
      asset.symbols.set(is, getName(asset, "template", is))
    }
    return code
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
      if (name.indexOf("else") > -1) {
        return true
      }
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
      state.methods.push(value)
      const n = name.replace("bind:", "").replace("bind", "")
      code += ` ${eventMap[n] || n}={e => ${value}(e)} `
    } else if (node.name === "import") {
      state.imports.push(value)
    } else {
      let compiled = compileExpression(value, "attr")
      code += `${name}=${compiled}`
    }
  }
  code += `${getHash(asset, node)} >`
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
    case "attr":
      if (!exps) return `"${expression}"`
      exps.forEach((e) => {
        expression = expression.replace(e, (match) => {
          if (expression.length > match.length) {
            return match.replace(/{{/g, "${").replace(/}}/g, "}")
          } else {
            return match.replace(/{{/g, "{").replace(/}}/g, "}")
          }
        })
      })
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
  "remotes." + str.slice(0, 1).toUpperCase() + toHump(str).slice(1)

function toHump(name) {
  return name.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase())
}

module.exports = generate
