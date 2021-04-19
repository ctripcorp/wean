const { transformSync } = require("@babel/core")
const componentTag = require("./plugins/babel-component-tag")

export default {
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
