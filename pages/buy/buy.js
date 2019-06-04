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
    address: '暂无收货地址，请添加',
    addressId: null,
    totalPrice: 0.00
  },
  toAddress: function() {
    wx.setStorageSync("selectFlag", "true");
    wx.navigateTo({
      url: '../address/address',
    })
  },
  setMessage: function(e) {
    console.log(e.detail.value);
    this.setData({
      message: e.detail.value
    })
  },
  toPay: function() {
    if (this.data.addressId == null) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择收货地址',
        showCancel: false
      });
      return false;
    }
    let openid = wx.getStorageSync("openid");
    let cargoId = this.data.orderObj.cargoItem.id;
    let quantity = this.data.orderObj.quantity;
    let totalPrice = this.data.totalPrice;
    let data = {
      "addressId": this.data.addressId,
      "cargoList": [{
        "cargoId": cargoId,
        "price": this.data.orderObj.cargoItem.nowPrice,
        "quantity": quantity,
        // "tradeId": "string"
      }],
      // "evaluation": "string",
      // "id": "string",
      "message": this.data.message,
      // "pageItem": {
      //   "page": 0,
      //   "size": 0
      // },
      "price": totalPrice,
      "state": 1,
      "userId": openid
    };
    app.globalData.http.request({
      url: '/BeerApp/trade/add.do',
      data: data,
      method: 'POST',
      header: 'json'
    }).then(res => {
      //下单成功
      console.log(res);
      this.pay();
    })
  },
  pay: function() {
    console.log('开始支付');
    let out_trade_no = '20190604100001'; //商户订单号
    let total_fee = this.data.totalPrice; //标价金额（分为单位）
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
        signType: 'MD5',
        success(res) {
          console.log(res);
          //支付成功,待发货订单
        },
        fail(res) {
          console.log(res);
          //失败,待付款订单
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
    this.setData({
      totalPrice: orderObj.quantity * orderObj.cargoItem.nowPrice
    })
    //获取我的地址
    let addressModel = new AddressModel();
    if (wx.getStorageSync("openid") != null) {
      addressModel.getAddress(wx.getStorageSync("openid")).then(res => {
        let flag = true;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].state == 1) {
            flag = false;
            this.setData({
              addressId: res.data[i].id,
              address: res.data[i].city + res.data[i].addr
            })
          }
        }
        if (flag == true && res.data.length > 0) {
          this.setData({
            address: '暂无默认地址，请选择'
          })
        }
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