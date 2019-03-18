/**
 *
 * order/detail/index.js
 *
 * @create 2017-1-12
 * @author Young
 *
 * @update  Young 2017-01-16
 *
 */
var app = getApp(),core=app.requirejs('core'),order = app.requirejs('biz/group_order');
Page({
    data: {
        code: false,
        consume: false,
        store: false,
        cancel:order.cancelArray,
        cancelindex:0,
        diyshow:{},
        city_express_state: 0,
        order_id :0,
        order:[],
        address:[],
        cancel: order.cancelArray
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
          order_id: options.order_id
        });
    },
    onShow:function () {
        this.get_list();
        var $this = this;
        var isIpx = app.getCache('isIpx');
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
    get_list: function () {
        var $this = this;
        core.get('groups/order/details', {orderid:$this.data.order_id}, function (list) {
          if (list.error>0){
            if (list.error != 50000) {
              core.toast(list.message, 'loading');
            }
            wx.redirectTo({
              url: '../order/index'
            })
          }
          
          $this.setData({ 
            show: true, 
            express: list.express,
            order: list.order, 
            address: list.address , 
            store :list.store,
            verify: list.verify,
            verifynum: list.verifynum,
            verifytotal: list.verifytotal,
            carrier: list.carrier,
            shop_name: list.sysset.shopname,
            goods:list.goods,
            goodRefund: list.goodRefund
            });
        });
    },
    more:function(){
      this.setData({all:true})
    },
    code: function (e) {
        var $this=this;
       
        core.post('groups/verify/qrcode', { id: $this.data.order.id, verifycode: $this.data.order.verifycode},function (json) {
            if (json.error==0){
                $this.setData({
                    code: true,
                    qrcode: json.url
                })
            }else{
                core.alert(json.message);
            }
        },true);
    },
    diyshow: function (e) {
        var diyshow=this.data.diyshow,goodsid=core.data(e).id;
        diyshow[goodsid] = !diyshow[goodsid];
        this.setData({
            diyshow:diyshow
        });
    },
    close: function () {
        this.setData({
            code: false,
        })
    },
    toggle: function (e) {
        var data = core.pdata(e),id=data.id,type=data.type,d={};
        (id == 0 || typeof id =='undefined') ? d[type] = 1 : d[type] = 0;
        this.setData(d);
    },
    phone:function(e){
        core.phone(e);
    },
    finish: function (e) {
      var $this = this;
      var order_id = e.target.dataset.orderid;
      core.confirm('是否确认收货', function () {
        core.get('groups/order/finish', { id: order_id }, function (result) {
          if (result.error == 0) {
            $this.get_list(true);
          } else {
            core.alert(result.message);
          }
        })
      });
    },

    delete_: function (e) {
      var $this = this;
      var order_id = e.target.dataset.orderid;
      core.confirm('是否确认删除', function () {
        core.get('groups/order/delete', { id: order_id }, function (result) {
          if (result.error == 0) {
            wx.reLaunch({
              url:'../order/index'
            });
          } else {
            core.alert(result.message);
          }
        })
      });
    },

    cancel: function (e) {
      var order_id = this.data.order_id;
      order.cancel(order_id, e.detail.value, '../order_detail/index?order_id=' + order_id);
    },
    refundcancel: function (e) {
      core.post('groups.refund.cancel', { orderid: this.data.order_id }, function (res) {
        if (res.error == 0) {
          wx.navigateBack()
        } else {
          wx.showToast({
            title: res.error,
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    onShareAppMessage: function () {
        return core.onShareAppMessage();
    }
})