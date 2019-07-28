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
    badgeObj: {},
    CustomBar:app.globalData.CustomBar
  },
  //
  loginEvent: function(e) {
    //通过事件接收
    this.setData({
      hasUserInfo: e.detail.hasUserInfo,
      userInfo: e.detail.userInfo
    })
  },
  onShareAppMessage() {
    return {
      title: '笙酿酒工坊',
      path: 'pages/index/index'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    this.onLoad();
    let dialog = this.selectComponent("#dialog");
    console.log(dialog.data.isShow);
    if (!dialog.data.isShow) {
      wx.showLoading({
        title: '加载中',
      })
      //获取订单分类数量
      let ordersModel = new OrdersModel();
      ordersModel.getOrderNum().then(res => {
        console.log(res.data);
        this.setData({
          badgeObj: res.data
        })
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
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
  //堂食
  toTanshi: function() {
    wx.navigateTo({
      url: '../eat/eat',
    })
  },
  //设置
  toSetting: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('下拉刷新');
    wx.showNavigationBarLoading();
    this.onShow();
  }
})