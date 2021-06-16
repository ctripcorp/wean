const fs = require('fs')

module.exports = options => {
    return {
        name: 'componentTag',
        setup(build) {
            build.onLoad({ filter: /.+/ }, async ({ path }) => {
                const source = await fs.promises.readFile(path, "utf8")
                const code = source.replace('Component(', `Component('${options.id}','${options.tag}', `).replace('Page(', `Page('${options.id}', `)
                return {
                    contents: code,
                }
            })
        }
    }
}