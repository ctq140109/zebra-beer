//app.js
import {
  HTTP
} from './service/request.js';
import {
  ShopModel
} from './service/shop.js';
// import {
//   getIcon
// } from './public/geticon.js';
App({
  onLaunch: function() {
    wx.getSystemInfo({
      success: e => {
        console.log(e);
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        console.log(custom);
        this.globalData.Custom = custom;
        let flag = false;
        if (e.model.search("iPhone") != -1) {
          if (e.model.search("X") != -1 || e.model.search("XR") != -1 || e.model.search("XS") != -1) {
            console.log('刘海屏');
            flag = true;
            this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight + 44;
          }
        }
        if (!flag) {
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        }
      }
    })
  },
  //获取图标
  getIcons: function() {
    let that = this;
    return new Promise(function(resolve, reject) {
      let http = new HTTP();
      http.request({
        url: '/BeerApp/buttonType/findInfo.do',
        data: {},
        method: 'POST',
        header: 'json'
      }).then(res => {
        console.log(res.data);
        for (let i of res.data) {
          if (i.id == 1) { //我的订单
            that.globalData.iconListOne = i.list == null ? [] : i.list
          } else if (i.id == 2) { //我的服务
            that.globalData.iconListTwo = i.list == null ? [] : i.list
          } else if (i.id == 3) { //个人中心背景图
            that.globalData.iconListThree = i.list == null ? [] : i.list
          } else if (i.id == 4) { //门店休息
            that.globalData.iconListFour = i.list == null ? [] : i.list
          } else if (i.id == 5) { //底部导航栏
            that.globalData.iconListFive = i.list == null ? [] : i.list
          } else if (i.id == 6) { //logo
            that.globalData.iconListSix = i.list == null ? [] : i.list
          }
        }
        console.log(that.globalData);
        resolve(that.globalData);
      })
    })
  },
  onShow: function() {
    console.log('app显示');
    let shopModel = new ShopModel();
    shopModel.getStatus().then(res => {
      console.log(res);
      wx.setStorageSync("timeFlag", res.data);
    })
  },
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    http: new HTTP(),
    imgBaseUrl: new HTTP().baseUrl + '/BeerApp/oss/getFile?id=',
    iconListOne: [],
    iconListTwo: [],
    iconListThree: [],
    iconListFour: [],
    iconListFive: [],
    iconListSix:[]
  }
})