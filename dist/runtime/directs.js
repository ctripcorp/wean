window.directs = {
  $for(arr, fn, key) {
    arr = arr || []
    const res = arr.map((item) => fn(item))
    return fre.h("div", { children: res })
  },
  $if(fn, vdom) {
    const bool = fn()
    if (bool) {
      return vdom()
    } else {
      return ""
    }
  },
  $else(fn, vdom) {
    const bool = fn()
    if (!bool) {
      return vdom()
    } else {
      return ""
    }
  },
  $elseif(){
    // todo 咋实现这个？
  },
  $ensure(name) {
    if (name) {
      return window.remotes[name]()
    }
  },
}
