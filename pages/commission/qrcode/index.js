/**
 *
 * commission/index.js
 *
 * @create 2017-2-6
 * @author Young
 *
 * @update  Young 2017-2-6
 *
 */
var app = getApp(),core=app.requirejs('core');
Page({
    data: {
        showimage: false
    },
    onLoad: function (options) {
        //页面初始化 options为页面跳转所带来的参数
    },
    onShow: function () {
        this.getData();
    },
    getData: function () {
        var $this=this;
        core.get('commission/qrcode',{},function (json) {
            if (json.error == 70001){
                wx.redirectTo({
                    url:'/pages/member/info/index'
                });
                return;
            }
            json.show=true;
            $this.setData(json);
            $this.getImage();
        });
    },
    getImage: function () {
        var $this=this;
        core.post('commission/qrcode',{},function (json) {
            if (json.error == 70001){
                wx.redirectTo({
                    url:'/pages/member/info/index'
                });
                return;
            }
            json.showimage=true;
            $this.setData(json);
        });
    }
});