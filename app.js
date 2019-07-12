//app.js
import {
  HTTP
} from './service/request.js';
import {
  ShopModel
} from './service/shop.js';
App({
  onLaunch: function() {
    console.log('app初始化');
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