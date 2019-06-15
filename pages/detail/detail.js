const app = getApp();
import {
  StandardModel
} from '../../service/standard.js';
import {
  CartModel
} from '../../service/cart.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: true, //true为购买false为加入购物车
    imgBaseUrl: '',
    cargoItem: {},
    name: '',
    showModalStatus: false,
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    //选择的规格
    standard: '',
    standardObj: {},
    standardArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    wx.showLoading({
      title: '加载中'
    })
    console.log(option);
    this.setData({
      cargoItem: JSON.parse(option.cargoItem),
      imgBaseUrl: app.globalData.imgBaseUrl
    });
    this.getStandard(JSON.parse(option.cargoItem));
    wx.hideLoading();
  },
  getStandard: function(cargoItem) {
    let standardModel = new StandardModel();
    console.log(cargoItem.id);
    standardModel.getStandard(cargoItem.id, 1).then(res => {
      console.log(res);
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].standardCk = false;
      }
      this.setData({
        standardArr: res.data
      })
      this.selectStandard({
        currentTarget: {
          dataset: {
            index: 0,
            obj: res.data[0]
          }
        }
      });
    });
  },
  selectStandard: function(e) {
    let index = e.currentTarget.dataset.index;
    let obj = e.currentTarget.dataset.obj;
    console.log(index);
    console.log(obj);
    let arr = this.data.standardArr;
    for (let i of arr) {
      if (i.id == obj.id) {
        i.standardCk = true;
      } else {
        i.standardCk = false;
      }
    }
    //
    this.setData({
      standardArr: arr,
      standard: this.data.standardArr[index].name,
      standardObj: obj
    })
  },
  //查看评价
  getEvaluation: function(e) {
    let cargoId = e.currentTarget.dataset.cargoid;
    console.log(cargoId);
    wx.navigateTo({
      url: '../evaluateDetail/evaluateDetail?cargoid=' + cargoId,
    })
  },
  addtoCart: function() {
    if (this.data.standard == '') {
      this._showModal('请选择包装');
      return false;
    }
    // let openid = wx.getStorageSync("openid");
    // console.log(openid);
    // if (openid == "") {
    //   let dialog = this.selectComponent("#dialog");
    //   dialog.setData({
    //     isShow: true
    //   });
    // }
    let openid = wx.getStorageSync("openid");
    let userinfo = wx.getStorageSync("userinfo");
    console.log(openid);
    let dialog = this.selectComponent("#dialog");
    if (openid == "" || userinfo == "") {
      dialog.setData({
        isShow: true
      });
      return false;
    } else {
      dialog.setData({
        isShow: false
      });
    }
    let cartModel = new CartModel();
    cartModel.joinMyCart(this.data.num, this.data.standardObj.id, this.data.cargoItem.id, this.data.cargoItem.cargoName).then(res => {
      console.log(res);
      // 加入我的购物车
      wx.showToast({
        title: '已加入购物车'
      })
    })
  },
  toIndex: function() {
    wx.switchTab({
      url: '../index/index',
    });
  },
  toCart: function() {
    wx.switchTab({
      url: '../cart/cart',
    });
  },
  toBuy: function() {
    if (this.data.standard == '') {
      this._showModal('请选择包装');
      return false;
    }
    // let openid = wx.getStorageSync("openid");
    // console.log(openid);
    // if (openid == "") {
    //   let dialog = this.selectComponent("#dialog");
    //   dialog.setData({
    //     isShow: true
    //   });
    //   return false;
    // }
    let openid = wx.getStorageSync("openid");
    let userinfo = wx.getStorageSync("userinfo");
    console.log(openid);
    let dialog = this.selectComponent("#dialog");
    if (openid == "" || userinfo == "") {
      dialog.setData({
        isShow: true
      });
      return false;
    } else {
      dialog.setData({
        isShow: false
      });
    }
    let arr = [];
    let cargoItem = JSON.parse(JSON.stringify(this.data.cargoItem));
    let standardItem = JSON.parse(JSON.stringify(this.data.standardObj));
    arr.push(cargoItem);
    arr[0].quantity = this.data.num;
    arr[0].img = standardItem.img;
    arr[0].price = standardItem.price;
    arr[0].specId = standardItem.id;
    arr[0].specName = standardItem.name;
    let orderObj = {
      cargoArr: arr
    };
    // let orderObj = {
    //   cargoItem: this.data.cargoItem,
    //   quantity: this.data.num,
    //   standardItem: this.data.standardObj
    // };
    wx.setStorageSync("orderObj", JSON.stringify(orderObj));
    wx.navigateTo({
      url: '../buy/buy'
    })
  },
  _showModal: function(msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },
  powerDrawer: function(e) {
    console.log(e);
    var currentStatu = e.currentTarget.dataset.statu;
    var currentType = e.currentTarget.dataset.type;
    if (currentStatu == "open") {
      this.setData({
        type: currentType
      });
    }
    this.util(currentStatu);
  },
  util: function(currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    });

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function() {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      });

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200);

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  /* 点击减号 */
  bindMinus: function() {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
    this.setData({
      totalPrice: num,
    });
  },
  // addPrice(){

  // },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    // let reg = /^[1-9]+$/
    if (num > 0) {
      // 将数值与状态写回  
      this.setData({
        num: num
      });
    } else {
      this.setData({
        num: 1
      });
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