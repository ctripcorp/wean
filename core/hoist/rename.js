module.exports = function rename(scope, a, b) {
  let binding = scope.getBinding(a)
  if (binding) {
    for (let violation of binding.constantViolations) {
      let bindingIds = violation.getBindingIdentifierPaths(true, false)
      for (let name in bindingIds) {
        for (let path of bindingIds[name]) {
          path.node.name = b
        }
      }
    }

    for (let path of binding.referencePaths) {
      path.node.name = b
    }

    binding.identifier.name = b
    scope.bindings[b] = binding
    delete scope.bindings[a]
  }
}
