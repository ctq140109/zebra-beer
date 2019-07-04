// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    // title:'',
    // location:'',
    searchList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'XBYBZ-SNER6-MVTSK-MYX5Q-VMCTF-EFFBZ'
    });
  },
  getkey(e) {
    console.log(e.detail.value)
    this.setData({
      keyword: e.detail.value
    })
    this.getLocation();
  },
  selectReg(e) {
    let index = e.currentTarget.dataset.index;
    console.log(index);
    let title = this.data.searchList[index].title;
    let location = this.data.searchList[index].location;
    let item = {
      title: title,
      location: location
    }
    wx.setStorageSync("locationItem", JSON.stringify(item));
    //返回上一页
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    wx.navigateBack({
      success: function() {
        prevPage.getLocation(); // 执行前一个页面的方法
      }
    })
  },
  getLocation: function() {
    let keyword = this.data.keyword;
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
  // 清除搜索框值
  clearInput: function() {
    this.setData({
      keyword: ""
    });
  }
})