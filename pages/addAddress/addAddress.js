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
    name: '',
    mobile: '',
    detailed: '',
    defalut: false
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
    // console.log(address);
    addressModel.addAddress(this.data.name, this.data.mobile, address, this.data.detailed, this.data.defalut).then(res => {
      // wx.navigateBack({
        
      // })
    })
  },
  _showModal: function(msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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