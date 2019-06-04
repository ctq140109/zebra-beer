const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    type: true, //true为购买false为加入购物车
    imgBaseUrl: '',
    cargoItem: {},
    name: '',
    showModalStatus: false,
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    //选择的规格
    standard: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function(option) {
      wx.showLoading({
        title: '加载中'
      })
      console.log(option);
      this.setData({
        cargoItem: JSON.parse(option.cargoItem),
        imgBaseUrl: app.globalData.imgBaseUrl
      });
      wx.hideLoading();
    },
    selectStandard: function(e) {
      console.log(e);
      let str = this.data.standard == '' ? e.target.dataset.standardid : '';
      this.setData({
        standard: str
      })
    },
    addtoCart: function() {
      if (this.data.standard == '') {
        this._showModal('请选择包装');
        return false;
      }
      let orderObj = {
        cargoId: this.data.cargoItem.id,
        quatity: this.data.num
      };
      // wx.setStorageSync('cart', orderObj);
      // 加入我的购物车
      wx.showModal({
        title: '温馨提示',
        content: '已加入购物车',
        cancelText: '继续购物',
        confirmText: '去购物车',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../cart/cart'
            });
          }
        }
      })
    },
    toIndex: function() {
      wx.switchTab({
        url: '../index/index',
      });
    },
    toCart: function() {
      wx.switchTab({
        url: '../cart/cart',
      });
    },
    toBuy: function() {
      if (this.data.standard == '') {
        this._showModal('请选择包装');
        return false;
      }
      let orderObj = {
        cargoItem: this.data.cargoItem,
        quantity: this.data.num
      };
      wx.navigateTo({
        url: '../buy/buy?orderObj=' + JSON.stringify(orderObj),
      })
    },
    _showModal: function(msg) {
      wx.showModal({
        title: '提示',
        content: msg,
      })
    },
    powerDrawer: function(e) {
      console.log(e);
      var currentStatu = e.currentTarget.dataset.statu;
      var currentType = e.currentTarget.dataset.type;
      if (currentStatu == "open") {
        this.setData({
          type: currentType
        });
      }
      this.util(currentStatu);
    },
    util: function(currentStatu) {
      /* 动画部分 */
      // 第1步：创建动画实例 
      var animation = wx.createAnimation({
        duration: 200, //动画时长
        timingFunction: "linear", //线性
        delay: 0 //0则不延迟
      });

      // 第2步：这个动画实例赋给当前的动画实例
      this.animation = animation;

      // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
      animation.translateY(240).step();

      // 第4步：导出动画对象赋给数据对象储存
      this.setData({
        animationData: animation.export()
      });

      // 第5步：设置定时器到指定时候后，执行第二组动画
      setTimeout(function() {
        // 执行第二组动画：Y轴不偏移，停
        animation.translateY(0).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
        this.setData({
          animationData: animation
        });

        //关闭抽屉
        if (currentStatu == "close") {
          this.setData({
            showModalStatus: false
          });
        }
      }.bind(this), 200);

      // 显示抽屉
      if (currentStatu == "open") {
        this.setData({
          showModalStatus: true
        });
      }
    },
    /* 点击减号 */
    bindMinus: function() {
      var num = this.data.num;
      // 如果大于1时，才可以减  
      if (num > 1) {
        num--;
      }
      // 只有大于一件的时候，才能normal状态，否则disable状态  
      var minusStatus = num <= 1 ? 'disabled' : 'normal';
      // 将数值与状态写回  
      this.setData({
        num: num,
        minusStatus: minusStatus
      });
    },
    /* 点击加号 */
    bindPlus: function() {
      var num = this.data.num;
      // 不作过多考虑自增1  
      num++;
      // 只有大于一件的时候，才能normal状态，否则disable状态  
      var minusStatus = num < 1 ? 'disabled' : 'normal';
      // 将数值与状态写回  
      this.setData({
        num: num,
        minusStatus: minusStatus
      });
    },
    /* 输入框事件 */
    bindManual: function(e) {
      var num = e.detail.value;
      // let reg = /^[1-9]+$/
      if (num > 0) {
        // 将数值与状态写回  
        this.setData({
          num: num
        });
      } else {
        this.setData({
          num: 1
        });
      }
    }
  }
})