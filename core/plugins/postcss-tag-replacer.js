module.exports = (opts) => {
  return {
    postcssPlugin: "postcss-tag-replacer",
    Once(root) {
      // Plugin code
      root.walkRules((rule) => {
        if (opts.replaceMap[rule.selector]) {
          rule.replaceWith({
            selector: opts.replaceMap[rule.selector],
            nodes: rule.nodes,
          })
        }
      })
    },
  }
}
module.exports.postcss = true
