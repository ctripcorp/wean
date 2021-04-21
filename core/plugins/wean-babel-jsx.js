const { transformSync } = require("@babel/core")
const componentTag = require("./babel-component-tag.js")
const jsx = require("@babel/plugin-transform-react-jsx").default

module.exports = {
  name: "wean-babel-jsx",
  transform(code, options) {
    return {
      code: transformSync(code, null, {
        plugins: [
          [componentTag(), { tag: options.tag }],
          jsx(
            "^7.0",
            { pragma: "fre.h", pragmaFrag: "fre.Fragment" },
            __dirname
          ),
        ],
      }),
    }
  },
}
