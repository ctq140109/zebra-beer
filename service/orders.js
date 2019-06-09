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
  //退款
  refund(out_trade_no, total_fee) {
    let fee = total_fee * 100; //转换为分为单位
    return this.request({
      url: '/BeerApp/wx/refund.do?out_trade_no=' + out_trade_no + '&total_fee=' + fee,
      method: 'POST',
      header: 'json'
    })
  }
  //取消订单
  cancelOrder(id) {
    return this.request({
      url: '/BeerApp/trade/cancel.do?id=' + id,
      method: 'POST',
      header: 'json'
    })
  }
  //获取订单分类数量
  getOrderNum() {
    let openid = wx.getStorageSync("openid");
    if (openid != '') {
      return this.request({
        url: '/BeerApp/trade/statistics?userId=' + openid
      })
    }
  }
}
export {
  OrdersModel
}