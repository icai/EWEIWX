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
        status: 0,
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
        core.get('commission/log/get_list', {page: $this.data.page, status: $this.data.status}, function (ret) {
            var data = {total: ret.total, pagesize: ret.pagesize, commissioncount: ret.commissioncount, textyuan: ret.textyuan, textcomm:ret.textcomm, textcomd: ret.textcomd, show: true};
            if (ret.list.length > 0) {
                data.page = $this.data.page + 1;
                data.list = $this.data.list.concat(ret.list);
                if(ret.list.length<ret.pagesize) {
                    data.loaded = true
                }
            }
            $this.setData(data);
            wx.setNavigationBarTitle({title: ret.textcomd+"("+ret.total+")"});
        }, this.data.show);
    },
    myTab: function (e) {
        var $this = this;
        var status = core.pdata(e).status;
        $this.setData({status: status, page: 1, list: []});
        $this.getList();
    }
})