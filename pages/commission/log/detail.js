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
var app = getApp(), core = app.requirejs('core');

Page({
    data: {
        page: 1,
        list: []
    },
    onLoad: function (options) {
        if(options.id>0){
            this.setData({id: options.id})
        }
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
        core.get('commission/log/detail_list', {page: $this.data.page, id: $this.data.id}, function (ret) {
            var data = {total: ret.total, pagesize: ret.pagesize, show: true, textyuan: ret.textyuan, textcomm: ret.textcomm};
            if (ret.list.length > 0) {
                data.page = $this.data.page + 1;
                data.list = $this.data.list.concat(ret.list);
                if(ret.list.length<ret.pagesize) {
                    data.loaded = true
                }
            }
            $this.setData(data);
        }, this.data.show);
    }
})