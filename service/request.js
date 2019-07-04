class HTTP {
  // baseUrl = 'http://localhost:8080';
  baseUrl = 'http://39.98.208.192:16443';
  // baseUrl = 'https://www.apollo-wms.com:8080';
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
          this._showToast('请求出错，请稍后重试');
        }
        // let code = res.data.meta.code;
        // if (code == null) {
        //   resolve(res.data.data);
        // } else if (code == 1000) {
        //   reject();
        //   this._showToast('登录失效，请重新登录');
        // } else {
        //   reject();
        //   let msg = res.data.message;
        //   this._showToast(msg);
        // }
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