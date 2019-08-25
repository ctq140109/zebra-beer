// pages/order/balance/balance.js
import {
  PayModel
} from '../../service/pay.js';
import {
  OrdersModel
} from '../../service/orders.js';
import {
  Tool
} from '../../public/tool.js';
var tool = new Tool();
var ordersModel = new OrdersModel();
var payModel = new PayModel();
const formatTime = require('../../public/formattime.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cartList: [], //购物列表
    sumMonney: 0, //总计
    cupNumber: 0, //购物数量
    message: '', //留言
    sitNum: '' //桌号
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cartList: wx.getStorageSync('cartList'),
      sumMonney: wx.getStorageSync('sumMonney'),
      cupNumber: wx.getStorageSync('cupNumber'),
      sitNum: wx.getStorageSync('sitNum')
    })
  },
  setMessage: function(e) {
    this.setData({
      message: e.detail.value
    })
  },
  gopay: function() {
    let openid = wx.getStorageSync("openid");
    if (openid != '') {
      let cargoArr = this.data.cartList;
      let cargoList = [];
      for (let i of cargoArr) {
        cargoList.push({
          "cargoId": i.cargoId,
          "quantity": i.number,
          "cargoName": i.name,
          "img": i.img,
          "price": i.price,
          "specId": i.specId,
          "specName": i.specName,
          "state": 0,
          "userId": openid
        })
      }
      let data = {
        "address": "",
        "cargoList": cargoList,
        "message": this.data.message,
        "price": this.data.sumMonney,
        "cargoPrice": this.data.sumMonney,
        "couponPrice": 0,
        "deliveryPrice": 0,
        "state": 1,
        "lat": '',
        "lng": '',
        "userId": openid,
        "receiver": "",
        "phone": "",
        "type": 3, //1配送，2自提
        "seatNum": this.data.sitNum //桌号
      };
      console.log(data);
      ordersModel.addOrders(data).then(res => {
        //下单成功
        console.log(res);
        this.pay(res.data); //获取到订单号
      })
    }
  },
  pay: function(trade_no) {
    console.log('开始支付');
    let that = this;
    let total_fee = tool.multiple(this.data.sumMonney, 100); //标价金额（分为单位）
    let body = '斑马-生啤超市'; //商品描述
    let openid = wx.getStorageSync("openid");
    payModel.pay(trade_no, total_fee, body).then(res => {
      console.log(res);
      wx.requestPayment({
        // appId: res.data.appid, //"wxd4eb0a949e945984"
        timeStamp: res.data.timestamp,
        nonceStr: res.data.nonce_str,
        package: res.data.package, //'prepay_id=' + res.data.prepay_id
        paySign: res.data.sign,
        signType: 'MD5',
        success(resp) {
          console.log(resp);
          //支付成功,待发货订单
          // ordersModel.updateOrders(trade_no, 2, 3).then(res => {
            // console.log(res);
            //支付成功页
            that.toResult(trade_no, 1);
          // })
        },
        fail(resp) {
          console.log(resp);
          let data = {
            "nonceStr": res.data.nonce_str,
            "packages": res.data.package,
            "sign": res.data.sign,
            "id": trade_no,
            "timestamp": res.data.timestamp,
            "state": 1,
            "type": 3
          };
          ordersModel.updateOrder(data).then(res => {
            console.log(res);
            //支付失败页
            that.toResult(trade_no, 0);
          })
        }
      })
    })
  },
  toResult: function(trade_no, paid) {
    console.log('有跳转');
    let order_pay_info = {
      orderId: trade_no,
      _pay_time: formatTime.formatTime(new Date()),
      pay_price: this.data.sumMonney,
      paid: paid,
      isEat:true,
      sitNum: this.data.sitNum
    };
    wx.navigateTo({
      url: '../result/result?order_pay_info=' + JSON.stringify(order_pay_info)
    })
  }
})