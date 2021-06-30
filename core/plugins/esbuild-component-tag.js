const fs = require('fs')

module.exports = options => {
    return {
        name: 'componentTag',
        setup(build) {
            build.onLoad({ filter: /.+/ }, async ({ path }) => {
                const source = await fs.promises.readFile(path, "utf8")
                const pagecode = `\nPage.id="${options.id}"\n` + source
                const componentcode = `\nComponent.id="${options.id}"\nComponent.pid="${options.pid}"\nComponent.tag="${options.tag || ''}"\n` + source
                return {
                    contents: options.tag ? componentcode : pagecode,
                }
            })
        }
    }
}