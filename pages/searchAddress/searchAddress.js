// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
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
    // if (options.address != "") {
    //   console.log(options.address);
    //   this.setData({
    //     keyword: options.address
    //   })
    // }
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
    // console.log(index);
    // let title = this.data.searchList[index].title;
    let address = this.data.searchList[index].address;
    let location = this.data.searchList[index].location;
    this.calculateDistance(location, address);
  },
  //计算距离
  calculateDistance(location, address) {
    var that = this;
    console.log(location);
    qqmapsdk.calculateDistance({
      "mode": 'driving',
      "from": location.lat + "," + location.lng,
      "to": "26.044352,119.333176", //仓山区临江新天地福江苑1#04店
      success: function(res) {
        console.log(res);
        let distance = res.result.elements[0].distance;
        console.log('配送距离', distance, '米');
        if (distance > 10000) {
          wx.showModal({
            title: '温馨提示',
            content: "当前地址已超出配送范围，请重新选择",
            showCancel: false
          })
        } else {
          that.goBack(location, address);
        }
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  },
  //返回上一页
  goBack(location, address) {
    let item = {
      // title: title,
      location: location,
      address: address
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
    if (keyword == "") {
      return false
    }
    wx.showLoading({
      title: '搜索中...'
    })
    // 调用接口
    qqmapsdk.search({
      keyword: keyword,
      success: function(res) {
        console.log(res);
        that.setData({
          searchList: res.data
        });
        wx.hideLoading();
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