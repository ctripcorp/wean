const graph = new Map()

window.App = (option) => {
  graph.set("/", option)
  option.onLaunch()
}

window.Page = (option) => {
  const childs = new Map()
  childs.set("/", option)
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
    page.set(tag, option)
  }
}

window.usePage = (setState) => {
  const option = graph.get(window.location.pathname).get("/")

  let page = option

  if (setState) {
    page.setData = function (data) {
      page.data = { ...option.data, ...data }
      setState({})
    }
  }

  for (let name in option) {
    const op = option[name]
    if (name === "setData" || (name[0] === "o" && name[1] === "n")) {
      page[name] = op.bind(page)
    } else if (typeof op === "function") {
      page[name] = function (e) {
        if (e instanceof KeyboardEvent) {
          if (e.keyCode === 13) {
            let ev = createEv(e)
            op.call(page, ev)
          }
        } else {
          op.call(page, e)
        }
      }
    }
  }
  page.data = option.data
  return page
}

window.useComponent = (setState, props, tag) => {
  const page = graph.get(window.location.pathname)
  if (page) var option = page.get(tag) // {}
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
