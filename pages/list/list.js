const app = getApp();
import {
  CargoModel
} from '../../service/cargo.js';
import {
  StandardModel
} from '../../service/standard.js';
import {
  Tool
} from '../../public/tool.js';
var tool = new Tool();
var cargoModel = new CargoModel();
var standardModel = new StandardModel();
// 最大行数
var max_row_height = 4;
// 行高
var cart_offset = 100;
// 底部栏偏移量
var food_row_height = 64;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    maskVisual: 'hidden',
    CustomBar: app.globalData.CustomBar,
    listData: [],
    cargoList: [],
    activeIndex: 0,
    activeIndexs: 0,
    classify_id: null,
    classify_two_id: null,
    toView: 'a0',
    scrollTop: 100,
    screenWidth: 667,
    showModalStatus: false,
    currentType: 0,
    currentIndex: 0,
    sizeIndex: 0,
    size: [],
    cartList: [],
    sumMonney: 0,
    cupNumber: 0,
    showCart: false,
    loading: false,
    imgBaseUrl: '',
    num: '' //当前桌号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    var that = this;
    var sysinfo = wx.getSystemInfoSync().windowHeight;
    console.log(sysinfo)
    wx.showLoading({
      title: '努力加载中',
    });
    this.setData({
      imgBaseUrl: app.globalData.imgBaseUrl,
      num: options.num
    })
    cargoModel.getList().then(res => {
      console.log(res);
      this.setData({
        listData: res.data,
        loading: true
      })
      this.selectMenu({
        currentTarget: {
          dataset: {
            index: 0,
            id: res.data[0].id
          }
        }
      })
      wx.hideLoading();
    });
  },
  //获取分类商品
  getCargo() {
    wx.showLoading({
      title: '加载中...'
    })
    this.setData({
      cargoList: []
    })
    cargoModel.getCargoByType(this.data.classify_id, this.data.classify_two_id).then(resp => {
      console.log(resp);
      for (let i = 0; i < resp.data.length; i++) {
        resp.data[i].imgArr = resp.data[i].cargoImg.split(',');
      }
      this.setData({
        cargoList: resp.data
      })
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    })
  },
  selectMenu: function(e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    // console.log(index);
    this.setData({
      activeIndex: index,
      activeIndexs: 0,
      classify_id: id,
      classify_two_id: this.data.listData[index].levelList.length > 0 ? this.data.listData[index].levelList[0].id : null,
      toView: 'a' + index
    });
    console.log(this.data.toView);
    this.getCargo();
  },
  selectSubMenu: function(e) {
    var indexs = e.currentTarget.dataset.indexs;
    var index = e.currentTarget.dataset.index;
    var typeId = e.currentTarget.dataset.id;
    var id = e.currentTarget.dataset.ids;
    // console.log(index);
    this.setData({
      activeIndex: index,
      classify_id: typeId,
      classify_two_id: id,
      activeIndexs: indexs
    });
    this.getCargo();
  },
  scroll: function(e) {
    console.log(e)
    // var dis = e.detail.scrollTop
    // if (dis > 0 && dis < 1189) {
    //   this.setData({
    //     activeIndex: 0,
    //   })
    // }
    // if (dis > 1189 && dis < 1867) {
    //   this.setData({
    //     activeIndex: 1,
    //   })
    // }
    // if (dis > 1867 && dis < 2180) {
    //   this.setData({
    //     activeIndex: 2,
    //   })
    // }
    // if (dis > 2180 && dis < 2785) {
    //   this.setData({
    //     activeIndex: 3,
    //   })
    // }
    // if (dis > 2785 && dis < 2879) {
    //   this.setData({
    //     activeIndex: 4,
    //   })
    // }
    // if (dis > 2879 && dis < 4287) {
    //   this.setData({
    //     activeIndex: 5,
    //   })
    // }
    // if (dis > 4287 && dis < 4454) {
    //   this.setData({
    //     activeIndex: 6,
    //   })
    // }
    // if (dis > 4454 && dis < 4986) {
    //   this.setData({
    //     activeIndex: 7,
    //   })
    // }
    // if (dis > 4986) {
    //   this.setData({
    //     activeIndex: 8,
    //   })
    // }
  },
  selectInfo: function(e) {
    console.log(e.currentTarget.dataset)
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    if (id) {
      this.getStandard(id);
      this.setData({
        currentIndex: index,
        sizeIndex: 0
      });
    }
    this.setData({
      showModalStatus: !this.data.showModalStatus
    });
  },

  getStandard(id) {
    console.log(id);
    standardModel.getStandard(id, 1).then(res => {
      console.log(res);
      this.setData({
        size: res.data
      })
    });
  },
  chooseSE: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      sizeIndex: index,
      // sizePrice:this.data.size[index].price
    });
  },

  addToCart: function() {
    var a = this.data
    var addItem = {
      "name": a.cargoList[a.currentIndex].cargoName,
      "price": a.size[a.sizeIndex].price,
      "detail": a.size[a.sizeIndex].name,
      "number": 1,
      "sum": a.size[a.sizeIndex].price,
      "cargoId": a.cargoList[a.currentIndex].id,
      "img": a.cargoList[a.currentIndex].imgArr[0],
      "specId": a.size[a.sizeIndex].id,
      "specName": a.size[a.sizeIndex].name,
    }
    var sumMonney = tool.add(a.sumMonney, a.size[a.sizeIndex].price);
    var cartList = this.data.cartList;
    cartList.push(addItem);
    this.setData({
      cartList: cartList,
      showModalStatus: false,
      sumMonney: sumMonney,
      cupNumber: a.cupNumber + 1
    });
    console.log(this.data.cartList)
  },
  showCartList: function(e) {
    console.log(e.currentTarget.dataset.statu);
    // if (this.data.cartList.length != 0 && this.data.maskVisual == 'hidden') {
    //   this.cascadePopup();
    // }else{
    //   this.cascadeDismiss();
    // }
    if (this.data.cartList.length != 0){
      this.setData({
        showCart:!this.data.showCart
      })
    }
  },
  // cascadePopup: function () {
  //   var that = this;
  //   // 购物车打开动画
  //   var animation = wx.createAnimation({
  //     duration: 300,
  //     timingFunction: 'ease-in-out',
  //   });
  //   that.animation = animation;
  //   // scrollHeight为商品列表本身的高度
  //   var scrollHeight = (that.data.cartList.length <= max_row_height ? that.data.cartList.length : max_row_height) * food_row_height;
  //   // cartHeight为整个购物车的高度，也就是包含了标题栏与底部栏的高度
  //   var cartHeight = scrollHeight + cart_offset;
  //   console.log(cartHeight);
  //   animation.translateY(- cartHeight).step();
  //   that.setData({
  //     animationData: that.animation.export(),
  //     maskVisual: 'show',
  //     scrollHeight: scrollHeight,
  //     cartHeight: cartHeight
  //   });
  //   // 遮罩渐变动画
  //   var animationMask = wx.createAnimation({
  //     duration: 150,
  //     timingFunction: 'linear',
  //   });
  //   that.animationMask = animationMask;
  //   animationMask.opacity(0.8).step();
  //   that.setData({
  //     animationMask: that.animationMask.export(),
  //   });
  // },
  // cascadeDismiss: function () {
  //   var that = this;
  //   // 购物车关闭动画
  //   that.animation.translateY(that.data.cartHeight).step();
  //   that.setData({
  //     animationData: that.animation.export()
  //   });
  //   // 遮罩渐变动画
  //   that.animationMask.opacity(0).step();
  //   that.setData({
  //     animationMask: that.animationMask.export(),
  //   });
  //   // 隐藏遮罩层
  //   that.setData({
  //     maskVisual: 'hidden'
  //   });
  // },
  clearCartList: function() {
    this.setData({
      cartList: [],
      showCart: false,
      sumMonney: 0,
      cupNumber: 0
    });
  },
  addNumber: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;
    cartList[index].number++;
    var sum = tool.add(this.data.sumMonney, cartList[index].price);
    cartList[index].sum = tool.add(cartList[index].price, cartList[index].sum);

    this.setData({
      cartList: cartList,
      sumMonney: sum,
      cupNumber: this.data.cupNumber + 1
    });
  },
  decNumber: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;

    var sum = tool.subtract(this.data.sumMonney, cartList[index].price);
    cartList[index].sum = tool.subtract(cartList[index].sum, cartList[index].price);
    cartList[index].number == 1 ? cartList.splice(index, 1) : cartList[index].number--;
    this.setData({
      cartList: cartList,
      sumMonney: sum,
      showCart: cartList.length == 0 ? false : true,
      cupNumber: this.data.cupNumber - 1
    });
  },
  goBalance: function() {
    if (this.data.sumMonney != 0) {
      wx.setStorageSync('cartList', this.data.cartList);
      wx.setStorageSync('sumMonney', this.data.sumMonney);
      wx.setStorageSync('cupNumber', this.data.cupNumber);
      wx.setStorageSync('sitNum', this.data.num);
      wx.navigateTo({
        url: '../balance/balance'
      })
    }
  },
  // onUnload(){
  //   wx.redirectTo({
  //     url: '../eat/eat',
  //   })
  // }
})