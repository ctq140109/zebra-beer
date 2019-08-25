const STATS = {
  init: '',
  pulling: 'pulling',
  enough: 'pulling enough',
  refreshing: 'refreshing',
  refreshed: 'refreshed',
  reset: 'reset',
  loading: 'loading'
}
Component({
  data: {
    onRefresh: true,
    loaderState: STATS.init,
    pullHeight: 0,
    progressed: 0,
    pullDownHeight: 0,
    scrollTop: 0,
    animate: {}
  },
  properties: {
    height: {
      type: String
    },
    alreadyLoadData: {
      type: Boolean,
      value: true,
      observer: function (e) {
        this.isChange(e)
      }
    },
    isEmpty: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    isChange: function (e) {
      if (e) {
        this.setData({
          loaderState: STATS.refreshed
        })
        setTimeout(() => {
          this.setData({
            loaderState: STATS.reset,
            pullDownHeight: 0
          }, this.initSTATS)
        }, 500);
      }
    },
    initSTATS: function () {
      setTimeout(() => {
        this.setData({
          loaderState: STATS.init
        })
      }, 500);
    },
    onScroll: function (e) {
      this.setData({
        scrollTop: e.detail.scrollTop
      })
    },
    isEnd: function () {
      this.triggerEvent('loadMore')
    },
    calculateDistance: function (touch) {
      return touch.clientY - this._initialTouch.clientY;
    },
    touchStart: function (e) {
      if (!this.canRefresh()) return;
      if (e.touches.length == 1) {
        this._initialTouch = {
          clientY: e.touches[0].clientY,
          scrollTop: this.data.scrollTop
        };
      }
    },
    touchMove: function (e) {
      if (!this.canRefresh() || this.data.scrollTop > 0) return;
      var distance = this.calculateDistance(e.touches[0]);
      if (distance > 0 && this.data.scrollTop <= 5) {
        var pullDistance = distance - this._initialTouch.scrollTop;
        if (pullDistance < 0) {
          pullDistance = 0;
          this._initialTouch.scrollTop = distance;
        }
        var pullHeight = this.easing(pullDistance);
        this.setData({
          loaderState: pullHeight > 60 ? STATS.enough : STATS.pulling,
          pullDownHeight: pullHeight
        });
      }
    },
    touchEnd: function (e) {
      if (!this.canRefresh()) return;
      if (this.data.ifScroll > 0) return;
      var endState = {
        loaderState: STATS.reset,
        pullDownHeight: 0
      };
      if (this.data.loaderState == STATS.enough) {
        this.setData({
          loaderState: STATS.refreshing,
        });
        setTimeout(() => {
          this.triggerEvent('onRefresh')
        }, 300);
      } else {
        this.setData(endState)
      }
    },
    easing: function (distance) {
      // t: current time, b: begInnIng value, c: change In value, d: duration
      var t = distance;
      var b = 0;
      var d = 170; // 允许拖拽的最大距离
      var c = d / 2.5; // 提示标签最大有效拖拽距离
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    canRefresh: function () {
      let { onRefresh, loaderState } = this.data
      return onRefresh && [STATS.refreshing, STATS.loading].indexOf(loaderState) < 0;
    },
  }
})