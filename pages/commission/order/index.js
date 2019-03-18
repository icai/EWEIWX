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
        status: '',
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
    toggleSend: function (e) {
        if(!this.data.openorderdetail&&!this.data.openorderbuyer){
            return;
        }
        var index = e.currentTarget.dataset.index;
        var code = this.data.list[index].code;
        var list = this.data.list;
        if (code==1) {
            list[index].code = 0;
        } else {
            list[index].code = 1;
        }
        this.setData({list: list});
    },
    getList: function () {
        var $this = this;
        core.get('commission/order/get_list', {page: $this.data.page, status: $this.data.status}, function (ret) {
            delete ret.error;
            var data = ret;
            data.show = true;
            if (ret.list.length > 0) {
                data.page = $this.data.page + 1;
                data.list = $this.data.list.concat(ret.list);
                if(ret.list.length<ret.pagesize) {
                    data.loaded = true
                }
            }
            $this.setData(data);
            wx.setNavigationBarTitle({title: ret.textorder});
        }, this.data.show);
    },
    myTab: function (e) {
        var $this = this;
        var status = core.pdata(e).status;
        $this.setData({status: status, page: 1, list: []});
        $this.getList();
    }
})