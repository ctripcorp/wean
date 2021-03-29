const graph = new Map()
class App$ {
  constructor(option) {
    this.option = option
  }
  onLoad() {
    this.option.onLoad && this.option.onLoad()
  }
}

class Page$ {
  constructor(option) {
    for (let name in option) {
      if (typeof option[name] === "function") {
        this[name] = function (e) {
          if (e instanceof KeyboardEvent) {
            if (e.keyCode === 13) {
              let ev = createEv(e)
              op.call(this, ev)
            }
          } else {
            op.call(this, e)
          }
        }
      } else {
        this[name] = option[name]
      }
    }
  }
  onLoad() {
    // this.onLoad && this.onLoad()
  }
  setData(data) {
    this.data = { ...this.data, data }
    Page$.setState && Page$.setState({})
  }
}

class Component$ {
  constructor(option, tag) {
    this.option = option
    this.tag = tag
  }
  onLoad() {
    console.log(this)
    this.option.onLoad && this.option.onLoad()
  }
}

window.App = (option) => {
  graph.set("/", new App$(option))
  option.onLaunch()
}

window.Page = (option) => {
  const childs = new Map()
  childs.set("/", new Page$(option))
  graph.set(window.location.pathname, childs)
}

window.$for = (arr, fn, key) => {
  arr = arr || []
  const res = arr.map((item) => fn(item))
  return fre.h("div", { children: res })
}

window.Component = (option, tag) => {
  const page = graph.get(window.location.pathname)
  if (page) {
    page.set(tag, new Component$(option, tag))
  }
}

window.usePage = (setState) => {
  const page = graph.get(window.location.pathname).get("/")
  page.setState = setState
  return page
}

window.useComponent = (setState, props, tag) => {
  const page = graph.get(window.location.pathname)
  if (page) var option = page.get(tag)
  let component = {
    methods: {},
  }
  let properties = {}

  if (option) {
    if (!component.events) component.events = {}
    for (const key in option.properties) {
      properties[key] = props[key] || option.properties[key].value
    }
    component.properties = { ...option.data, ...properties }

    for (const key in option.methods) {
      const fn = option.methods[key]
      component.methods[key] = (e) => {
        fn.call(component, e)
      }
    }

    if (option.lifetimes) {
      component.onLoad = option.lifetimes.attached
      component.unLoad = option.lifetimes.detached
    }
  }

  component.triggerEvent = function (key, e) {
    const event = props[key]
    event.call(component, e)
  }

  if (setState) {
    component.setData = function (data) {
      page.data = { ...option.data, ...data }
      setState({})
    }
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
