import {
  HTTP
} from '../service/request.js';
const getIcon = back => {
  let http = new HTTP();
  http.request({
    url: '/BeerApp/buttonType/findInfo.do',
    data: {},
    method: 'POST',
    header: 'json'
  }).then(res => {
    console.log(res.data);
    back(res.data);
  })
}

module.exports = {
  getIcon: getIcon
}