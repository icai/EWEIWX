/**
 *
 * commission/return/index.js
 *
 * @create 2017-11-29
 * @author AHa
 *
 *
 */
var app = getApp(),core=app.requirejs('core');

Page({
    data: {
        type: 0,
        page: 1,
        list: []
    },
    onLoad: function () {
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
    getList: function () {
        var $this = this;
        core.get('member.fullback.get_list', {page: $this.data.page, type: $this.data.type}, function (ret) {
        
            var data = {total: ret.total, pagesize: ret.pagesize, list: ret.list, show: true};
            if (ret.list.length > 0) {
                data.page = $this.data.page + 1;
                data.list = $this.data.list.concat(ret.list);
                if(ret.list.length<ret.pagesize) {
                    data.loaded = true
                }
            }
            $this.setData(data);
        });
    },
    myTab: function (e) {
        var $this = this;
      
        var type = e.currentTarget.dataset.type;
        $this.setData({type: type, page: 1, list: []});
        $this.getList()
    }
})