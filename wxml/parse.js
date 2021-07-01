
function parse(tokens) {
  let ast = {
    children: [],
  }

  let state = {
    current: 0,
    tokens,
  }

  while (state.current < tokens.length) {
    let child = parseWalk(state)
    if (child) {
      ast.children.push(child)
    }

  }
  return ast
}

function parseWalk(state) {
  let token = state.tokens[state.current]
  let prevToken = state.tokens[state.current - 1]

  function move(num) {
    state.current += num != null ? num : 1
    token = state.tokens[state.current]
    prevToken = state.tokens[state.current - 1]
  }

  if (token.type === "text") {
    move()
    return prevToken.value
  }

  if (token.type === "comment") {
    move()
    return null
  }

  if (token.type === "tag") {
    let type = token.value
    let closeStart = token.closeStart
    let closeEnd = token.closeEnd

    let node = parseNode(type, token.attributes, [])
    move()
    if (closeEnd === true) {
      return node
    } else if (closeStart) {
      return null
    } else if (token) {
      while (
        token.type !== "tag" ||
        (token.type === "tag" &&
          ((!token.closeStart && !token.closeEnd) || token.value !== type))
      ) {
        let child = parseWalk(state)
        if (child) {
          node.children.push(child)
        }
        move(0)
        if (!token) {
          break
        }
      }
      move()
    }
    return node
  }
  move()
  return
}

function parseNode(name, attributes, children) {
  let type = "node"
  if (
    name.indexOf("-") > -1 ||
    (name[0] === name[0].toUpperCase() && name[0] !== name[0].toLowerCase())
  ) {
    type = "component"
  }

  return {
    type,
    name,
    attributes,
    children
  }
}
module.exports = parse
