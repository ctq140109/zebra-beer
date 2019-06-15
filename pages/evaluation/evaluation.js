import {
  OrdersModel
} from '../../service/orders.js';
import {
  EvaluateModel
} from '../../service/evaluate.js';
Page({

  data: {
    orderid: '',
    cargoid: '',
    evaluation: '',
    stars: [{
      flag: 2,
      bgImg: "../image/evaluation/favor.png",
      bgfImg: "../image/evaluation/favor_fill.png"
    }, {
      flag: 2,
      bgImg: "../image/evaluation/favor.png",
      bgfImg: "../image/evaluation/favor_fill.png"
    }, {
      flag: 2,
      bgImg: "../image/evaluation/favor.png",
      bgfImg: "../image/evaluation/favor_fill.png"
    }, {
      flag: 2,
      bgImg: "../image/evaluation/favor.png",
      bgfImg: "../image/evaluation/favor_fill.png"
    }, {
      flag: 2,
      bgImg: "../image/evaluation/favor.png",
      bgfImg: "../image/evaluation/favor_fill.png"
    }, ]
  },
  score: function(e) {
    var that = this;
    for (var i = 0; i < that.data.stars.length; i++) {
      var allItem = 'stars[' + i + '].flag';
      that.setData({
        [allItem]: 1
      })
    }
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i <= index; i++) {
      var item = 'stars[' + i + '].flag';
      that.setData({
        [item]: 2
      })
    }
  },
  setEvaluate: function(e) {
    this.setData({
      evaluation: e.detail.value
    })
  },
  onLoad: function(options) {
    let id = options.id;
    let cargoid = options.cargoid;
    console.log(id);
    this.setData({
      orderid: id,
      cargoid: cargoid
    })
  },
  release: function() {
    if (this.data.evaluation == '') {
      wx.showToast({
        title: '请输入评价',
        icon: "none"
      })
      return false;
    }
    var that = this;
    let score = 0;
    for (let i of that.data.stars) {
      if (i.flag == 2) {
        score++;
      }
    }
    let evaluateModel = new EvaluateModel();
    evaluateModel.releaseEva(this.data.orderid, score, this.data.evaluation, this.data.cargoid).then(res => {
      console.log(res);
      wx.showToast({
        title: '发表成功',
        duration: 1500
      })
      setTimeout(res => {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        // prevPage.onLoad();
        wx.navigateBack({
          success: function() {
            prevPage.onLoad({
              index: 4
            }); // 执行前一个页面的onLoad方法
          }
        })
      }, 1500)
    })
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