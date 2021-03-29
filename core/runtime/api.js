const graph = new Map()

function Page(option) {
  // 拍平 option
  let that = this
  for (let name in option) {
    const op = option[name]
    if (typeof op === "function") {
      that[name] = function (e) {
        if (e instanceof KeyboardEvent) {
          if (e.keyCode === 13) {
            let ev = createEv(e)
            op.call(that, ev)
          }
        } else {
          console.log(that)
          op.call(that, e)
        }
      }
    } else {
      that[name] = op
    }
  }
  // 挂 setData，这里之后可以用继承
  that.setData = function (data) {
    that.data = { ...that.data, data }
    Page.setState && Page.setState({})
  }
  // 挂到图上
  const childs = new Map()
  childs.set("/", that)
  graph.set(window.location.pathname, childs)
}

function Component(option,tag) {
  let that = this
  that.events = {}
  for (let name in option) {
    const op = option[name]
    that[name] = op
  }
  // 挂 props
  that.properties = { ...that.data, ...that.properties }

  // 挂方法
  that.triggerEvent = function (key, e) {
    const event = Component.props[key]
    event.call(that, e)
  }
  that.setData = function (data) {
    that.data = { ...that.data, data }
    Component.setState && Component.setState({})
  }

  const page = graph.get(window.location.pathname)
  if (page) {
    page.set(tag, that)
  }
}

function App(option) {
  graph.set("/", option)
  option.onLaunch()
}

window.$for = (arr, fn, key) => {
  arr = arr || []
  const res = arr.map((item) => fn(item))
  return fre.h("div", { children: res })
}

window.usePage = (setState) => {
  const page = graph.get(window.location.pathname).get("/")
  page.setState = setState
  return page
}

window.useComponent = (setState, props, tag) => {
  const page = graph.get(window.location.pathname)
  if (page) var component = page.get(tag)
  component.setState = setState
  for (const key in component.properties) {
    component.properties[key] = props[key] || component.properties[key].value
  }
  return component
}

window.getPage = () => {
  return graph.get(window.location.pathname)
}
window.getApp = () => graph.get("/")

function createEv(e) {
  return {
    type: e.type,
    tartget: {
      dataset: e.target.dataset,
    },
    currentTarget: {},
    detail: {
      value: e.target.value,
    },
  }
}

window.getUrl = function GetUrlParam(url) {
  let arrObj = url.split("?")
  let params = {}
  if (arrObj.length > 1) {
    arrObj = arrObj[1].split("&")
    arrObj.forEach((item) => {
      item = item.split("=")
      params[item[0]] = decodeURIComponent(item[1])
    })
  }
  return params
}
