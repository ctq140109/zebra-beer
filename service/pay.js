import {
  HTTP
} from './request.js'

class PayModel extends HTTP {
  //发起支付
  getAllCargo(trade_no, total_fee, body) {
    let openid = wx.getStorageSync("openid");
    if (openid != "") {
      return this.request({
        url: '/BeerApp/wx/pay.do?out_trade_no=' + trade_no + '&total_fee=' + total_fee + '&body=' + body + '&openid=' + openid,
        method: 'POST',
        header: 'json'
      })
    }
  }
}
export {
  PayModel
}