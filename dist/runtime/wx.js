window.wx = {
  canIUse(str) {
    return true;
  },
  navigateTo: ({ url, duration }) => {
    history.pushState({}, "", url);
  },
  navigateBack({ delta }) {
    history.go(-delta);
  },
  reLaunch({ url }) {
    window.onload = url;
  },
  showToast: (props, timer = null, dom = null) => {
    clearTimeout(timer);
    dom = dom || document.createElement("div");
    fre.render(fre.h(window.Component.Toast, props), dom);
    document.body.appendChild(dom);
    timer = setTimeout(() => {
      document.body.removeChild(dom);
    }, props.duration);
  },
  showModal: (props, dom = null) => {
    dom = dom || document.createElement("div");
    props.dom = dom;
    fre.render(fre.h(window.Component.Modal, props), dom);
    document.body.appendChild(dom);
  },
  setNavigationBarTitle(options) {
    options = options || {};
    const fn = (args) => (document.titile = args.titile);
    callfn(fn, { ...options });
  },
  setStorage(options) {
    options = options || {};
    const fn = (args) =>
      localStorage.setItem(args.key, JSON.stringify(args.data));
    callfn(fn, { ...options });
  },
  setStorageSync(options) {
    options = options || {};
    const fn = () => localStorage.setItem(args.key, JSON.stringify(args.data));
    callfn(fn, { ...options });
  },
  getStorage(options) {
    options = options || {};
    const fn = (args) => {
      return { data: localStorage.getItem(args.key) };
    };
    callfn(fn, { ...options });
  },
  getStorageSync(options) {
    options = options || {};
    const fn = (args) => {
      return { data: localStorage.getItem(args.key) };
    };
    callfn(fn, { ...options });
  },
  removeStorge(options) {
    options = options || {};
    const fn = (args) => localStorage.removeItem(args.key);
    callfn(fn, { ...options });
  },
  celarStorage(options) {
    options = options || {};
    const fn = () => localStorage.clear();
    callfn(fn, { ...options });
  },
  request(data) {
    const config = { method: data.method || "GET", mode: "cors" };
    if (data.headers) config.headers = data.headers;
    if (data.data) config.data = JSON.stringify(data.data);

    fetch(data.url, config)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        data.success && data.success({ data: res });
      })
      .catch((e) => {
        data.fail && data.fail(e);
        throw e;
      })
      .finally(() => data.complate && data.complate());
  },
  getSystemInfo(options) {
    options = options || {};
    const systemInfo = window.navigator;
    let res = {
      navHeight: 0,
      statusBar: 0,
      pixelRatio: window.devicePixelRatio,
      screenWidth: screen.width,
      screenHeight: screen.height,
      windowWidth: screen.availWidth,
      windowHeight: screen.availHeight,
      language: navigator.language,
      platform: navigator.platform,
    };
    const fn = () => res;
    callfn(fn, { ...options });
  },
  stopPullDownRefresh() {},
};
function callfn(fn, { success, fail, complete, ...args }) {
  try {
    const res = fn(args);
    success && success(res);
  } catch (err) {
    fail && fail(err);
  } finally {
    complete && complete(status);
  }
}
