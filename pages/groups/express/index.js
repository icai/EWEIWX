
var app = getApp(), core = app.requirejs('core');
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      options: options
    });
    app.url(options);
    this.get_list();
  },
  get_list: function () {
    var $this = this;
    core.get('groups/order/express', $this.data.options, function (list) {
      if (list.error == 0) {
        list.show = true;
        $this.setData(list);
      } else {
        core.toast(list.message, 'loading')
      }
    });
  }
});