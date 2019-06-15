import {
  AddressModel
} from '../../service/address.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: ['--', '请选择', '--'],
    customItem: '--',
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
      region: e.detail.value
    })
  },
  checkboxChange: function(e) {
    console.log(e.detail.value);
    let def = e.detail.value == "1" ? true : false;
    this.setData({
      defalut: def
    })
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
    if (this.data.region.indexOf('--') != -1) {
      this._showModal('请完善地址');
      return false;
    }
    if (this.data.detailed == '') {
      this._showModal('请输入详细地址');
      return false;
    }
    let addressModel = new AddressModel();
    let address = this.data.region.join(',');
    let state = this.data.defalut == true ? 1 : 0;
    if (wx.getStorageSync("openid") != "") {
      if (this.data.editFlag == false) {
        addressModel.addAddress(wx.getStorageSync("openid"), this.data.name, this.data.mobile, address, this.data.detailed)
          .then(res => {
            console.log(res);
            this.backFlash();
          })
      } else {
        addressModel.editAddress(this.data.addrid, wx.getStorageSync("openid"), this.data.name, this.data.mobile, address, this.data.detailed)
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
    let item = wx.getStorageSync("addressItem");
    console.log(item);
    if (item != "") {
      let items = JSON.parse(item);
      let state = items.state == 1 ? true : false;
      let regionArr = items.city.split(',');
      this.setData({
        editFlag: true,
        addrid: items.id,
        region: regionArr,
        name: items.receiver,
        mobile: items.phone,
        detailed: items.addr,
        defalut: state
      });
      wx.removeStorageSync("addressItem");
    }
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