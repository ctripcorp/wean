function analyse(ast, magicString, module) {
  ast.body.forEach((statement) => {
    // 待补充
    statement.source = magicString.snip(statement.start, statement.end)
  })
}
module.exports = analyse
