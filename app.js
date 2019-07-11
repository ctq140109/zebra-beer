//app.js
import {
  HTTP
} from './service/request.js';
App({
  onLaunch: function() {
    console.log('app初始化');
    let http = new HTTP();
    // http.request({
    //   url: ''
    // }).then(res => {
    //   console.log(res);
    // })
  },
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    http: new HTTP(),
    imgBaseUrl: new HTTP().baseUrl + '/BeerApp/oss/getFile?id='
  }
})