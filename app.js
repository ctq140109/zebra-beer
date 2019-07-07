//app.js
import {
  HTTP
} from './service/request.js';
App({
  onLaunch: function() {
  },
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    http: new HTTP(),
    imgBaseUrl: new HTTP().baseUrl + '/BeerApp/oss/getFile?id='
  }
})