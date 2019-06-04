// Page({
//   data: {
//     cartList: [{
//       image: '../image/1-1.jpg',
//       cargoName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//       nowPrice: '299'
//     }, {
//       image: '../image/1-2.jpg',
//       cargoName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//       nowPrice: '299'
//     }, , {
//       image: '../image/1-2.jpg',
//       cargoName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//       nowPrice: '299'
//     }, , {
//       image: '../image/1-2.jpg',
//       cargoName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//       nowPrice: '299'
//     }, , {
//       image: '../image/1-2.jpg',
//       cargoName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//       nowPrice: '299'
//     }, , {
//       image: '../image/1-2.jpg',
//       cargoName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//       nowPrice: '299'
//     }, , {
//       image: '../image/1-2.jpg',
//       cargoName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//       nowPrice: '299'
//     }],
//   },
//   toIndex: function() {
//     wx.switchTab({
//       url: '../index/index'
//     })
//   }
// })
Page({
  data: {
    list: [{
      code: "0001",
      name: "无人机xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      url: "http://i1.mifile.cn/a1/pms_1487824962.01314237!220x220.jpg",
      style: "低配版",
      price: "299",
      select: "circle",
      num: "1"
    }],
    allSelect: "circle",
    num: 0,
    count: 0
  },
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
    newList[index].num = num

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
    //当1件时，点击移除
    if (num == 1) {
      // newList.splice(index, 1)
      return false;
    } else {
      num--
      newList[index].num = num
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
        allNum += parseInt(newList[i].num)
      }
    }
    parseInt
    console.log(allNum)
    that.setData({
      num: allNum
    })
  },
  //计算金额方法
  count: function() {
    var that = this
    //思路和上面一致
    //选中的订单，数量*价格加起来
    var newList = that.data.list
    var newCount = 0
    for (var i = 0; i < newList.length; i++) {
      if (newList[i].select == "success") {
        newCount += newList[i].num * newList[i].price
      }
    }
    that.setData({
      count: newCount
    })
  }
})