const app = getApp();
import {
  AddressModel
} from '../../service/address.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderObj: {},
    message: '',
    nowlocation: null
  },
  toAddress: function() {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  // getLocation: function() {
  //   var that = this;
  //   wx.getLocation({
  //     type: 'wgs84',
  //     success: function(res) {
  //       console.log(res);
  //       var latitude = res.latitude
  //       var longitude = res.longitude
  //       console.log("lat:" + latitude + ",lon:" + longitude)
  //       that.getCity(latitude, longitude);
  //     },
  //     fail: function(res) {},
  //     complete: function(res) {}
  //   })
  // },
  // getCity: function(latitude, longitude) {
  //   var that = this;
  //   var url = "https://api.map.baidu.com/geocoder/v2/";
  //   var params = {
  //     ak: "GNGRtChYZkUtEojpd9kVLPydQ5Gt3CDV", //
  //     output: "json",
  //     location: latitude + "," + longitude
  //   }
  //   wx.request({
  //     url: url,
  //     data: params,
  //     success: function(res) {
  //       console.log(res)
  //       that.setData({
  //         nowlocation: res.data.result.formatted_address,
  //       })
  //     },
  //   })
  // },
  setMessage: function(e) {
    console.log(e.detail.value);
    this.setData({
      message: e.detail.value
    })
  },
  toPay: function() {
    // let times = new Date().getTime();
    // console.log(times);
    let address = 1;
    let openid = wx.getStorageSync("openid");
    let cargoId = this.data.orderObj.cargoItem.id;
    let quatity = this.data.orderObj.quatity;

    let data = {
      "addressId": address,
      "cargoList": [{
        "cargoId": cargoId,
        "price": this.data.orderObj.cargoItem.nowPrice,
        "quantity": quatity,
        // "tradeId": "string"
      }],
      // "evaluation": "string",
      // "id": "string",
      "message": this.data.message,
      // "pageItem": {
      //   "page": 0,
      //   "size": 0
      // },
      "price": this.data.orderObj.cargoItem.nowPrice * quatity,
      "state": 1,
      "userId": openid
    };
    app.globalData.http.request({
      url: '/BeerApp/trade/add.do',
      data: data,
      method: 'POST',
      header: 'json'
    }).then(res => {
      console.log(res);
      this.pay();
      //下单成功
    })
  },
  pay: function() {
    console.log('开始支付');
    let out_trade_no = '20190604100001'; //商户订单号
    let total_fee = 1; //标价金额（分为单位）
    let body = '斑马-超市'; //商品描述
    let openid = wx.getStorageSync("openid");
    app.globalData.http.request({
      url: '/BeerApp/wx/pay.do?out_trade_no=' + out_trade_no + '&total_fee=' + total_fee + '&body=' + body + '&openid=' + openid,
      method: 'POST',
      header: 'json'
    }).then(res => {
      console.log(res);
      //调支付接口
      wx.requestPayment({
        timeStamp: res.data.timestamp,
        nonceStr: res.data.nonce_str,
        package: 'prepay_id=' + res.data.prepay_id,
        paySign: res.data.sign,
        signType:'MD5',
        success(res) {
          console.log(res);
        },
        fail(res) {
          console.log(res)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(options.orderObj);
    let orderObj = JSON.parse(options.orderObj);
    this.setData({
      orderObj: orderObj
    })
    //获取我的地址
    let addressModel = new AddressModel();
    if (wx.getStorageSync("openid") != null) {
      addressModel.getAddress(wx.getStorageSync("openid")).then(res => {
        // for (let i = 0; i < res.data.length; i++) {

        // }
        wx.hideLoading();
      })
    }
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