const eventMap = {
  tap: "onClick",
  confirm: "onKeyDown",
}

let clock = 0

function generate(asset) {
  let tree = asset.ast
  let children = tree.children

  let state = {
    imports: [],
    methods: [],
    blocks: {}
  }


  for (let i = 0; i < children.length; i++) {
    const kid = children[i]
    const next = children[i + 1]
    const block = generateNode(kid, state, asset, next)
    state.blocks[clock++] = block
  }

  return { imports: state.imports, blocks: state.blocks }
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
      return ''

    }
  } else if (node.name === 'slot') {
    const { name } = node.attributes
    if (name) {
      state.blocks[name] = ''
      return `$slot$${name}$`
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

    if (Object.keys(node.attributes).indexOf('slot') > -1) {
      // slot
      state.blocks[node.attributes.slot] = code
      return ''
    }

    if (node.name === "import") {
      return ''
    }
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
      code = `<div>${code}</div>`
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
      code += ` ${eventMap[n] || n}={$handleEvent("${value}", ${getId(asset)}, "${n}")} `
    } else if (node.name === "import") {
      state.imports.push(value)
    } else {
      let compiled = compileExpression(value, node.type)
      code += `${name}=${compiled}`
    }
  }
  return code + '>'
}

function getId(asset) {
  let p = asset.parent
  while (p.type === 'wxml') {
    p = p.parent
  }
  return p.id
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

const titleCase = (str) =>
  "remotes." +
  str.slice(0, 1).toUpperCase() +
  str.replace(/\-(\w)/g, (_, letter) => letter.toUpperCase()).slice(1)

module.exports = generate
