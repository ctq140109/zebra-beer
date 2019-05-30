// pages/detail.js
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
    imgUrls: [
      '../image/detail/detail1.jpg',
      '../image/detail/detail2.jpg'
    ],
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
      console.log(option.id, option.name); //获取到商品id
      this.setData({
        name: option.name + 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      });
    },
    toIndex: function() {
      console.log(1);
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
      // wx.redirectTo({
      //   url: '../buy/buy',
      // });
      wx.navigateTo({
        url: '../buy/buy',
      })
    },
    powerDrawer: function(e) {
      console.log(e);
      var currentStatu = e.currentTarget.dataset.statu;
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
      // 将数值与状态写回  
      this.setData({
        num: num
      });
    }
  }
})