//index.js
//获取应用实例
const app = getApp();
import {
  CargoModel
} from '../../service/cargo.js';
Page({
  data: {
    imgBaseUrl: '',
    imgArr: [],
    cargoList: []
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
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    })
  },
    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉刷新');
    wx.showNavigationBarLoading();
    this.onLoad();
  },
})