
var app = getApp(), core = app.requirejs('core');
var foxui = app.requirejs('foxui');
var $ = app.requirejs('jquery');
Page({
  data: {
    express: '',
    expresscom: '',
    expresssn: '',
    orderid:''
  },
  onLoad: function (options) {
    var $this = this
    // 页面初始化 options为页面跳转所带来的参数
    core.post('groups.refund', { orderid: options.orderid}, function (list) {
      if (list.error == 0) {
        list.show = true;
        $this.setData(list);
        $this.setData({
          options: options
        });
        
      } else {
        core.toast(list.message, 'loading')
      }
    });
   
  },
  inputPrickChange: function (e) {
    var $this = this;
    var express_list = $this.data.express_list;
    var index = e.detail.value;
    var expresscom = express_list[index].name;
    var express = express_list[index].express;
    $this.setData({ expresscom: expresscom, express: express, index: index });
  },
  inputChange: function (e) {
    var expresssn = e.detail.value;
    this.setData({ expresssn: expresssn });
  },
  back: function () {
    wx.navigateBack();
  },
  submit: function (e) {
  
    var $this = this;
    var expresssn = $this.data.expresssn;
    var refundid = $this.data.options.refundid;
    var orderid = $this.data.options.orderid;
    

    if (expresssn == "") {
      wx.showToast({
        title: '请填写快递单号',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    var express = $this.data.express;
    var expresscom = $this.data.expresscom;
    var data = {
      express: express,
      expresscom: expresscom,
      expresssn: expresssn,
      orderid: orderid,
      
    };
    core.post('groups.refund.express', data, function (list) {
      if (list.error == 0) {
        wx.navigateBack()
      } else {
        wx.showToast({
          title: list.error,
          icon: 'none',
          duration: 2000
        });
      }
    }, true);
   

  }
});