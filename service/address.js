import {
  HTTP
} from './request.js'

class AddressModel extends HTTP {
  // 新增地址
  addAddress(name, tel, address, detail, defaulted) {
    return this.request({
      url: '',
      method: 'POST',
      data: {
        name: name,
        tel: tel,
        address: address,
        detail: detail,
        defaulted: defaulted
      },
      header: 'json'
    })
  }
}
export {
  AddressModel
}