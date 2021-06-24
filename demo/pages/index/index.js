import { a } from './a.js'
import d from './a.js'
import dayjs from './dayjs.js'
console.log(dayjs)

function b() {
  a()
}
b()

const app = getApp()

Page({
  data: {
    name: "",
    editname: "",
    list: [],
    leftcount: 0,
    a: true,
    b: true,
    c: false
  },

  onLoad() {
    console.log('onLoad')
  },

  eeevent(detail,option){
    console.log('triggerEvent',detail)
  },

  eee(e){
    console.log(123)
  },

  navigateTo(){
    wx.navigateTo({
      url: '/pages/child/index?aaa=1&bbb=2',
      success: (result) => {},
      fail: (res) => {
        console.log(res)
      },
      complete: (res) => {},
    })
  },

  onShow: function () {
    console.log('onShow')
    this.setleftcount()
    this.setData(this.data)
  },

  onReady: function () {
    console.log('onReady')
  },

  selectAll() {
    let flag = this.data.list.some((item) => !item.completed)
    this.data.list.forEach((item) => (item.completed = flag))
    this.setleftcount()
    this.setData(this.data)
  },

  clickIco(e) {
    let itemId = e.target.dataset.id
    console.log(this.data.list)
    let item = this.data.list.find((item) => item.id == itemId)
    item.completed = !item.completed
    this.setData(this.data)
  },

  addtodo(e) {
    let addtodo = e.detail.value
    this.data.list.push({
      id:
        this.data.list.length > 0
          ? this.data.list[this.data.list.length - 1].id + 1
          : 0,
      name: addtodo,
      completed: false,
    })
    this.data.name = ""
    this.setleftcount()
    this.setData(this.data)
  },

  clearCompleted() {
    this.data.list = this.data.list.filter((item) => !item.completed)
    this.setData(this.data)
  },

  reset() {
    this.data.name = ""
    this.data.editname = ""
    this.setData(this.data)
  },

  edittodo(e) {
    let itemId = e.target.dataset.id
    this.data.list.find((item) => item.id === itemId).name = e.detail.value
    this.setData(this.data)
  },

  clear(e) {
    let itemId = e.target.dataset.id
    let itemIndex = this.data.list.findIndex((item) => item.id === itemId)
    this.data.list.splice(itemIndex, 1)
    this.setleftcount()
    this.setData(this.data)
  },

  toast() {
    wx.showToast({
      title: "222", 
      success(res) {
        console.log(res)
      }
    })
  },

  motal() {
    wx.showModal({
      title: '333',
    })
  },


  setleftcount() {
    this.data.leftcount = this.data.list.filter(
      (item) => !item.completed
    ).length
  },
})
