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
  return arr.map((item) => fn(item))
}

window.Component = (tag, option) => {
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
            return op.call(page, ev)
          }
        } else {
          return op.call(page, e)
        }
      }
    }
  }
  page.data = option.data
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
    component.data = option.data

    for (const key in option.methods) {
      const fn = option.methods[key]
      const newFn = (e) => {
        return fn.call(component, e)
      }
      component.methods[key] = newFn
      component[key] = newFn
    }

    if (option.lifetimes) {
      const { attached, detached } = option.lifetimes
      if (attached) component.onLoad = attached.bind(component)
      if (detached) component.unLoad = detached.bind(component)
    }
  }

  component.triggerEvent = function (key, e) {
    const event = props[key]
    return event.call(component, e)
  }

  if (setState) {
    component.setData = function (data) {
      component.data = { ...option.data, ...data }
      option.data = component.data
      setState({})
    }
    component.setData = component.setData.bind(component)
  }
  component.properties = { ...properties, ...component.data }
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
