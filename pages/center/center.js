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
    imgBaseUrl: app.globalData.imgBaseUrl,
    userInfo: {},
    hasUserInfo: false,
    badgeObj: {},
    badgeArr: [],
    CustomBar: app.globalData.CustomBar,
    iconListOne: [{
      id: 1,
      name: '待付款',
      url: '/pages/orders/orders?index=1',
      src: '/pages/image/center/dfk.png'
    }, {
      id: 2,
      name: '待发货',
      url: '/pages/orders/orders?index=2',
      src: '/pages/image/center/dfh.png'
    }, {
      id: 3,
      name: '待收货',
      url: '/pages/orders/orders?index=3',
      src: '/pages/image/center/dsh.png'
    }, {
      id: 4,
      name: '待评价',
      url: '/pages/orders/orders?index=4',
      src: '/pages/image/center/dpj.png'
    }],
    iconListTwo: [],
    iconListThree: [{
      src: 'e6c5a03d554e487ca1f3a66e6fdae38d'
    }]
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
    app.getIcons().then(res => {
      this.setData({
        iconListOne:app.globalData.iconListOne,
        iconListTwo: app.globalData.iconListTwo,
        iconListThree: app.globalData.iconListThree
      })
    });
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
        let badgeArr = [res.data.prePay, res.data.preDeliver, res.data.preReceive, res.data.preEvaluate];
        this.setData({
          badgeObj: res.data,
          badgeArr: badgeArr
        });
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      })
    }
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