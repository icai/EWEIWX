/**
 *
 * commission/withdraw/index.js
 *
 * @create 2017-2-6
 * @author Young
 *
 * @update  Young 2017-2-6
 *
 */
var app = getApp(), core = app.requirejs('core');
Page({
    data: {
        code: 0
    },
    onShow: function () {
        this.getData();
        var isIpx = app.getCache('isIpx');
        var $this = this;
        if (isIpx) {
          $this.setData({
            isIpx: true,
            iphonexnavbar: 'fui-iphonex-navbar',
            paddingb: 'padding-b'
          })
        } else {
          $this.setData({
            isIpx: false,
            iphonexnavbar: '',
            paddingb: ''
          })
        }
    },
    getData: function () {
        var $this=this;
        core.get('commission/withdraw',{},function (json) {
            json.show=true;
            $this.setData(json);
            wx.setNavigationBarTitle({
              title: json.set.texts.commission1
            })
        });
    },
    toggleSend: function (e) {
        var send = e.currentTarget.dataset.id;
        if (send == 0) {
            this.setData({code: 1});
        } else {
            this.setData({code: 0});
        }
    },
    withdraw: function (e) {
        var data=this.data;
        if (data.cansettle){
            wx.navigateTo({
                url: '../apply/index'
            });
        }
    }
});