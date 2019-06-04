// pages/center/center.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function() {
      // app.globalData.http.request({
      //   url: '/ApolloManagement/company/getAllCompany'
      // }).then(res => {
      //   console.log(res);
      // });
      // let req2 = app.globalData.http.request({
      //   url: '/ApolloManagement/company/getCompanyType'
      // });
      // Promise.all([req2, req1]).then(res => {
      //   console.log(res);
      // });
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
    getUserInfo: function(e) {
      console.log(e)
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
        url: '../orders/orders',
      })
    },
    //待付款
    bePaid: function() {
      wx.navigateTo({
        url: '../orders/orders?index=' + 0,
      })
    },
    //待发货
    beDelivered: function() {
      wx.navigateTo({
        url: '../orders/orders?index=' + 1,
      })
    },
    //待收货
    beReceived: function() {
      wx.navigateTo({
        url: '../orders/orders?index=' + 2,
      })
    },
    //待评价
    beEvaluated: function() {
      wx.navigateTo({
        url: '../orders/orders?index=' + 3,
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

    },
    //设置
    toSetting: function() {

    }
  }
})