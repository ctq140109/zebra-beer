import {
  HTTP
} from './request.js'

class AddressModel extends HTTP {
  // 新增地址
  addAddress(openid, name, tel, address, detail, lat, lng) {
    return this.request({
      url: '/BeerApp/addr/add.do',
      method: 'POST',
      data: {
        addr: detail,
        city: address,
        phone: tel,
        receiver: name,
        lat: lat,
        lng: lng,
        userId: openid
      },
      header: 'json'
    })
  }
  //编辑地址
  editAddress(addrid, openid, name, tel, address, detail, lat, lng) {
    return this.request({
      url: '/BeerApp/addr/update.do',
      method: 'POST',
      data: {
        id: addrid,
        addr: detail,
        city: address,
        phone: tel,
        receiver: name,
        lat: lat,
        lng: lng,
        userId: openid
      },
      header: 'json'
    })
  }
  //获取我的地址
  getAddress(openid) {
    return this.request({
      url: '/BeerApp/addr/get.do?userId=' + openid,
      method: 'POST',
      header: 'json'
    })
  }
  //删除我的地址
  deleteAddress(id) {
    return this.request({
      url: '/BeerApp/addr/delete.do?id=' + id,
      method: 'POST',
      header: 'www'
    })
  }
  //设置默认地址
  setDefault(id, userId) {
    return this.request({
      url: '/BeerApp/addr/setDefoult.do?id=' + id + '&userId=' + userId,
      method: 'POST',
      header: 'www'
    })
  }
}
export {
  AddressModel
}