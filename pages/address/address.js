import {
  AddressModel
} from '../../service/address.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressArr: []
  },
  toAdd: function() {
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    let addressModel = new AddressModel();
    if (wx.getStorageSync("openid") != null) {
      // console.log(wx.getStorageSync("openid"));
      addressModel.getAddress(wx.getStorageSync("openid")).then(res => {
        console.log(res);
        this.setData({
          addressArr: res.data
        })
        wx.hideLoading();
      })
    }
  },
  changeDefault: function(e) {
    // console.log(e.currentTarget.dataset.item);
    let addressModel = new AddressModel();
    let id = e.currentTarget.dataset.item.id;
    if (wx.getStorageSync("openid") != null) {
      addressModel.setDefault(id, wx.getStorageSync("openid")).then(res => {
        console.log(res);
        this.onLoad();
      });
    }
  },
  deleteAddress: function(e) {
    console.log(e.currentTarget.dataset.idx);
    let addressModel = new AddressModel();
    let id = e.currentTarget.dataset.idx;
    addressModel.deleteAddress(id).then(res => {
      console.log(res);
      this.onLoad();
    });
  },
  editAddress: function(e) {
    console.log(e.currentTarget.dataset.item);
    wx.setStorageSync("addressItem", JSON.stringify(e.currentTarget.dataset.item));
    this.toAdd();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})