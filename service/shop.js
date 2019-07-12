import {
  HTTP
} from './request.js'

class ShopModel extends HTTP {
  // 查询店铺营业状态
  getStatus() {
    return this.request({
      url: '/BeerApp/shopTime/timeFlag.do'
    })
  }
}
export {
  ShopModel
}