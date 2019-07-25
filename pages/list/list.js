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
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    activeIndex: 0,
    toView: 'a0',
    scrollTop: 100,
    screenWidth: 667,
    showModalStatus: false,
    currentType: 0,
    currentIndex: 0,
    sizeIndex: 0,
    // sugarIndex: 0,
    // temIndex: 0,
    // sugar: ['常规糖', '无糖', '微糖', '半糖', '多糖'],
    // tem: ['常规冰', '多冰', '少冰', '去冰', '温', '热'],
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
      let arr = [];
      for (let i = 0; i < res.data.length; i++) {
        // this.data.listData.push({name:'',foods:[]});
        // this.getCargoByType(res.data[i].id, res.data[i].name,i);
        arr.push(cargoModel.getCargoByType(res.data[i].id));
      }
      this.setListData(arr, res.data);
    });
  },
  setListData(arr, tabArr) {
    Promise.all(arr).then(res => {
      console.log('获取所有分类啤酒', res);
      let resArr = JSON.parse(JSON.stringify(res));
      // this.data.listData = new Array(resArr.length);
      for (let i = 0; i < resArr.length; i++) {
        resArr[i].name = tabArr[i].name;
        for (let j = 0; j < resArr[i].data.length; j++) {
          resArr[i].data[j].imgArr = resArr[i].data[j].cargoImg.split(',');
        }
      }
      this.setData({
        listData: resArr,
        loading: true
      })
      wx.hideLoading();
    })
  },
  selectMenu: function(e) {
    var index = e.currentTarget.dataset.index;
    // console.log(index);
    this.setData({
      activeIndex: index,
      toView: 'a' + index
    })
    console.log(this.data.toView);
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
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    if (id) {
      this.getStandard(id);
      this.setData({
        currentIndex: index,
        currentType: type,
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
      "name": a.listData[a.currentType].data[a.currentIndex].cargoName,
      "price": a.size[a.sizeIndex].price,
      "detail": a.size[a.sizeIndex].name,
      "number": 1,
      "sum": a.size[a.sizeIndex].price,
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
  showCartList: function() {
    console.log(this.data.showCart)
    if (this.data.cartList.length != 0) {
      this.setData({
        showCart: !this.data.showCart,
      });
    }

  },
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
      // wx.navigateTo({
      //   url: '../balance/balance'
      // })
    }
  }
})