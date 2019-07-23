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
    // const updateManager = wx.getUpdateManager()

    // updateManager.onCheckForUpdate(function(res) {
    //   // 请求完新版本信息的回调
    //   console.log(res)
    // })

    // updateManager.onUpdateReady(function() {
    //   wx.showModal({
    //     title: '更新提示',
    //     content: '新版本已经准备好，是否重启应用？',
    //     success: function(res) {
    //       if (res.confirm) {
    //         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //         updateManager.applyUpdate()
    //       }
    //     }
    //   })
    // })
    // updateManager.onUpdateFailed(function() {
    //   // 新版本下载失败
    // })
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