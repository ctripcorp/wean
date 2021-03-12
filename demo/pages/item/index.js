Component({
  properties: {
    item: {
      type: Object,
      value: {},
    },
  },
  methods: {
    clickIco(e){
      this.triggerEvent('myevent',e)
    },
    clear(e){
      this.triggerEvent('clear',e)
    }
  }
})
