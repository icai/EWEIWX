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
    data: {},
    onLoad: function (options) {
        //页面初始化 options为页面跳转所带来的参数
    },
    onShow: function () {
        this.getData();
    },
    getData: function () {
        var $this=this;
        core.get('commission/index',{},function (json) {
            if (json.error == 70000){
                wx.redirectTo({
                    url:'/pages/commission/register/index'
                });
                return;
            }
            json.show=true;
            $this.setData(json);
            wx.setNavigationBarTitle({
              title: json.set.texts.center
            })
        });
    }
});