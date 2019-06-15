import {
  HTTP
} from './request.js'

class CartModel extends HTTP {

  // 加入我的购物车
  joinMyCart(quantity, specId, cargoId, cargoName) {
    let openid = wx.getStorageSync("openid");
    if (openid != "") {
      return this.request({
        url: '/BeerApp/shop/add.do',
        data: {
          "cargoName": cargoName,
          "cargoId": cargoId,
          "quantity": quantity,
          "specId": specId,
          "state": 1,
          "userId": openid
        },
        method: 'POST',
        header: 'json'
      })
    }
  }
  //获取我的购物车
  getMyCart() {
    let openid = wx.getStorageSync("openid");
    if (openid != "") {
      return this.request({
        url: '/BeerApp/shop/get.do?userId=' + openid,
        method: 'POST',
        header: 'json'
      })
    }
  }
  //删除我的购物车
  delMyCart(arr) {
    return this.request({
      url: '/BeerApp/shop/delete.do',
      data: arr,
      method: 'POST',
      header: 'json'
    })
  }
}
export {
  CartModel
}