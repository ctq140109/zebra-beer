class Tool{
  // 相加
  add(arg1, arg2) {
    return (Math.round(arg1 * 100) + Math.round(arg2 * 100)) / 100;
  }
  subtract(arg1, arg2) {
    return this.add(arg1, -arg2);
  }
  // arg1与arg2相乘
  multiple(arg1, arg2) {
    return (Math.round(arg1 * 100) * Math.round(arg2 * 100)) / 10000;
  }
  /**
     * arg1与arg2相除，并以四舍五入的方式保留小数点后2位
     */
  divide(arg1, arg2) {
    var d1, d2,
      n1 = Number(arg1.toString().replace(".", "")),
      n2 = Number(arg2.toString().replace(".", ""));
    try { d1 = arg1.toString().split(".")[1].length; } catch (e) { d1 = 0; }
    try { d2 = arg2.toString().split(".")[1].length; } catch (e) { d2 = 0; }
    return this.toFixed((n1 / n2) * Math.pow(10, d2 - d1), 2);
  }
  //重写toFixed arg以四舍五入的方式保留小数点后n位
  toFixed(arg, n) {
    if (n == 0) {
      return Math.round(arg)
    }
    try {
      var d, carryD, i,
        ds = arg.toString().split('.'),
        len = ds[1].length,
        b0 = '', k = 0
      if (len > n) {
        while (k < n && ds[1].substring(0, ++k) == '0') {
          b0 += '0'
        }
        d = Number(ds[1].substring(0, n))
        carryD = Math.round(Number('0.' + ds[1].substring(n, len)))
        len = (d + carryD).toString().length
        if (len > n) {
          return Number(ds[0]) + 1
        } else if (len == n) {
          return Number(ds[0] + '.' + (d + carryD))
        }
        return Number(ds[0] + '.' + b0 + (d + carryD))
      }
    } catch (e) { }
    return arg
  }
}
export {
  Tool
}