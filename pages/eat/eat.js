// pages/eat/eat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList: false,
    num: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.q) {
      var link = decodeURIComponent(options.q);
      console.log(link);
      this.analysisNum(link);
    } else { //非扫码进入无餐桌号
      //方式一，扫码
      //方式二,选择桌号
      this.setData({
        showList: false
      })
      console.log('无参数');
    }
  },
  scanCode() {
    var that = this;
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res);
        that.analysisNum(res.path);
      }
    })
  },
  //根据url解析出餐桌号
  analysisNum(link) {
    var query = link.split('?')[1]; // id=1&type=2
    // console.log(query);
    var num = query.split('=')[1];
    console.log('识别餐桌号', num);
    this.setData({
      num: num,
      showList: true
    })
    wx.navigateTo({
      url: '../list/list?num=' + num,
    })
    return num;
  }
})