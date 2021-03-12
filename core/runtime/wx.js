window.wx = {
  canIUse(str) {
    return true
  },
  navigateTo: ({ url, duration }) => {
    history.pushState({}, "", url)
  },
  navigateBack({ delta }) {
    history.go(-delta)
  },
  reLaunch({ url }) {
    window.onload = url
  },
  showToast: (props, timer = null, dom = null) => {
    clearTimeout(timer)
    dom = dom || document.createElement("div")
    fre.render(fre.h(window.Component.Toast, props), dom)
    document.body.appendChild(dom)
    timer = setTimeout(() => {
      document.body.removeChild(dom)
    }, props.duration)
  },
  showModal: (props, dom = null) => {
    dom = dom || document.createElement("div")
    props.dom = dom
    fre.render(fre.h(window.Component.Modal, props), dom)
    document.body.appendChild(dom)
  },
  setNavigationBarTitle(data) {
    const fn = () => (document.titile = data.titile)
    callfn(fn, data)
  },
  setStorage(data) {
    const fn = () => localStorage.setItem(data.key, JSON.stringify(data.data))
    callfn(fn, data)
  },
  setStorageSync(data) {
    const fn = () => localStorage.setItem(data.key, JSON.stringify(data.data))
    callfn(fn, data)
  },
  getStorage(data) {
    const fn = () => localStorage.getItem(data.key)
    callfn(fn, data)
  },
  getStorageSync(data) {
    const fn = () => localStorage.getItem(data.key)
    callfn(fn, data)
  },
  removeStorge(data) {
    const fn = () => localStorage.removeItem(data.key)
    callfn(fn, data)
  },
  celarStorage(data) {
    const fn = () => localStorage.clear()
    callfn(fn, data)
  },
  request(data) {
    const config = { method: data.method || "GET", mode: "cors" }
    if (data.headers) config.headers = data.headers
    if (data.data) config.data = JSON.stringify(data.data)

    fetch(data.url, config)
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        data.success && data.success({ data:res })
      })
      .catch((e) => {
        data.fail && data.fail(e)
        throw e
      })
      .finally(() => data.complate && data.complate())
  },
  stopPullDownRefresh() {},
}

function callfn(
  fn,
  { success = () => {}, fail = () => {}, complate = () => {} },
  ...args
) {
  try {
    const res = fn(...args)
    success(JSON.parse(res))
  } catch (e) {
    fail(e)
  } finally {
    complate()
  }
}
