import {
  HTTP
} from './request.js';
class OrdersModel extends HTTP {
  // 获取订单
  getAllOrders(state) {
    let openid = wx.getStorageSync("openid");
    if (openid != '') {
      return this.request({
        url: '/BeerApp/trade/get.do',
        data: {
          "pageItem": {
            "page": 1,
            "size": 5
          },
          "state": state == 0 ? null : parseInt(state),
          "userId": openid
        },
        method: 'POST',
        header: 'json'
      })
    }
  }
  //更新订单状态
  updateOrders(id, state) {
    let openid = wx.getStorageSync("openid");
    if (openid != '') {
      return this.request({
        url: '/BeerApp/trade/update.do',
        data: {
          "id": id,
          "state": state,
          "userId": openid
        },
        method: 'POST',
        header: 'json'
      })
    }
  }
}
export {
  OrdersModel
}