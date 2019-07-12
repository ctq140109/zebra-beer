const app = getApp();
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '授权提醒' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    content: {
      type: String,
      value: '请授权用户登录，以便为您提供更好的服务'
    },
    // 弹窗取消按钮文字
    cancelText: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: '授权登录'
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: false,
  },
  methods: {
    /*
     * 公有方法
     */
    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      //触发成功回调
      this.triggerEvent("confirmEvent");
      console.log(1);
    },
    getUserInfo: function(e) {
      wx.showLoading({
        title: '登录中...'
      })
      console.log('getUserInfo', e);
      if (e.detail.userInfo == undefined) {
        app.globalData.hasUserInfo = false;
        //取消授权
        wx.showToast({
          title: '取消授权',
          icon: "none"
        })
      } else {
        //授权成功
        // app.globalData.userInfo = e.detail.userInfo;
        // app.globalData.hasUserInfo = true;
        console.log(e.detail.userInfo.nickName);
        wx.setStorageSync('userinfo', JSON.stringify(e.detail.userInfo));
        //授权成功后进行登录
        this.getOpenid(e.detail.userInfo);
      }
    },
    getOpenid: function(userinfo) {
      var that = this;
      console.log('获取code登录');
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res);
          wx.setStorageSync("code", res.code);
          app.globalData.http.request({
            url: '/BeerApp/login/index.do?code=' + res.code + '&nickName=' + userinfo.nickName + '&avatarUrl=' + userinfo.avatarUrl
          }).then(res => {
            console.log(res);
            wx.setStorageSync("openid", res.data.openid);
            wx.hideLoading();
            that.setData({
              isShow: false
            })
            that.triggerEvent('loginevent', {
              hasUserInfo: true,
              userInfo: userinfo
            });
            wx.showToast({
              title: '授权登录成功'
            })
          })
        }
      })
    }
  }
})