// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_pay_info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.order_pay_info != undefined) {
      this.setData({
        order_pay_info: JSON.parse(options.order_pay_info)
      })
    }
  },
})