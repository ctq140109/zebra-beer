//app.js
import {
  HTTP
} from './service/request.js';
import {
  ShopModel
} from './service/shop.js';
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        console.log(e);
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        console.log(custom);
        this.globalData.Custom = custom;
        if (e.model.search("iPhone X") != -1 || e.model.search("iPhone XR") != -1 || e.model.search("iPhone XS") != -1) {
          console.log('刘海屏');
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight + 44;
        } else {
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        }
      }
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
    imgBaseUrl: new HTTP().baseUrl + '/BeerApp/oss/getFile?id='
  }
})