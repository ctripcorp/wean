window.directs = {
  $for(arr, fn, key) {
    arr = arr || []
    const res = arr.map((item) => fn(item))
    return fre.h("div", { children: res })
  },
  $ensure(name) {
    if (name) {
      return window.remotes[name]()
    }
  },
}
