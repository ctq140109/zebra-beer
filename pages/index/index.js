//index.js
//获取应用实例
const app = getApp();
import {
  CargoModel
} from '../../service/cargo.js';
Page({
  data: {
    imgBaseUrl: 'http://localhost:8080/BeerApp/oss/getFile?id=',
    imgArr: [
      // 'http://apollo-wms.oss-cn-zhangjiakou.aliyuncs.com/20190529112848.jpg?Expires=3135900528&OSSAccessKeyId=LTAIAhZv9N2cPpLq&Signature=2cjU0FLWmF02sJRsncRA4%2FlJU7g%3D',
      // 'http://apollo-wms.oss-cn-zhangjiakou.aliyuncs.com/20190529113118.jpg?Expires=3135900678&OSSAccessKeyId=LTAIAhZv9N2cPpLq&Signature=1GuKlAdrvJ3%2BfAu%2FZqF7VqD1g2g%3D',
      // 'http://apollo-wms.oss-cn-zhangjiakou.aliyuncs.com/20190529113145.jpg?Expires=3135900705&OSSAccessKeyId=LTAIAhZv9N2cPpLq&Signature=nmdP3PfCLNf%2BUhUEoC%2FZqg2BN8Y%3D'
    ],
    cargoList: []
    //   {
    //   "id": 1,
    //   "cargoImg": "../image/1-1.jpg",
    //   "cargoName": "喜力啤酒THETORP原味生啤胶囊2L一支装进口生啤酒小麦麦芽",
    //   "nowPrice": 1280.00,
    //   "oldPrice": 2256.00
    // }
  },
  //事件处理函数
  toDetail: function(e) {
    var item = e.currentTarget.dataset.cargo;
    // wx.setStorageSync('cargoItem', item);
    wx.navigateTo({
      url: '../detail/detail?cargoItem=' + JSON.stringify(item)
    });
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中'
    })
    this.setData({
      imgBaseUrl: app.globalData.imgBaseUrl
    })
    let cargoModel = new CargoModel();
    let req1 = cargoModel.getAllCargo();
    let req2 = app.globalData.http.request({
      url: '/BeerApp/home/all'
    });
    let that = this;
    Promise.all([req1, req2]).then(res => {
      console.log(res);
      for (let i = 0; i < res[0].data.length; i++) {
        res[0].data[i].imgArr = res[0].data[i].cargoImg.split(',');
      }
      that.setData({
        cargoList: res[0].data,
        imgArr: res[1].data
      })
      wx.hideLoading();
    })
    // '/pages/detail/detail?id=1'
  }
})