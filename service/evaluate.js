import {
  HTTP
} from './request.js';
class EvaluateModel extends HTTP {
  //发布评价
  releaseEva(orderid, score, evaluation, cargoId, specId, userImg) {
    let openid = wx.getStorageSync("openid");
    if (openid != '') {
      return this.request({
        url: '/BeerApp/evaluation/add.do',
        data: {
          "cargoId": cargoId,
          "description": evaluation,
          "grade": score,
          "tradeCargoId": orderid,
          "userId": openid,
          "specId": specId,
          "userImg": userImg
        },
        method: 'POST',
        header: 'json'
      })
    }
  }
  //获取评价
  getEvaluation(cargoid, nowPage) {
    return this.request({
      // url: '/BeerApp/evaluation/get.do?cargoid=' + cargoid + "&page=" + 0 + "&size=" + 5,
      url: '/BeerApp/evaluation/get.do',
      data: {
        "cargoId": cargoid,
        "page": nowPage,
        "size": 10
      },
      method: 'POST',
      header: 'www'
    })
  }
}
export {
  EvaluateModel
}