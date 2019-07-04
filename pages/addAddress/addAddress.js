// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
import {
  AddressModel
} from '../../service/address.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    keyword: '',
    location: {},
    addrid: '',
    name: '',
    mobile: '',
    detailed: '',
    defalut: false,
    editFlag: false
  },
  bindKeyName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindKeyMobile: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindKeyDetailed: function(e) {
    this.setData({
      detailed: e.detail.value
    })
  },
  bindRegionChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      keyword: e.detail.value
    })
    this.getLocation(e.detail.value);
  },
  selectReg(e) {
    let index = e.currentTarget.dataset.index;
    console.log(index);
    let key = this.data.searchList[index].address;
    let location = this.data.searchList[index].location;
    this.setData({
      keyword: key,
      location: location,
      searchList: []
    })
  },
  getLocation: function(keyword) {
    var that = this;
    // 调用接口
    qqmapsdk.search({
      keyword: keyword,
      success: function(res) {
        console.log(res);
        that.setData({
          searchList: res.data
        });
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },

  save: function() {
    if (this.data.name == '') {
      this._showModal('请输入收件人姓名');
      return false;
    }
    if (this.data.mobile == '') {
      this._showModal('请输入联系电话');
      return false;
    }
    if (this.data.keyword == '') {
      this._showModal('请完善地址');
      return false;
    }
    if (this.data.detailed == '') {
      this._showModal('请输入详细地址');
      return false;
    }
    let addressModel = new AddressModel();
    let address = this.data.keyword;
    if (wx.getStorageSync("openid") != "") {
      if (this.data.editFlag == false) {
        addressModel.addAddress(wx.getStorageSync("openid"), this.data.name, this.data.mobile, address, this.data.detailed, this.data.location.lat, this.data.location.lng)
          .then(res => {
            console.log(res);
            this.backFlash();
          })
      } else {
        addressModel.editAddress(this.data.addrid, wx.getStorageSync("openid"), this.data.name, this.data.mobile, address, this.data.detailed, this.data.location.lat, this.data.location.lng)
          .then(res => {
            console.log(res);
            this.backFlash();
          })
      }
    }
  },
  backFlash: function() {
    wx.showToast({
      title: '已保存！',
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    // prevPage.onLoad();
    wx.navigateBack({
      success: function() {
        prevPage.onLoad(); // 执行前一个页面的onLoad方法
      }
    })
  },
  _showModal: function(msg) {
    wx.showModal({
      title: '温馨提示',
      content: msg,
      showCancel: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'XBYBZ-SNER6-MVTSK-MYX5Q-VMCTF-EFFBZ'
    });
    let item = wx.getStorageSync("addressItem");
    console.log(item);
    if (item != "") {
      let items = JSON.parse(item);
      let state = items.state == 1 ? true : false;
      this.setData({
        editFlag: true,
        addrid: items.id,
        keyword: items.city,
        name: items.receiver,
        location: {
          lat: items.lat,
          lng: items.lng
        },
        mobile: items.phone,
        detailed: items.addr,
        defalut: state
      });
      wx.removeStorageSync("addressItem");
    }
  }
})