// pages/center/center.js
const app = getApp();
import {
  OrdersModel
} from '../../service/orders.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    badgeObj: {}
  },
  //
  loginEvent: function (e) {
    //通过事件接收
    this.setData({
      hasUserInfo: e.detail.hasUserInfo,
      userInfo: e.detail.userInfo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    let openid = wx.getStorageSync("openid");
    let userinfo = wx.getStorageSync("userinfo");
    console.log(openid, userinfo);
    let dialog = this.selectComponent("#dialog");
    if (openid == "" || userinfo == "") {
      this.setData({
        userInfo: {},
        hasUserInfo: false
      })
      dialog.setData({
        isShow: true
      });
    } else {
      userinfo = JSON.parse(userinfo);
      this.setData({
        userInfo: userinfo,
        hasUserInfo: true
      });
      dialog.setData({
        isShow: false
      });
    }
  },
  onShow: function() {
    let dialog = this.selectComponent("#dialog");
    console.log(dialog.data.isShow);
    if (!dialog.data.isShow) {
      //获取订单分类数量
      let ordersModel = new OrdersModel();
      ordersModel.getOrderNum().then(res => {
        console.log(res.data);
        this.setData({
          badgeObj: res.data
        })
      })
    }
  },
  //全部订单
  toAllOrders: function() {
    wx.navigateTo({
      url: '../orders/orders?index=' + 0,
    })
  },
  //待付款
  bePaid: function() {
    wx.navigateTo({
      url: '../orders/orders?index=' + 1,
    })
  },
  //待发货
  beDelivered: function() {
    wx.navigateTo({
      url: '../orders/orders?index=' + 2,
    })
  },
  //待收货
  beReceived: function() {
    wx.navigateTo({
      url: '../orders/orders?index=' + 3,
    })
  },
  //待评价
  beEvaluated: function() {
    wx.navigateTo({
      url: '../orders/orders?index=' + 4,
    })
  },
  //收货地址
  toAddress: function() {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  //个人信息
  toPersonalInfo: function() {
    // wx.switchTab({
    //   url: '../cart/cart',
    // })
  },
  //设置
  toSetting: function() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})