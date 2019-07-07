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
    this.getUserLocation();
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
  onShow: function() {
    var _this = this;
    //调用定位方法
    _this.getUserLocation();
  },
  //定位方法
  getUserLocation: function() {
    var _this = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function(res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.getLocation();
        } else {
          console.log('授权成功')
          //调用wx.getLocation的API
          _this.getLocation();
        }
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