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
    if (wx.getStorageSync("openid") != '') {
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
    let addressModel = new AddressModel();
    let id = e.currentTarget.dataset.item.id;
    if (wx.getStorageSync("openid") != '') {
      addressModel.setDefault(id, wx.getStorageSync("openid")).then(res => {
        console.log(res);
        let selectFlag = wx.getStorageSync("selectFlag");
        if (selectFlag != '') {
          wx.removeStorageSync("selectFlag");
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; //上一个页面
          // prevPage.onLoad();
          wx.navigateBack({
            success: function() {
              prevPage.onLoad(); // 执行前一个页面的onLoad方法
            }
          })
        } else {
          this.onLoad();
        }
      });
    }
  },
  deleteAddress: function(e) {
    // console.log(e.currentTarget.dataset.idx);
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确认删除该地址吗？',
      success(res) {
        if (res.confirm) {
          let addressModel = new AddressModel();
          let id = e.currentTarget.dataset.idx;
          addressModel.deleteAddress(id).then(res => {
            that.onLoad();
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  editAddress: function(e) {
    console.log(e.currentTarget.dataset.item);
    wx.setStorageSync("addressItem", JSON.stringify(e.currentTarget.dataset.item));
    this.toAdd();
  }
})