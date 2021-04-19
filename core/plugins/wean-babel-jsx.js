const { transformSync } = require("@babel/core")
const componentTag = require("./plugins/babel-component-tag")

module.exports = {
  name: "wean-babel-jsx",
  transform(code, options) {
    const code = transformSync(code, null, {
      plugins: [[componentTag(), { tag: options.tag }]],
    })
    return {
      code,
    }
  },
}
