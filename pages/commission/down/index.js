/**
 *
 * commission/down/index.js
 *
 * @create 2017-02-09
 * @author 晚秋
 *
 * @update  晚秋 2017-02-09
 *
 */
var app = getApp(),core=app.requirejs('core');

Page({
    data: {
        level: 1,
        page: 1,
        list: []
    },
    onLoad: function () {
        this.getSet();
        this.getList();
    },
    onReachBottom: function () {
        if (this.data.loaded || this.data.list.length==this.data.total) {
            return;
        }
        this.getList();
    },
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    },
    getSet: function () {
        var $this = this;
        core.get('commission/down/get_set', {}, function (ret) {
            wx.setNavigationBarTitle({title: ret.textdown+"("+ret.total+")"});
            delete ret.error;
            ret.show = true;
            $this.setData(ret);
        });
    },
    getList: function () {
        var $this = this;
        core.get('commission/down/get_list', {page: $this.data.page, level: $this.data.level}, function (result) {
            var data = {total: result.total, pagesize: result.pagesize};
            if (result.list.length > 0) {
                data.page = $this.data.page + 1;
                data.list = $this.data.list.concat(result.list);
                if(result.list.length<result.pagesize) {
                    data.loaded = true
                }
            }
            $this.setData(data);
        }, this.data.show);
    },
    myTab: function (e) {
        var $this = this;
        var level = core.pdata(e).level;
        $this.setData({level: level, page: 1, list: []});
        $this.getList();
    }
})