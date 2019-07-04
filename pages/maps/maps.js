// // var amapFile = require('../../lib/amap-wx.js');
// Page({
//   /**
//    * 页面的初始数据
//    */
//   data: {
//     latitude: 23.099994,
//     longitude: 113.324520
//     // mapKey: '8f4d58024ac2a4730ae22b9ded41694a',
//     // address: []
//   },
//   onLoad: function(options) {
//     var that = this;
//     wx.getLocation({
//       type: 'gcj02', //返回可以用于wx.openLocation的经纬度
//       success(res) {
//         that.setData({
//           latitude: res.latitude,
//           longitude: res.longitude
//         })
//         // const latitude = res.latitude
//         // const longitude = res.longitude
//         // wx.openLocation({
//         //   latitude,
//         //   longitude,
//         //   scale: 18
//         // })
//       }
//     })
//     // wx.showLoading({
//     //   title: 'Loading...',
//     // })
//     // var that = this;
//     // wx.getLocation({
//     //   type: 'wgs84',
//     //   success: function(res) {
//     //     var latitude = res.latitude
//     //     var longitude = res.longitude
//     //     var speed = res.speed
//     //     var accuracy = res.accuracy
//     //     var markersData = {
//     //       latitude: latitude, //纬度
//     //       longitude: longitude, //经度
//     //       key: that.data.mapKey
//     //     };
//     //     var addArr = [];
//     //     var myAmapFun = new amapFile.AMapWX({
//     //       key: that.data.mapKey
//     //     });
//     //     myAmapFun.getRegeo({
//     //       success: function(data) {
//     //         console.log(data[0].regeocodeData.pois)
//     //         // console.log(data)
//     //         var dataAll = data[0].regeocodeData.pois;
//     //         console.log(dataAll.length)
//     //         for (var i = 0; i < dataAll.length; i++) {
//     //           addArr.push({
//     //             "id": i,
//     //             "address": dataAll[i]
//     //           })
//     //         }
//     //         that.setData({
//     //           address: addArr
//     //         })
//     //         wx.hideLoading()
//     //       }
//     //     });
//     //   }
//     // })
//   }
// })
// Page({
//   data: {
//     latitude: 23.099994,
//     longitude: 113.324520,
//     markers: [{
//       id: 1,
//       latitude: 23.099994,
//       longitude: 113.324520,
//       name: 'T.I.T 创意园'
//     }],
//     covers: [{
//       latitude: 23.099994,
//       longitude: 113.344520,
//       iconPath: '/pages/image/location.png'
//     }, {
//       latitude: 23.099994,
//       longitude: 113.304520,
//       iconPath: '/pages/image/location.png'
//     }]
//   },
//   onReady: function (e) {
//     this.mapCtx = wx.createMapContext('myMap')
//   },
//   getCenterLocation: function () {
//     this.mapCtx.getCenterLocation({
//       success: function (res) {
//         console.log(res.longitude)
//         console.log(res.latitude)
//       }
//     })
//   },
//   moveToLocation: function () {
//     this.mapCtx.moveToLocation()
//   },
//   translateMarker: function () {
//     this.mapCtx.translateMarker({
//       markerId: 1,
//       autoRotate: true,
//       duration: 1000,
//       destination: {
//         latitude: 23.10229,
//         longitude: 113.3345211,
//       },
//       animationEnd() {
//         console.log('animation end')
//       }
//     })
//   },
//   includePoints: function () {
//     this.mapCtx.includePoints({
//       padding: [10],
//       points: [{
//         latitude: 23.10229,
//         longitude: 113.3345211,
//       }, {
//         latitude: 23.00229,
//         longitude: 113.3345211,
//       }]
//     })
//   }
// })

// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data:{
    arr:[],
    keyword:'银行'
  },
  onLoad: function() {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'XBYBZ-SNER6-MVTSK-MYX5Q-VMCTF-EFFBZ'
    });
  },
  getLocation: function() {
    var that = this;
    // 调用接口
    qqmapsdk.search({
      keyword: that.data.keyword,
      success: function(res) {
        console.log(res);
        that.setData({
          arr:res.data
        });
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  }

})