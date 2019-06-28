const app = getApp();
import {
  EvaluateModel
} from '../../service/evaluate.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    nowPage: 1,
    totalNum: 0,
    cargoid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cargoid: options.cargoid
    });
    this.getEva(options.cargoid);
  },
  getEva: function(cargoid) {
    console.log('获取评论');
    wx.showLoading({
      title: '加载中',
    })
    let evaluateModel = new EvaluateModel();
    evaluateModel.getEvaluation(cargoid, this.data.nowPage).then(res => {
      console.log(res);
      let list = res.data.list;
      for(let i of list){
        let str = i.userId;
        let len = str.length;
        i.hideName = str.substring(len - len, len - (len - 1)) + "***" + str.substring((len - 1), len);
      }
      let lists = this.data.list;
      for(let j of list){
        lists.push(j);
      }
      this.setData({
        list: lists,
        imgBaseUrl: app.globalData.imgBaseUrl,
        totalNum: res.data.total
      })
      wx.hideLoading();
    });
  },
  loadingMore: function() {
    let nowPage = this.data.nowPage;
    nowPage++;
    this.setData({
      nowPage: nowPage
    });
    //
    this.getEva(this.data.cargoid);
  },
  onReachBottom: function() {
    console.log('页面上拉', this.data.totalNum);
    if (this.data.totalNum > this.data.list.length) {
      this.loadingMore();
    }
  }
})