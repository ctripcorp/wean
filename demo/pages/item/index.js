const app = getApp()

Component({
  properties: {
    iitem: {
      type: Object,
      value: {},
    },
  },
  methods: {
    clickIco(e) {
      this.triggerEvent("myevent", e)
    },
    clear(e) {
      this.triggerEvent("myevent", e)
    },
  },
  lifetimes: {
    attached: function () {
      console.log(233)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
