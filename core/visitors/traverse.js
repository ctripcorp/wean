function traverse(ast, { enter, leave }) {
  visit(ast, null, enter, leave)
}

function visit(node, parent, enter, leave) {
  if (node.type === "CallExpression") {
    if (
      node.callee.name === "Component" ||
      node.callee.name === "Page" ||
      node.callee.name === "App"
    ) {
      return
    }
  }
  if (enter) {
    enter(node, parent)
  }

  let childKeys = Object.keys(node).filter(
    (key) => typeof node[key] === "object"
  )
  childKeys.forEach((childKey) => {
    let value = node[childKey]
    if (Array.isArray(value)) {
      value.forEach((val) => visit(val, node, enter, leave))
    } else if (value && value.type) {
      visit(value, node, enter, leave)
    }
  })

  if (leave) {
    leave(node, parent)
  }
}
module.exports = traverse
