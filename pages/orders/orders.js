//js
var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["待付款", "待发货", "待收货", "待评价"],
    sliderWidth:0,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function(options) {
    console.log(options);
    if (options.index != undefined) {
      this.setData({
        activeIndex: options.index
      })
    }
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderWidth: res.windowWidth / that.data.tabs.length,
          // sliderLeft: (res.windowWidth / that.data.tabs.length - that.data.sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});