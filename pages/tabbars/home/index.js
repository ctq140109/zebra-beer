const app = getApp();
import {
  CargoModel
} from '../../../service/cargo.js';
let cargoModel = new CargoModel();
const http = app.globalData.http;
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },
  attached() {
    console.log('首页组件已初始化');
    this.onLoad();
  },
  /**
   * 组件的初始数据
   */
  data: {
    imgBaseUrl: '',
    imgArr: [],
    classify_list: [],
    class_two_list: [],
    classify_id: null,
    classify_two_id: null,
    cargoList: [],
    isLoad: false,
    CustomBar: app.globalData.CustomBar,
    alreadyLoadData: false,
    logo:'',
    cardCur: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail: function(e) {
      console.log(e);
      var item = e.currentTarget.dataset.cargo;
      wx.navigateTo({
        url: '../detail/detail?cargoItem=' + JSON.stringify(item)
      });
    },
    preDetail(e) {
      console.log(e.currentTarget.dataset.cargoid);
      if (e.currentTarget.dataset.cargoid == null || e.currentTarget.dataset.cargoid == '') {
        return false
      }
      wx.showLoading({
        title: '加载中...'
      })
      app.globalData.http.request({
        url: '/BeerApp/cargo/get.do?id=' + e.currentTarget.dataset.cargoid
      }).then(resp => {
        console.log(resp.data);
        resp.data.imgArr = resp.data.cargoImg ? resp.data.cargoImg.split(',') : [];
        wx.hideLoading();
        wx.navigateTo({
          url: '../detail/detail?cargoItem=' + JSON.stringify(resp.data)
        });
      })
    },
    //获取banner
    getBanner() {
      app.globalData.http.request({
        url: '/BeerApp/home/all'
      }).then(res => {
        console.log(res);
        this.setData({
          imgArr: res.data
        })
        this.getPidCate();
      })
    },
    //获取标签栏
    getPidCate() {
      let cargoModel = new CargoModel();
      cargoModel.getList().then(res => {
        console.log(res);
        this.setData({
          classify_list: res.data
        })
        this.selectClass({
          detail: {
            id: res.data[0].id
          }
        });
        wx.hideLoading();
        this.setData({
          alreadyLoadData: true
        })
      })
    },
    //点击主分类
    selectClass(e) {
      console.log('classify_id=', e.detail.id)
      this.setData({
        classify_id: e.detail.id
      })
      for (let i of this.data.classify_list) {
        if (i.id == e.detail.id) {
          this.setData({
            class_two_list: i.levelList
          })
        }
      }
      if (this.data.class_two_list.length > 0) {
        this.selectSubClass({
          detail: {
            id: this.data.class_two_list[0].id
          }
        });
      } else {
        this.setData({
          classify_two_id: null
        })
        this.getCargo();
      }
    },
    //点击子分类
    selectSubClass: function(e) {
      console.log(e);
      var id = e.detail.id;
      console.log('classify_two_id=', id);
      this.setData({
        classify_two_id: id
      });
      this.getCargo();
    },
    onLoad: function() {
      wx.showLoading({
        title: '加载中'
      })
      this.setData({
        imgBaseUrl: app.globalData.imgBaseUrl
      })
      this.getIcon();
      this.isClosed();
      this.getBanner();
    },
    //
    getIcon(){
      app.getIcons().then(res => {
        this.setData({
          logo: app.globalData.iconListSix[0].src
        })
      })
    },
    //获取分类商品
    getCargo() {
      wx.showLoading({
        title: '加载中...'
      })
      this.setData({
        cargoList: []
      })
      cargoModel.getCargoByType(this.data.classify_id, this.data.classify_two_id).then(resp => {
        console.log(resp);
        for (let i = 0; i < resp.data.length; i++) {
          resp.data[i].imgArr = resp.data[i].cargoImg.split(',');
        }
        this.setData({
          cargoList: resp.data,
          isLoad: true
        });
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      })
    },
    isClosed() {
      let timeFlag = wx.getStorageSync("timeFlag");
      let dialog = this.selectComponent("#close-shop");
      if (timeFlag == true) {
        dialog.setData({
          isState: true,
          isShow: false
        })
      } else {
        dialog.setData({
          isState: false,
          isShow: true
        })
      }
    },
    onRefresh: function() {
      console.log('下拉刷新');
      wx.showNavigationBarLoading();
      this.onLoad();
      this.setData({
        alreadyLoadData: false,
      })
    },
    DotStyle(e) {
      this.setData({
        DotStyle: e.detail.value
      })
    },
    // cardSwiper
    cardSwiper(e) {
      console.log(e);
      this.setData({
        cardCur: e.detail.current
      })
    },
  }
})