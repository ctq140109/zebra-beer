//app.js
import {
  HTTP
} from './service/request.js';
App({
  onLaunch: function() {
    console.log('app初始化');
    let http = new HTTP();
    //获取营业时间
    http.request({
      url: '/BeerApp/shopTime/get.do'
    }).then(res => {
      console.log(res.data);
      wx.setStorageSync("shopTime", JSON.stringify(res.data));
    })
  },
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    http: new HTTP(),
    imgBaseUrl: new HTTP().baseUrl + '/BeerApp/oss/getFile?id='
  }
})