// pages/buy/buy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowlocation:null
  },
  toAddress: function() {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  getLocation: function() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res);
        var latitude = res.latitude
        var longitude = res.longitude
        console.log("lat:" + latitude + ",lon:" + longitude)
        that.getCity(latitude, longitude);
      },
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  getCity: function(latitude, longitude) {
    var that = this;
    var url = "https://api.map.baidu.com/geocoder/v2/";
    var params = {
      ak: "GNGRtChYZkUtEojpd9kVLPydQ5Gt3CDV", //
      output: "json",
      location: latitude + "," + longitude
    }
    wx.request({
      url: url,
      data: params,
      success: function(res) {
        console.log(res)
        that.setData({
          nowlocation: res.data.result.formatted_address,
        })
      },
    })
  },
  toPay: function() {
    let times = new Date().getTime();
    wx.requestPayment({
      timeStamp: times,
      nonceStr: 'sadadwdadwd',
      package: '',
      signType: '',
      paySign: '',
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var pages = getCurrentPages(); // 当前页面
    // var beforePage = pages[pages.length - 2]; // 前一个页面
    // console.log(beforePage);
    // wx.navigateBack({
    //   success: function() {
    //     beforePage.onLoad(); // 执行前一个页面的onLoad方法
    //   }
    // })
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