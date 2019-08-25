const app = getApp();
Page({
  data: {
    PageCur: 'home',
    tabList: [{
        id: 1,
        name: '首页',
        src: 'home',
        url: {
          path: "home",
          selectedColor: "#ef0007",
          color: "#8a8a8a"
        }
      },
      {
        id: 2,
        name: '购物车',
        src: 'cart',
        url: {
          path: "cart",
          selectedColor: "#ef0007",
          color: "#8a8a8a"
        }
      },
      {
        id: 3,
        name: '我的',
        src: 'center',
        url: {
          path: "center",
          selectedColor: "#ef0007",
          color: "#8a8a8a"
        }
      }
    ]
  },
  onLoad(){
    //获取导航栏图标
    app.getIcons().then(res => {
      let arr =[];
      for (let i of app.globalData.iconListFive){
        if(i.url){
          // console.log(i.url);
          i.url = JSON.parse(i.url);
          arr.push(i);
        }
      }
      this.setData({
        tabList: arr
      })
    });
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '笙·酿酒工坊',
      path: '/pages/index/index'
    }
  },
})