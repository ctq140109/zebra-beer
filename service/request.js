class HTTP {
  // baseUrl = 'http://192.168.0.128:8080';
  // baseUrl = 'http://39.98.208.192:16443';
  baseUrl = 'https://shengpi.apollo-wms.com';
  request({
    url,
    data = {},
    method = 'GET',
    header = 'json'
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method, header)
    })
  }

  _request(url, resolve, reject, data, method, header) {
    let headers = header == 'json' ? 'application/json' : 'application/x-www-form-urlencoded';
    wx.request({
      url: this.baseUrl + url,
      method: method,
      data: data,
      header: {
        'content-type': headers
        // 'content-type': 'application/x-www-form-urlencoded'
        // 'content-type': 'application/json' // POST默认值
      },
      success: (res) => {
        if (res.data.meta.success == true) {
          resolve(res.data);
        } else {
          reject();
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
          if (res.data.meta.code == 100){
            this._showToast(res.data.meta.message);
          }else{
            this._showToast('请求出错，请稍后重试');
          }
        }
      },
      fail: (err) => {
        reject();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        this._showToast('请求出错，请稍后重试');
      }
    })
  }

  _showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    })
  }
}

export {
  HTTP
}