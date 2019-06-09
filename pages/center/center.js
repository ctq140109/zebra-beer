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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    badgeObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(1);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onTabItemTap: function(item) {
    console.log(item);
    //获取订单分类数量
    let ordersModel = new OrdersModel();
    ordersModel.getOrderNum().then(res => {
      console.log(res.data);
      this.setData({
        badgeObj: res.data
      })
    })
  },
  getUserInfo: function(e) {
    console.log(e);
    if (e.detail.userInfo == undefined) {
      this.setData({
        hasUserInfo: false
      })
    } else {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
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
    wx.switchTab({
      url: '../cart/cart',
    })
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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