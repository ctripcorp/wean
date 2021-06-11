const fs = require('fs')

// TODO: bit op

module.exports = options => {
    return {
        name: 'componentTag',
        setup(build) {
            build.onLoad({ filter: /.+/ }, async ({ path }) => {
                const source = await fs.promises.readFile(path, "utf8")
                const code = source.replace('Component(', `Component('${options.id}', `).replace('Page(', `Page('${options.id}', `)
                return {
                    contents: code,
                }
            })
        }
    }
}