function $2$import$a() {
  console.log(123);
}

var $2$import$d = {};
function b() {
  $2$import$a();
}

b();
Page({
  data: {
    name: "",
    editname: "",
    list: [],
    leftcount: 0
  },
  onShow: function () {
    this.setleftcount();
    this.setData(this.data);
  },

  selectAll() {
    let flag = this.data.list.some(item => !item.completed);
    this.data.list.forEach(item => item.completed = flag);
    this.setleftcount();
    this.setData(this.data);
  },

  clickIco(e) {
    let itemId = e.target.dataset.id;
    console.log(this.data.list);
    let item = this.data.list.find(item => item.id == itemId);
    item.completed = !item.completed;
    this.setData(this.data);
  },

  addtodo(e) {
    let addtodo = e.detail.value;
    this.data.list.push({
      id: this.data.list.length > 0 ? this.data.list[this.data.list.length - 1].id + 1 : 0,
      name: addtodo,
      completed: false
    });
    this.data.name = "";
    this.setleftcount();
    this.setData(this.data);
  },

  clearCompleted() {
    this.data.list = this.data.list.filter(item => !item.completed);
    this.setData(this.data);
  },

  reset() {
    this.data.name = "";
    this.data.editname = "";
    this.setData(this.data);
  },

  edittodo(e) {
    let itemId = e.target.dataset.id;
    this.data.list.find(item => item.id === itemId).name = e.detail.value;
    this.setData(this.data);
  },

  clear(e) {
    let itemId = e.target.dataset.id;
    let itemIndex = this.data.list.findIndex(item => item.id === itemId);
    this.data.list.splice(itemIndex, 1);
    this.setleftcount();
    this.setData(this.data);
  },

  setleftcount() {
    this.data.leftcount = this.data.list.filter(item => !item.completed).length;
  }

});