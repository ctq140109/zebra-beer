Component({
  //下面是组件的属性列表
  options: {},
  properties: {
    background: {
      type: String,
      value: '#f7f7f7'
    },
    selectBackground: {
      type: String,
      value: '#f7f7f7'
    },
    color: {
      type: String,
      value: '#424242'
    },
    height: {
      type: String,
      value: '80rpx'
    },
    selectedColor: {
      type: String,
      value: '#FFA500'
    },
    hasBorder: {
      type: Boolean,
      value: false
    },
    scrollX: {
      type: Boolean,
      value: false
    },
    tabTitle: {
      type: Object,
      value: [],
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        // console.log('组件列表变化',newVal);
        this.setData({
          num: 0
        })
      }
    }
  },
  //组件的初始数据
  data: {
    num: 0
  },
  //组件的方法列表
  methods: {
    toggle: function(e) {
      console.log(e);
      if (this.data.num === e.currentTarget.dataset.index) {
        return false;
      } else {
        this.setData({
          num: e.currentTarget.dataset.index
        })
        this.triggerEvent('tabevent', {
          id: e.currentTarget.dataset.id
        });
      }
    }
  }
})