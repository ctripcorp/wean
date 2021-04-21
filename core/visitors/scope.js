class Scope {
  constructor(options = {}) {
    this.name = options.name
    this.parent = options.parent
    this.params = options.params || []
  }
  add(name) {
    this.params.push(name)
  }
  findScope(name) {
    if (this.params.includes(name)) {
      return this
    }
    if (this.parent) {
      return this.parent.findScope(name)
    }
    return null
  }
}
module.exports = Scope
