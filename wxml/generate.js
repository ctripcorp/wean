const { getName } = require("../core/tree-shaking/util")

const openRE = /\{\{/
const closeRE = /\s*\}\}/
const whitespaceRE = /\s/
const escapeRE = /(?:(?:&(?:lt|gt|quot|amp);)|"|\\|\n)/g
const expressionRE = /"[^"]*"|'[^']*'|\.\w*[a-zA-Z$_]\w*|\w*[a-zA-Z$_]\w*:|(\w*[a-zA-Z$_]\w*)/g
const globals = ["true", "false", "undefined", "null", "NaN", "typeof", "in"]
const escapeMap = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '\\"',
  "&amp;": "&",
  "\\": "\\\\",
  '"': '\\"',
  "\n": "\\n",
}
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
    handlers: [],
    data: [],
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

  let { imports, handlers, data } = state
  let hookCode = generateHook(
    tag,
    data,
    handlers,
    root && root.name === "template"
  )
  let output = `(props) => {
              ${hookCode}
              return <>${code}</>
          }`
  return { output, imports }
}

function generateHook(tag, data, handlers, isTemplate) {
  if (tag) {
    var decode = `const {properties:{${data.join(
      ","
    )}}, methods:{${handlers.join(
      ","
    )}},onLoad,onUnload} = useComponent(fre.useState({})[1], props,'${tag}')`
  } else {
    var decode = `const {data:{${data.join(
      ","
    )}}, onLoad,onUnload,${handlers.join(",")}} = usePage(${
      isTemplate ? "null" : "fre.useState({})[1]"
    }, props)`
  }
  return isTemplate
    ? `${decode}`
    : `fre.useEffect(()=>{
      const params = window.getUrl(window.location.href)
      onLoad && onLoad(params)
      return onUnload && onUnload(params)
    },[])
    ${decode}
    `
}

function generateNode(node, state, asset) {
  if (typeof node === "string") {
    let compiled = compileTemplate(node, state.data, true)
    return `${compiled}`
  } else if (node.name === "template") {
    const is = node.attributes.is
    let code = `{directs.$ensure(${
      is ? '"' + getName(asset, "template", is) + '"' : null
    })}`
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
        .map((item) => generateNode(item, state, asset))
        .join("\n")}`
    }
    code += `</${titleCase(node.name)}>`

    if (node.name === "import") code = ""

    if (node.directives) code = generateDirect(node, code, state)
    if (node.handlers) pushDirect(node.handlers, state.handlers)
    if (node.imports) pushDirect(node.imports, state.imports)

    return code
  }
}

function pushDirect(a, b) {
  for (let i = 0; i < a.length; i++) {
    const im = a[i]
    if (b.indexOf(im) < 0) b.push(im)
  }
}

function generateDirect(node, code, state) {
  for (let i = 0; i < node.directives.length; i++) {
    const [name, value] = node.directives[i]
    const compiled = compileTemplate(value, state.data)
    if (code[0] === "{") {
      code = `<>${code}</>`
    }
    switch (name) {
      case "wx:if":
        code = `{directs.$if(
                          () => ${compiled}, 
                          () => (${code}), 
                      )}`
        break
      case "wx:else":
        code = `{directs.$else(
                          () => ${compiled}, 
                          () => (${code}), 
                      )}`
        break
      case "wx:elseif":
        code = `{directs.$elseif(
                            () => ${compiled}, 
                            () => (${code}), 
                        )}`
        break
      case "wx:for":
        const item = findItem(node)
        code = `{directs.$for(
                              ${compiled}, 
                              (${item}) => (${code}), 
                              null
                          )}`
        break
      case "wx:key":
        break
    }
  }
  return code
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
      node.handlers = node.handlers || []
      node.handlers.push(value)
      const n = name.replace("bind:", "").replace("bind", "")
      code += ` ${eventMap[n] || n}={e => ${value}(e)} `
    } else if (node.name === "import") {
      node.imports = node.imports || []
      node.imports.push(value)
    } else {
      let compiled = compileTemplate(value, state.data, true)
      if (compiled[0] === "{") {
        code += `${name}=${compiled}`
      } else if (compiled.indexOf("{") > -1) {
        code += name + "={`" + compiled.replace(/{/g, "${") + "`}"
      } else {
        code += `${name}="${compiled}"`
      }
    }
  }
  code += `${getHash(asset, node)} >`
  return code
}

function getHash(asset, node) {
  if (!node.attributes.class) return ""
  let hash = ""
  if (asset.tag) {
    hash = asset.hash.slice(0, 6)
  } else {
    let p = asset
    if (p.parent.type !== "json") p = p.parent
    hash = p.hash.slice(0, 6)
  }
  return `data-w-${hash}`
}

function compileTemplate(template, data, isStr) {
  let state = {
    current: 0,
    template,
    data,
    output: "",
  }
  compileState(state, isStr)
  return state.output
}

function compileState(state, isStr) {
  let template = state.template
  let length = template.length
  while (state.current < length) {
    let value = scanUntil(state, openRE)
    if (value.length !== 0) {
      state.output += escapecodeing(value)
    }
    if (state.current === length) break
    state.current += 2
    cosumeWritespace(state)
    let name = scanUntil(state, closeRE)

    if (name.length !== 0) {
      compileExpression(name, state.data)
      if (isStr) name = `{${name}}`
      state.output += name
    }
    cosumeWritespace(state)
    state.current += 2
  }
}

function compileExpression(expr, deps) {
  expr.replace(expressionRE, function (match, reference) {
    if (
      reference !== undefined &&
      deps.indexOf(reference) === -1 &&
      globals.indexOf(reference) === -1
    ) {
      deps.push(reference)
    }
  })
  return deps
}

function scanUntil(state, re) {
  var template = state.template
  var tail = template.substring(state.current)
  var idx = tail.search(re)
  var match = ""
  switch (idx) {
    case -1:
      match = tail
      break
    case 0:
      match = ""
      break
    default:
      match = tail.substring(0, idx)
  }
  state.current += match.length
  return match
}

function cosumeWritespace(state) {
  var template = state.template
  var char = template[state.current]
  while (whitespaceRE.test(char)) {
    char = template[++state.current]
  }
}

const escapecodeing = (code) =>
  code.replace(escapeRE, (match) => escapeMap[match])

const titleCase = (str) =>
  "remotes." + str.slice(0, 1).toUpperCase() + toHump(str).slice(1)

function toHump(name) {
  return name.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase())
}

module.exports = generate
