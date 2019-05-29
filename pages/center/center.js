// pages/center/center.js
const app = getApp()
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function() {
      wx.getSystemInfo({
        success: function(res) {
          console.log('宽度', res.windowWidth);
          console.log('高度', res.windowHeight);
        },
      })
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
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    },
    //全部订单
    toAllOrders:function(){

    },
    //待付款
    bePaid:function(){

    },
    //待发货
    beDelivered: function () {

    },
    //待收货
    beReceived: function () {

    },
    //待评价
    beEvaluated: function () {

    },
    //收货地址
    toAddress:function(){

    },
    //个人信息
    toPersonalInfo: function () {

    },
    //设置
    toSetting: function () {

    }
  }
})