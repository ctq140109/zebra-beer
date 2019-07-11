// pages/refund.js
import {
  OrdersModel
} from '../../service/orders.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length: 0,
    orderObj: {},
    reasons: [{
      name: '商品与原图不符啊',
      type: 'circle'
    }, {
      name: '尺寸不一致',
      type: 'circle'
    }, {
      name: '其他',
      type: 'circle'
    }],
    msg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options.item);
    let refundObj = wx.getStorageSync('refund');
    if (refundObj != '') {
      let obj = JSON.parse(refundObj);
      this.setData({
        orderObj: obj
      });
    }
  },
  //统计输入长度
  userInput: function(e) {
    this.setData({
      length: e.detail.value.length
    })
  },
  selectReason: function(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let arr = this.data.reasons;
    for (let i of arr) {
      i.type = 'circle'
    }
    arr[index].type = 'success';
    this.setData({
      msg: arr[index].name,
      reasons: arr
    })
  },
  refund: function() {
    //判断退款原因
    if (this.data.msg == '') {
      wx.showModal({
        title: '温馨提示',
        content: '请选择退款原因',
        showCancel: false
      });
      return false;
    }
    let item = this.data.orderObj;
    console.log(item);
    if (item.state == 2) {
      let ordersModel = new OrdersModel();
      ordersModel.refund(item.id, item.price).then(res => {
        console.log(res);
        ordersModel.cancelOrder(item.id).then(resp => {
          console.log(resp);
          wx.showToast({
            title: '退款成功',
            duration: 1000,
            mask: true
          });
          this.backToOrder();
        })
      })
    } else {
      let ordersModel = new OrdersModel();
      ordersModel.updateOrders(item.id, 0, item.type).then(res => {
        console.log(res);
        wx.showToast({
          title: '退款申请成功',
          duration: 1000,
          mask: true
        });
        this.backToOrder();
      })
    }
  },
  backToOrder() {
    setTimeout(() => {
      //返回上一页
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      wx.navigateBack({
        success: function() {
          prevPage.tabClick({ // 执行前一个页面的tabClick方法(获取全部订单)
            currentTarget: {
              id: 0
            }
          })
        }
      })
    }, 1000);
  }
})