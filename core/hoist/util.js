const t = require("@babel/types")

function getName(asset, type, ...rest) {
  return `$${asset.id}$${type}${
    rest.length > 0
      ? "$" +
        rest
          .map((name) => (name === "default" ? name : t.toIdentifier(name)))
          .join("$")
      : ""
  }`
}
function getExportId(asset, name) {
  return getId(asset, "export", name)
}

exports.getName = getName
exports.getExportId = getExportId
