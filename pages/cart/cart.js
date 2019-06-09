const app = getApp();
import {
  CartModel
} from '../../service/cart.js';
Page({
  data: {
    imgBaseUrl: 'http://localhost:8080/BeerApp/oss/getFile?id=',
    // imgBaseUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559919497423&di=942a3cf070f7b95ee12515fe90d6108c&imgtype=0&src=http%3A%2F%2Fpic38.nipic.com%2F20140218%2F12473946_210124278328_2.jpg',
    list: [],
    // list: [{
    //   cargoName: '生啤1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    //   spec: {
    //     name: '2L',
    //     price: 0.02,
    //     img: ''
    //   },
    //   select: "circle",
    //   quantity: 1
    // }, {
    //   cargoName: '生啤1',
    //   spec: {
    //     name: '2L',
    //     price: 0.02,
    //     img: ''
    //   },
    //   select: "circle",
    //   quantity: 1
    // }, {
    //   cargoName: '生啤1',
    //   spec: {
    //     name: '2L',
    //     price: 0.02,
    //     img: ''
    //   },
    //   select: "circle",
    //   quantity: 1
    // }, {
    //   cargoName: '生啤1',
    //   spec: {
    //     name: '2L',
    //     price: 0.02,
    //     img: ''
    //   },
    //   select: "circle",
    //   quantity: 1
    // }, {
    //   cargoName: '生啤1',
    //   spec: {
    //     name: '2L',
    //     price: 0.02,
    //     img: ''
    //   },
    //   select: "circle",
    //   quantity: 1
    // }, {
    //   cargoName: '生啤1',
    //   spec: {
    //     name: '2L',
    //     price: 0.02,
    //     img: ''
    //   },
    //   select: "circle",
    //   quantity: 1
    // }],
    allSelect: "circle",
    num: 0,
    count: 0,
    delFlag: false
  },
  toManage: function() {
    this.setData({
      delFlag: true
    })
  },
  toCancel: function() {
    this.setData({
      delFlag: false
    })
  },
  toIndex: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  onLoad: function() {

  },
  onShow: function() {
    let cartModel = new CartModel();
    cartModel.getMyCart().then(res => {
      console.log(res.data);
      for (let i of res.data) {
        i.select = "circle"
      }
      this.setData({
        list: res.data,
        imgBaseUrl: app.globalData.imgBaseUrl
      })
    })
  },
  onTabItemTap: function() {},
  //改变选框状态
  change: function(e) {
    var that = this
    //得到下标
    var index = e.currentTarget.dataset.index
    //得到选中状态
    var select = e.currentTarget.dataset.select

    if (select == "circle") {
      var stype = "success"
    } else {
      var stype = "circle"
    }

    //把新的值给新的数组
    var newList = that.data.list
    newList[index].select = stype
    //把新的数组传给前台
    that.setData({
      list: newList
    })
    //调用计算数目方法
    that.countNum()
    //计算金额
    that.count()
  },
  //加法
  addtion: function(e) {
    var that = this
    //得到下标
    var index = e.currentTarget.dataset.index
    //得到点击的值
    var num = e.currentTarget.dataset.num
    //默认99件最多
    if (num < 100) {
      num++
    }
    //把新的值给新的数组
    var newList = that.data.list
    newList[index].quantity = num

    //把新的数组传给前台
    that.setData({
      list: newList
    })
    //调用计算数目方法
    that.countNum()
    //计算金额
    that.count()
  },
  //减法
  subtraction: function(e) {
    var that = this
    //得到下标
    var index = e.currentTarget.dataset.index
    //得到点击的值
    var num = e.currentTarget.dataset.num
    //把新的值给新的数组
    var newList = that.data.list
    if (num == 1) {
      // newList.splice(index, 1)
      return false;
    } else {
      num--
      newList[index].quantity = num
    }
    //把新的数组传给前台
    that.setData({
      list: newList
    })
    //调用计算数目方法
    that.countNum()
    //计算金额
    that.count()
  },
  bindManual: function(e) {
    console.log('change');
    var oldNum = e.currentTarget.dataset.num;
    var num = e.detail.value;
    //得到下标
    var index = e.currentTarget.dataset.index;
    console.log(num);
    //把新的值给新的数组
    var newList = this.data.list;
    let reg = /^[1-9]\d*$/
    if (num > 0 && num < 100 && reg.test(num)) {
      console.log('生效');
      newList[index].quantity = num
      // 将数值与状态写回  
      this.setData({
        list: newList
      });
      //调用计算数目方法
      this.countNum()
      //计算金额
      this.count()
    } else {
      newList[index].quantity = oldNum;
      this.setData({
        list: newList
      });
    }
  },
  //全选
  allSelect: function(e) {
    var that = this
    //先判断现在选中没
    var allSelect = e.currentTarget.dataset.select
    var newList = that.data.list
    if (allSelect == "circle") {
      //先把数组遍历一遍，然后改掉select值
      for (var i = 0; i < newList.length; i++) {
        newList[i].select = "success"
      }
      var select = "success"
    } else {
      for (var i = 0; i < newList.length; i++) {
        newList[i].select = "circle"
      }
      var select = "circle"
    }
    that.setData({
      list: newList,
      allSelect: select
    })
    //调用计算数目方法
    that.countNum()
    //计算金额
    that.count()
  },
  //计算数量
  countNum: function() {
    var that = this
    //遍历数组，把既选中的num加起来
    var newList = that.data.list
    var allNum = 0
    for (var i = 0; i < newList.length; i++) {
      if (newList[i].select == "success") {
        allNum += parseInt(newList[i].quantity)
      }
    }
    // parseInt
    console.log(allNum)
    that.setData({
      num: allNum
    })
  },
  //计算金额方法
  count: function() {
    var that = this
    //选中的订单，数量*价格加起来
    var newList = that.data.list
    var newCount = 0
    for (var i = 0; i < newList.length; i++) {
      if (newList[i].select == "success") {
        newCount += newList[i].quantity * newList[i].spec.price
      }
    }
    that.setData({
      count: newCount.toFixed(2)
    })
  },
  //结算
  toSettle: function() {
    //前往付款页
    if (this.data.num > 0) {
      let arr = [];
      let cartArr = JSON.parse(JSON.stringify(this.data.list));
      for (let i of cartArr) {
        if (i.select == "success") {
          arr.push({
            "cargoId": i.cargoId, //??
            "quantity": i.quantity,
            // "tradeId": "string"
            "cargoName": i.cargoName,
            "img": i.spec.img,
            "price": i.spec.price,
            "specId": i.spec.id, //??
            "specName": i.spec.name
          });
        }
      }
      let orderObj = {
        cargoArr: arr
      };
      wx.setStorageSync("orderObj", JSON.stringify(orderObj));
      wx.navigateTo({
        url: '../buy/buy'
      })
    }
  },
  //删除购物车
  deleteCart: function() {
    let arr = [];
    let flag = true;
    for (let i of this.data.list) {
      if (i.select == 'success') {
        flag = false;
        arr.push(i.id);
      }
    }
    //有可删除的选项
    if (flag == false) {
      var that = this;
      let cartModel = new CartModel();
      wx.showModal({
        title: '温馨提示',
        content: '是否清空已选择的货物',
        success: function(res) {
          if (res.confirm) {
            //获取已选中的购物车id删除
            cartModel.delMyCart(arr).then(res => {
              console.log(res.data);
              that.onShow();
            })
          }
        }
      })
    }
  }
})