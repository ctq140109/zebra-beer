//js
var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
import {
  PayModel
} from '../../service/pay.js';
import {
  OrdersModel
} from '../../service/orders.js';
import {
  CargoModel
} from '../../service/cargo.js';
import {
  Tool
} from '../../public/tool.js';
Page({
  data: {
    imgBaseUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559919497423&di=942a3cf070f7b95ee12515fe90d6108c&imgtype=0&src=http%3A%2F%2Fpic38.nipic.com%2F20140218%2F12473946_210124278328_2.jpg',
    tabs: ["全部", "待付款", "待发货", "待收货", "待评价"],
    sliderWidth: 0,
    activeIndex: 0,
    sliderOffset: 0,
    // sliderLeft: 0,
    // orderList: [],
    orderLists: [],
    nowPage: 1,
    totalNum: 0,
    index: 0,
    orderList: []
  },
  onLoad: function(options) {
    console.log('有刷新', options.index);
    wx.showLoading({
      title: '加载中',
    })
    console.log(options);
    this.setData({
      index: options.index
    })
    if (options.index != undefined) {
      var that = this;
      let ordersModel = new OrdersModel();
      wx.getSystemInfo({
        success: function(res) {
          let req1 = ordersModel.getAllOrders(options.index, that.data.nowPage);
          let req2 = ordersModel.getEvaOrder(1);
          Promise.all([req1, req2]).then(resd => {
            console.log(resd[0], resd[1]);
            let resp = resd[0];
            let resp1 = resd[1];
            let tool = new Tool();
            for (let k of resp1.data) {
              // k.totalPrice = (k.quantity * k.price).toFixed(2);
              k.totalPrice = tool.multiple(k.quantity, k.price);
            }
            for (let j = 0; j < resp.data.list.length; j++) {
              for (let i = 0; i < resp.data.list[j].cargoList.length; i++) {
                resp.data.list[j].cargoList[i].imgUrl = resp.data.list[j].cargoList[i].img.split(",")[0];
              }
              that.data.orderList.push(resp.data.list[j]);
            }
            that.setData({
              imgBaseUrl: app.globalData.imgBaseUrl,
              orderList: that.data.orderList,
              orderLists: resp1.data,
              totalNum: resp.data.total,
              activeIndex: options.index,
              sliderWidth: res.windowWidth / that.data.tabs.length,
              sliderOffset: res.windowWidth / that.data.tabs.length * options.index
            });
            wx.hideLoading();
          })
        }
      });
    }
  },
  tabClick: function(e) {
    // this.setData({
    //   sliderOffset: e.currentTarget.offsetLeft,
    //   activeIndex: e.currentTarget.id
    // });
    this.setData({
      orderList: [],
      nowPage: 1
    })
    this.onLoad({
      index: e.currentTarget.id
    });
  },
  //取消订单
  cancleOrder: function(e) {
    let id = e.currentTarget.dataset.idx;
    console.log(id);
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确认取消订单？',
      success: function(res) {
        if (res.confirm) {
          let ordersModel = new OrdersModel();
          ordersModel.cancelOrder(id).then(res => {
            console.log(res);
            if (res.data == 0) {
              wx.showToast({
                title: '操作失败！',
                icon: 'none'
              })
            } else {
              that.tabClick({
                currentTarget: {
                  id: that.data.activeIndex
                }
              })
            }
          })
        }
      }
    })
  },
  // paypay: function(e) {
  //   let cargoList = e.currentTarget.dataset.item.cargoList;
  //   console.log(cargoList);
  //   let arr = [];
  //   // let arr = JSON.parse(JSON.stringify(cargoList));
  //   for (let i of cargoList) {
  //     arr.push({
  //       "id": i.cargoId, //
  //       "quantity": i.quantity,
  //       // "tradeId": "string"
  //       "cargoName": i.cargoName,
  //       "img": i.img,
  //       "price": i.price,
  //       "specId": i.specId, //
  //       "specName": i.specName
  //     });
  //   }
  //   let orderObj = {
  //     cargoArr: arr,
  //     trade_no: e.currentTarget.dataset.item.id//订单号
  //   };
  //   wx.setStorageSync("orderObj", JSON.stringify(orderObj));
  //   wx.navigateTo({
  //     url: '../buy/buy'
  //   })
  // },
  //立即付款
  paypay: function(e) {
    var that = this;
    let trade_no = e.currentTarget.dataset.item.id;
    let total_fee = e.currentTarget.dataset.item.price * 100;
    console.log('开始支付');
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
          wx.showToast({
            title: '支付成功！',
            duration: 1500,
            mask: true
          })
          setTimeout(()=>{
            //支付成功,待发货订单
            let ordersModel = new OrdersModel();
            ordersModel.updateOrders(trade_no, 2).then(res => {
              console.log(res);
              that.tabClick({
                currentTarget: {
                  id: that.data.activeIndex
                }
              })
            })
          },1500)
        },
        fail(res) {
          console.log(res);
          //失败,待付款订单
          wx.showToast({
            title: '支付失败！',
            icon: "none"
          });
        }
      })
    })
  },
  //退款后取消订单
  refund: function(e) {
    var that = this;
    let item = e.currentTarget.dataset.item;
    console.log(item);
    let ordersModel = new OrdersModel();
    ordersModel.refund(item.id, item.price).then(res => {
      console.log(res);
      ordersModel.cancelOrder(item.id).then(resp => {
        console.log(resp);
        that.tabClick({
          currentTarget: {
            id: that.data.activeIndex
          }
        })
      })
    })
  },
  //收货
  comfirmReceipt: function(e) {
    var that = this;
    let id = e.currentTarget.dataset.idx;
    console.log(id);
    wx.showModal({
      title: '温馨提示',
      content: '确认收货？',
      success: function(res) {
        if (res.confirm) {
          let ordersModel = new OrdersModel();
          ordersModel.updateOrders(id, 4).then(resp => {
            console.log(resp);
            that.tabClick({
              currentTarget: {
                id: that.data.activeIndex
              }
            })
          })
        }
      }
    })
  },
  //去评价页
  toEvaluate: function(e) {
    let id = e.currentTarget.dataset.idx;
    let cargoid = e.currentTarget.dataset.cargoid;
    console.log(id, cargoid);
    wx.navigateTo({
      url: '../evaluation/evaluation?id=' + id + '&cargoid=' + cargoid,
    })
  },
  loadingMore: function() {
    let nowPage = this.data.nowPage;
    nowPage++;
    this.setData({
      nowPage: nowPage
    });
    //
    this.onLoad({
      index: this.data.index
    });

  },
  toDetail: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    var item = e.currentTarget.dataset.cargo;
    console.log(item);
    let cargoModel = new CargoModel();
    cargoModel.getCargoById(item.cargoId).then(res => {
      console.log(res.data);
      res.data.imgArr = res.data.cargoImg.split(',');
      wx.hideLoading();
      wx.navigateTo({
        url: '../detail/detail?cargoItem=' + JSON.stringify(res.data)
      });
    })
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    console.log('页面上拉触底事件的处理函数', this.data.totalNum);
    if (this.data.totalNum > this.data.orderList.length){
      this.loadingMore();
    }
  }
});