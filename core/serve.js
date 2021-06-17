const polka = require("polka")
const { PORT = 1234 } = process.env
const chalk = require("chalk")

module.exports = function serve(options) {
  const app = polka()
    .use(require("sirv")(options.o))
    .use(redirect)
    .get("/",(req,res)=>{
      res.end('hello world')
    })
    .get("*", (req, res) => {
      res.redirect("/")
    })
    .listen(PORT, (err) => {
      if (err) throw err
      console.log(chalk.green(`serve on localhost:${PORT}`))
    })
  return app.server
}

const redirect = function (req, res, next) {
  res.redirect = (location) => {
    let str = `Redirecting to ${location}`
    res.writeHead(302, {
      Location: location,
      "Content-Type": "text/plain",
      "Content-Length": str.length,
    })
    res.end(str)
  }
  next()
}
