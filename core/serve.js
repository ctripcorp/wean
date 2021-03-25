const polka = require("polka")
const { PORT = 1234 } = process.env
const fetch = require("cross-fetch")
const chalk = require("chalk")

module.exports = function serve(options) {
  const app = polka()
    .use(require("sirv")(options.o))
    .use(redirect)
    .get("/tuchong/", (req, res) => {
      fetch("https://api.tuchong.com/feed-app")
        .then((res) => res.json())
        .then((data) => {
          res.end(JSON.stringify(data), "utf-8")
        })
    })
    .get("/site/", (req, res) => {
      fetch(
        "https://fengcao.tuchong.com/rest/2/sites/12772247/posts?count=20&page=1&before_timestamp=0"
      )
        .then((res) => res.json())
        .then((data) => {
          res.end(JSON.stringify(data), "utf-8")
        })
    })
    .get("*", (req, res) => {
      res.redirect("/")
    })
    .listen(PORT, (err) => {
      if (err) throw err
      console.log(chalk(`serve on localhost:${PORT}`))
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
