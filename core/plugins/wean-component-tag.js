import someWeanPlugin from 'wean-plugin-xyz'
import somePostcssPlugin from 'postcss-plugin-xyz'


export default async function (config) {
    switch(config.mode){
        case 'build':
            config.plugins.push(
                // add any wean or rollup plugins
                someWeanPlugin(),
                // add some postcss plugin 
                somePostcssPlugin()
            )
            break
        case 'serve':
            config.middleware.push(
                // add any polka middleware:
                function myPolkaMiddleware(req, res, next) {
                    res.setHeader('X-Foo', 'bar');
                    next();
                }
            ) 
            break   
    }
}