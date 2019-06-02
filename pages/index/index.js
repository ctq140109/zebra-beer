//index.js
//获取应用实例
const app = getApp()
import {
  CargoModel
} from '../../service/cargo.js';
Page({
  data: {
    imgUrls: [
      'http://apollo-wms.oss-cn-zhangjiakou.aliyuncs.com/20190529112848.jpg?Expires=3135900528&OSSAccessKeyId=LTAIAhZv9N2cPpLq&Signature=2cjU0FLWmF02sJRsncRA4%2FlJU7g%3D',
      'http://apollo-wms.oss-cn-zhangjiakou.aliyuncs.com/20190529113118.jpg?Expires=3135900678&OSSAccessKeyId=LTAIAhZv9N2cPpLq&Signature=1GuKlAdrvJ3%2BfAu%2FZqF7VqD1g2g%3D',
      'http://apollo-wms.oss-cn-zhangjiakou.aliyuncs.com/20190529113145.jpg?Expires=3135900705&OSSAccessKeyId=LTAIAhZv9N2cPpLq&Signature=nmdP3PfCLNf%2BUhUEoC%2FZqg2BN8Y%3D'
    ],
    cargoList: [{
      "id": 1,
      "image1": "../image/1-1.png",
      "shopName": "喜力啤酒THETORP原味生啤胶囊2L一支装进口生啤酒小麦麦芽",
      "price": 1280.00,
      "markPrice": 2256.00
    },
    {
      "id": 2,
      "image1": "../image/1-2.jpg",
      "shopName": "三得利啤酒 纯生9度 500ml*12听/罐 整箱装 Suntory",
      "price": 1280.00,
      "markPrice": 2256.00
    },
    {
      "id": 3,
      "image1": "../image/1-3.jpg",
      "shopName": "青岛啤酒 原浆5L桶装 扎啤鲜啤生啤酒 青岛原浆",
      "price": 1280.00,
      "markPrice": 2256.00
    },
    {
      "id": 4,
      "image1": "../image/1-4.jpg",
      "shopName": "摆谱 精酿青岛原浆啤酒 1L*2桶装 小麦白啤酒",
      "price": 1280.00,
      "markPrice": 2256.00
    }
    ]
  },
  //事件处理函数
  toDetail: function (e) {
    var item = e.currentTarget.dataset.cargo;
    console.log(item);
    wx.navigateTo({
      url: '../detail/detail?id=' + item.id + '&name=' + item.shopName
    });
  },
  onLoad:function(){
    // let cargoModel = new CargoModel();
    // cargoModel.getAllCargo().then(res=>{
    //   console.log(res);
    // });
    
  }
})