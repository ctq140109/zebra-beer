import {
  HTTP
} from './request.js'

class CargoModel extends HTTP {

  // 获取首页所有货物
  getAllCargo() {
    return this.request({
      url: '/BeerApp/cargo/getAll'
    })
  }
  //
  getCargoById(id) {
    return this.request({
      url: '/BeerApp/cargo/get.do?id=' + id
    })
  }
  //获取商品分类
  getList() {
    return this.request({
      url: '/BeerApp/cargoType/getList',
      data: {
        state: 1
      },
      method: 'POST',
      header: 'json'
    })
  }
  //获取指定类型商品
  getCargoByType(type) {
    return this.request({
      url: '/BeerApp/cargo/getCargoByType',
      data: {
        type: type
      },
      method: 'POST',
      header: 'json'
    })
  }
}
export {
  CargoModel
}