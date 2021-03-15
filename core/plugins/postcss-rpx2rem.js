const postcss = require("postcss")

const defaults = {
  targetUnit: "rpx",
  outputUnit: "rem",
  proportion: 0.01, // 1rpx = 0.01rem
  unitPrecision: 5,
  replace: true,
  mediaQuery: false,
}

function toFixed(number, precision) {
  const multiplier = Math.pow(10, precision + 1)
  const wholeNumber = Math.floor(number * multiplier)
  const fixedWholeNumber = Math.round(wholeNumber / 10) * 10
  return fixedWholeNumber / multiplier
}

function declarationExists(decls, prop, value) {
  return decls.some((decl) => decl.prop === prop && decl.value === value)
}

module.exports = (options) => {
  const {
    targetUnit,
    outputUnit,
    proportion,
    unitPrecision,
    replace,
    mediaQuery,
  } = Object.assign({}, defaults, options)

  const replaceFn = (m, $1) => {
    if (!$1) {
      return m
    }
    const value = toFixed(parseFloat($1) * proportion, unitPrecision)
    return value === 0 ? "0" : `${value}${outputUnit}`
  }

  const replaceRegex = new RegExp(
    `"[^"]+"|'[^']+'|url\\([^)]+\\)|(\\d*\\.?\\d+)${targetUnit}`,
    "g"
  )

  return {
    postcssPlugin: 'postcss-rpx2rem',
    Once(root) {
      root.walkRules((rule, result) => {
        rule.walkDecls((decl) => {
          if (decl.value.indexOf(targetUnit) === -1) return
          const value = decl.value.replace(replaceRegex, replaceFn)
          if (declarationExists(decl.parent, decl.prop, value)) return
          if (replace) {
            decl.value = value
          } else {
            decl.parent.insertAfter(result, decl.clone({ value }))
          }
        })
      })

      if (mediaQuery) {
        root.walkAtRules("media", (rule) => {
          if (rule.params.indexOf(targetUnit) === -1) return
          rule.params = rule.params.replace(replaceRegex, replaceFn)
        })
      }
    },
  }
}
module.exports.postcss = true