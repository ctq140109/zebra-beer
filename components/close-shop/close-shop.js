const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    isState: false,
    isShow: false,
    img: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeShare: function() {
      this.setData({
        isState: true
      })
    }
  },
  attached() {
    console.log('组件节点数完成');
    app.getIcons().then(res => {
      this.setData({
        img: app.globalData.imgBaseUrl + (app.globalData.iconListFour.length > 0 ? app.globalData.iconListFour[0].src : "")
      })
    });
  }
})