const selectorParser = require('postcss-selector-parser')
const animationScoped = require('./animation-scoped')

module.exports = ({ id = '' }) => {
  return {
    postcssPlugin: 'postcss-scoped-css',
    Rule(rule) {
      processRule(id, rule)
    },
    AtRule(node) {
      processKeyframes(id, node)
    },
    Declaration(node) {
      processAnimation(id, node)
    }
  }
}

const processedRules = new WeakSet()
const exist = n => {
  if (!processedRules.has(rule)) {
    processedRules.add(n)
    return false
  }
  return true
}

function processRule(id, rule) {
  if (exist(rule)) return

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

const animationRE = /^(-\w+-)?animation$/
const animationNameRE = /^(-\w+-)?animation-name$/
function processAnimation(id, node) {
  if (exist(node)) return
  const prefix = `${id}-`
  const { prop, value } = node

  if (animationNameRE.test(prop)) {
    node.value = value
      .split(',')
      .map((v) => v === 'none'
        ? v.trim()
        : prefix + v.trim()
      )
      .join(',')
  } else if (animationRE.test(prop)) {
    node.value = animationScoped(value, prefix)
  }
}

function processKeyframes(id, node) {
  if (exist(node)) return
  if (/-?keyframes$/.test(node.name)) {
    node.params = `${id}-${node.params}`
  }
}

module.exports.postcss = true
