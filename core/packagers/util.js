function toHump(name) {
  return name.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase())
}

const titleCase = (str) => str.slice(0, 1).toUpperCase() + toHump(str).slice(1)

const random = function randomString(len) {
  len = len || 6
  var $chars = "abcdefhijkmnprstwxyz"
  var letter = ""
  for (i = 0; i < len; i++) {
    letter += $chars.charAt(Math.floor(Math.random() * $chars.length))
  }
  return letter
}

module.exports = {
  titleCase: titleCase,
  random: random,
}
