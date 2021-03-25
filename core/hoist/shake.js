const EXPORTS_RE = /^\$([\d]+)\$exports$/

function treeShake(scope) {
  let removed
  do {
    removed = false
    scope.crawl()
    Object.keys(scope.bindings).forEach((name) => {
      let binding = getUnusedBinding(scope.path, name)

      if (!binding) return

      binding.path.remove()
      binding.referencePaths
        .concat(binding.constantViolations)
        .forEach((path) => {
          if (path.parentPath.isMemberExpression()) {
            let parent = path.parentPath.parentPath
            if (
              parent.parentPath.isSequenceExpression() &&
              parent.parent.expressions.length === 1
            ) {
              parent.parentPath.remove()
            } else if (!parent.removed) {
              parent.remove()
            }
          } else if (!path.parentPath.removed) {
            path.parentPath.remove()
          } else if (path.isAssignmentExpression()) {
            let parent = path.parentPath
            if (!parent.isExpressionStatement()) {
              path.replaceWith(path.node.right)
            } else {
              path.remove()
            }
          }
        })

      scope.removeBinding(name)
      removed = true
    })
  } while (removed)
}

function getUnusedBinding(path, name) {
  let binding = path.scope.getBinding(name)
  if (!binding) return null
  if (isPure(binding)) return binding
  if (!EXPORTS_RE.test(name)) return null
  let bailout = binding.referencePaths.some((path) => !isExportAssignment(path))
  return bailout ? null : binding
}

function isPure(binding) {
  if (binding.referenced) return false
  if (
    binding.path.isVariableDeclarator() &&
    binding.path.get("id").isIdentifier()
  ) {
    let init = binding.path.get("init")
    return init.isPure() || init.isIdentifier() || init.isThisExpression()
  }
  return binding.path.isPure()
}

function isExportAssignment(path) {
  return (
    path.parentPath.isMemberExpression() &&
    path.parentPath.parentPath.isAssignmentExpression() &&
    path.parentPath.parentPath.node.left === path.parentPath.node
  )
}

module.exports = treeShake
