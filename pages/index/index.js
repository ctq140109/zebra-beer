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
    tabsArr: [],
    cargoList: [],
    isLoad: false
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
    let req1 = cargoModel.getList();
    let req2 = app.globalData.http.request({
      url: '/BeerApp/home/all'
    });
    let that = this;
    Promise.all([req1, req2]).then(res => {
      console.log(res);
      this.setData({
        tabsArr: res[0].data,
        imgArr: res[1].data
      })
      this.getCargoByType(res[0].data[0].id);
    })
  },
  getCargoByType(typeId){
    let cargoModel = new CargoModel();
    cargoModel.getCargoByType(typeId).then(resp => {
      console.log(resp);
      for (let i = 0; i < resp.data.length; i++) {
        resp.data[i].imgArr = resp.data[i].cargoImg.split(',');
      }
      this.setData({
        cargoList: resp.data,
        isLoad: true
      })
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    })
  },
  tabEvent(e){
    let typeId = e.detail.id;
    console.log(typeId);
    wx.showLoading({
      title: '加载中'
    })
    this.getCargoByType(typeId);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('下拉刷新');
    wx.showNavigationBarLoading();
    this.onLoad();
  },
})