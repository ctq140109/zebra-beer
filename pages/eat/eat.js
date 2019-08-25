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
    let openid = wx.getStorageSync("openid");
    let userinfo = wx.getStorageSync("userinfo");
    console.log(openid, userinfo);
    let dialog = this.selectComponent("#dialog");
    if (openid == "" || userinfo == "") {
      this.setData({
        userInfo: {},
        hasUserInfo: false
      })
      dialog.setData({
        isShow: true
      });
    } else {
      userinfo = JSON.parse(userinfo);
      this.setData({
        userInfo: userinfo,
        hasUserInfo: true
      });
      dialog.setData({
        isShow: false
      });
      console.log(options);
      if (options.id != null && options.id != undefined && options.id != '') {
        // var link = decodeURIComponent(options.q);
        // console.log(link);
        // this.analysisNum(link);
        console.log('识别餐桌号', options.id);
        this.setData({
          num: options.id,
          showList: true
        })
        wx.navigateTo({
          url: '../list/list?num=' + options.id,
        })
      } else { //非扫码进入无餐桌号
        this.setData({
          showList: false
        })
        console.log('无参数');
      }
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
  toList() {
    wx.navigateTo({
      url: '../list/list?num=' + this.data.num,
    })
  },
  //根据url解析出餐桌号
  analysisNum(link) {
    var query = link.split('?')[1]; //id=1&type=2
    var num = query.split('=')[1];
    console.log('识别餐桌号', num);
    this.setData({
      num: num,
      showList: true
    })
    wx.navigateTo({
      url: '../list/list?num=' + num,
    })
  },
  // 
  onUnload: function() {
    // wx.switchTab({
    //   url: '../index/index'
    // })
    wx.reLaunch({
      url: '../index/index',
    })
  }
})