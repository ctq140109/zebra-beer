import {
  HTTP
} from './request.js'

class StandardModel extends HTTP {

  // 获取规格
  // state 为 1表示可用规格 否则不可用0 
  getStandard(cargoId, state) {
    return this.request({
      url: '/BeerApp/spec/get.do',
      data: {
        "cargoId": cargoId,
        // "description": "string",
        // "id": 0,
        // "img": "string",
        // "price": 0,
        // "quantity": 0,
        "state": state
      },
      method: 'POST',
      header: 'json'
    })
  }
}
export {
  StandardModel
}