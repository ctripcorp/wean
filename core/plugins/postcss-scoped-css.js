const selectorParser = require('postcss-selector-parser')
module.exports = ({ id = '' }) => {
  return {
    postcssPlugin: 'postcss-scoped-css',
    Rule(rule) {
      processRule(id, rule)
    }
  }
}

const processedRules = new WeakSet()

function processRule(id, rule) {
  if (processedRules.has(rule)) {
    return
  }
  processedRules.add(rule)
  rule.selector = selectorParser(selectorRoot => {
    selectorRoot.each(selector => {
      selector.each(n => {
        if (n.type === 'class') {
          selector.insertAfter(
            n,
            selectorParser.attribute({
              attribute: id,
              value: id,
              raws: {},
              quoteMark: `"`
            })
          )
        }
      })
    })
  }).processSync(rule.selector)
}

module.exports.postcss = true