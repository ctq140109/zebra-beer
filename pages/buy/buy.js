const app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
import {
  AddressModel
} from '../../service/address.js';
import {
  OrdersModel
} from '../../service/orders.js';
import {
  CartModel
} from '../../service/cart.js';
import {
  PayModel
} from '../../service/pay.js';
import {
  ShopModel
} from '../../service/shop.js';
import {
  Tool
} from '../../public/tool.js';
var tool = new Tool();
const formatTime = require('../../public/formattime.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showSend: true,
    sendArr: [{
        id: 1,
        name: '配送',
        check: true
      },
      {
        id: 2,
        name: '自提',
        check: false
      }
    ],
    orderObj: {
      cargoArr: []
    },
    addressObj: null,
    message: '',
    addrFlag: false,
    address: '暂无收货地址，请添加',
    // addressId: null,
    imgBaseUrl: '',
    totalPrice: 0, //实付款
    goodsPrice: 0, //商品价格合计
    sendFee: 0,
    currentIndex: 0 //发货方式当前项
  },
  toAddress: function() {
    wx.setStorageSync("selectFlag", "true");
    wx.navigateTo({
      url: '../address/address',
    })
  },
  setMessage: function(e) {
    // console.log(e.detail.value);
    this.setData({
      message: e.detail.value
    })
  },
  isClosed() {
    let timeFlag = wx.getStorageSync("timeFlag");
    let dialog = this.selectComponent("#close-shop");
    if (timeFlag == true) {
      dialog.setData({
        isState: true,
        isShow: false
      })
      return true;
    } else {
      dialog.setData({
        isState: false,
        isShow: true
      })
      return false;
    }
  },
  preBuy: function() {
    let shopModel = new ShopModel();
    var that = this;
    shopModel.getStatus().then(res => {
      console.log(res);
      wx.setStorageSync("timeFlag", res.data);
      if (!res.data) {
        wx.showModal({
          title: '温馨提示',
          content: '当前门店已休息，订单发货需到营业时间内发货，确认下单吗？',
          success(res) {
            if (res.confirm) {
              that.toPay();
            }
          }
        })
      } else {
        that.toPay();
      }
    })
  },
  toPay: function() {
    if (this.data.addressObj == null && this.data.showSend == true) { //配送时需要填写地址
      wx.showModal({
        title: '温馨提示',
        content: '请选择收货地址',
        showCancel: false
      });
      return false;
    }
    console.log(this.data.addressObj);
    let openid = wx.getStorageSync("openid");
    let orderObj = wx.getStorageSync("orderObj");
    if (openid != '' && orderObj != '') {
      let cargoArr = this.data.orderObj.cargoArr;
      let cargoList = [];
      for (let i of cargoArr) {
        cargoList.push({
          "cargoId": i.id,
          "quantity": i.quantity,
          // "tradeId": "string"
          "cargoName": i.cargoName,
          "img": i.img,
          "price": i.price,
          "specId": i.specId,
          "specName": i.specName,
          "state": 0,
          "userId": openid
        })
      }
      let data = {
        "address": this.data.showSend ? this.data.addressObj.city + "(" + this.data.addressObj.addr + ")" : "",
        "cargoList": cargoList,
        "message": this.data.message,
        "price": this.data.totalPrice,
        "cargoPrice": this.data.goodsPrice,
        "couponPrice": 0,
        "deliveryPrice": this.data.showSend ? this.data.sendFee : 0,
        "state": 1,
        "lat": this.data.showSend ? this.data.addressObj.lat : '',
        "lng": this.data.showSend ? this.data.addressObj.lng : '',
        "userId": openid,
        "receiver": this.data.showSend ? this.data.addressObj.receiver : "",
        "phone": this.data.showSend ? this.data.addressObj.phone : "",
        "type": this.data.showSend ? 1 : 2 //1配送，2自提
      };
      console.log(data);
      let ordersModel = new OrdersModel();
      ordersModel.addOrders(data).then(res => {
        let cartArr = wx.getStorageSync("cartArr"); //购物车状态下跳转至下单页，下单后删除对应购物车货物
        console.log(cartArr);
        if (cartArr != '') {
          let cartModel = new CartModel();
          cartModel.delMyCart(cartArr).then(resp => {
            console.log(resp);
            wx.removeStorageSync("cartArr");
          })
        }
        //下单成功
        console.log(res);
        this.pay(res.data); //获取到订单号
      })
    }
  },
  pay: function(trade_no) {
    console.log('开始支付');
    let that = this;
    let total_fee = tool.multiple(this.data.totalPrice, 100); //标价金额（分为单位）
    let body = '斑马-生啤超市'; //商品描述
    let openid = wx.getStorageSync("openid");
    let payModel = new PayModel();
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
          // let state = that.data.showSend ? 2 : 4;
          //支付成功,待发货订单
          // let ordersModel = new OrdersModel();
          // let typeId = that.data.showSend ? 1 : 2;
          // ordersModel.updateOrders(trade_no, 2, typeId).then(res => {
          //   console.log(res);
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
            "type": that.data.showSend ? 1 : 2
          };
          let ordersModel = new OrdersModel();
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
      pay_price: this.data.totalPrice,
      paid: paid
    };
    wx.navigateTo({
      url: '../result/result?order_pay_info=' + JSON.stringify(order_pay_info)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.isClosed();
    wx.showLoading({
      title: '加载中',
    })
    let orderObj = wx.getStorageSync("orderObj");
    if (orderObj != '') {
      orderObj = JSON.parse(orderObj);
      this.setData({
        orderObj: orderObj,
        imgBaseUrl: app.globalData.imgBaseUrl
      })
      let sum = 0;
      for (let i of this.data.orderObj.cargoArr) {
        let num = tool.multiple(i.quantity, i.price);
        sum = tool.add(num, sum);
      }
      this.setData({
        totalPrice: sum,
        goodsPrice: sum
      })
    }
    //获取我的地址
    let addressModel = new AddressModel();
    if (wx.getStorageSync("openid") != '') {
      // 实例化API核心类
      qqmapsdk = new QQMapWX({
        key: 'XBYBZ-SNER6-MVTSK-MYX5Q-VMCTF-EFFBZ'
      });
      addressModel.getAddress(wx.getStorageSync("openid")).then(res => {
        console.log('收货地址', res);
        let flag = true;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].state == 1) {
            flag = false;
            this.setData({
              addressObj: res.data[i],
              address: res.data[i].city + "(" + res.data[i].addr + ")",
              addrFlag: true
            })
            this.calculateDistance({
              lat: res.data[i].lat,
              lng: res.data[i].lng
            });
          }
        }
        if (flag == true && res.data.length > 0) {
          this.setData({
            address: '暂无默认地址，请选择',
            addrFlag: false
          })
        }
        wx.hideLoading();
      })
    }
  },
  //计算距离
  calculateDistance(location) {
    var that = this;
    console.log(location);
    qqmapsdk.calculateDistance({
      "mode": 'driving',
      "from": location.lat + "," + location.lng,
      "to": "26.044352,119.333176", //仓山区临江新天地福江苑1#04店
      success: function(res) {
        console.log(res);
        let distance = res.result.elements[0].distance;
        console.log('配送距离', distance, '米');
        let orderModel = new OrdersModel();
        orderModel.getFee(distance).then(res => {
          console.log('配送费', res.data);
          // this.data.totalPrice = tool.add(this.data.totalPrice, res.data);
          that.setData({
            sendFee: res.data,
            totalPrice: tool.add(that.data.totalPrice, res.data)
          })
          wx.showModal({
            title: '温馨提示',
            content: '配送费' + res.data + '元',
            showCancel: false,
            confirmText: '好的'
          })
        });
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  },
  selectSend(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    for (let i of this.data.sendArr) {
      i.check = false;
    }
    this.data.sendArr[index].check = true;
    if (index == this.data.currentIndex) {
      console.log('已是当前项');
      return false;
    } else {
      this.setData({
        currentIndex: index
      })
    }
    if (this.data.sendArr[index].id == 1) { //选择配送
      //若存在收货地址
      if (this.data.addrFlag) {
        //重新计算配送费
        this.calculateDistance(this.data.addressObj);
      }
      this.setData({
        showSend: true
      })
    } else { //选择自提
      this.setData({
        showSend: false,
        totalPrice: this.data.goodsPrice
      })
    }
    this.setData({
      sendArr: this.data.sendArr
    })
  }
})