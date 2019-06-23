const app = getApp();
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
  Tool
} from '../../public/tool.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderObj: {
      cargoArr: []
    },
    message: '',
    address: '暂无收货地址，请添加',
    addressId: null,
    imgBaseUrl: '',
    totalPrice: 0
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
    let orderObj = wx.getStorageSync("orderObj");
    // if (this.data.orderObj.trade_no != undefined){//订单页跳转来
    //   this.pay(this.data.orderObj.trade_no);//
    //   return false;
    // }
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
        "addressId": this.data.addressId,
        "cargoList": cargoList,
        "message": this.data.message,
        "price": this.data.totalPrice,
        "state": 1,
        "userId": openid
      };
      app.globalData.http.request({
        url: '/BeerApp/trade/add.do',
        data: data,
        method: 'POST',
        header: 'json'
      }).then(res => {
        let cartArr = wx.getStorageSync("cartArr"); //购物车状态下跳转至下单页，下单后删除对应购物车货物
        console.log(cartArr);
        if (cartArr != '') {
          // let cartArr = JSON.parse(cartArr);
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
    let total_fee = this.data.totalPrice * 100; //标价金额（分为单位）
    let body = '斑马-超市'; //商品描述
    let openid = wx.getStorageSync("openid");
    app.globalData.http.request({
      url: '/BeerApp/wx/pay.do?out_trade_no=' + trade_no + '&total_fee=' + total_fee + '&body=' + body + '&openid=' + openid,
      method: 'POST',
      header: 'json'
    }).then(res => {
      console.log(res);
      //调支付接口
      wx.requestPayment({
        // appId: res.data.appid, //"wxd4eb0a949e945984"
        timeStamp: res.data.timestamp,
        nonceStr: res.data.nonce_str,
        package: res.data.package, //'prepay_id=' + res.data.prepay_id
        paySign: res.data.sign,
        signType: 'MD5',
        success(res) {
          console.log(res);
          //支付成功,待发货订单
          let ordersModel = new OrdersModel();
          ordersModel.updateOrders(trade_no, 2).then(res => {
            console.log(res);
            wx.showToast({
              title: '支付成功！',
              duration: 1500,
              mask:true,
              success: function() {
                //转到支付成功页（等待发货页）
              }
            })
          })
        },
        fail(res) {
          console.log(res);
          //失败,待付款订单
          wx.showToast({
            title: '支付失败！',
            icon: "none",
            success: function(res) {
              console.log(res);
              //
            }
          });
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
    let orderObj = wx.getStorageSync("orderObj");
    if (orderObj != '') {
      orderObj = JSON.parse(orderObj);
      this.setData({
        orderObj: orderObj,
        imgBaseUrl: app.globalData.imgBaseUrl
      })
      let sum = 0;
      let tool = new Tool();
      for (let i of this.data.orderObj.cargoArr) {
        let num = tool.multiple(i.quantity, i.price);
        sum = tool.add(num, sum);
        // let num = (parseInt(i.quantity) * (i.price)).toFixed(2);
        // console.log(parseFloat(num));
        // sum += parseFloat(num);
      }
      this.setData({
        // totalPrice: sum.toFixed(2)
        totalPrice: sum
      })
    }
    //获取我的地址
    let addressModel = new AddressModel();
    if (wx.getStorageSync("openid") != '') {
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