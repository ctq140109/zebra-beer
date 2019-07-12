Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    isState: false,
    isShow: false
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
  }
})