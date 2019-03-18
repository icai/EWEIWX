/**
 *
 * order/pay/index.js
 *
 * @create 2017-1-5
 * @author Young
 *
 * @update  Young 2017-01-10
 *
 */
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');
Page({
    data: {
        icons:app.requirejs('icons'),
        success:false,
        successData:{},

        coupon: false
    },
    onLoad: function (options) {
        app.checkAuth();
        var $this = this, goodslist = {};
        this.setData({
            options: options
        });
        
        app.url(options);
    },
    onShow:function () {
        this.get_list();
    },
    get_list:function () {
        var $this=this;
        this.setData({ order_id: $this.data.options.id});
        core.get('groups/pay', { orderid: $this.data.options.id, teamid: $this.data.options.teamid}, function (list) {

            if( list.error == 1 ){
              core.alert(list.message);
            }

            if (list.error == 50018) {
                wx.navigateTo({
                    url: '/pages/order/details/index?id='+$this.data.options.id
                });
                return;
            }

            if (list.data.wechat.success ){
              if (!list.data.wechat.success && list.data.money != '0.00' && list.data.wechat.payinfo) {
                core.alert(list.wechat.payinfo.message + '\n不能使用微信支付!');
              }
            }
            
            
            $this.setData({
                list: list.data,
                show:true
            });
        });
    },
    pay: function (e) {
        var type = core.pdata(e).type,$this=this,wechat = this.data.list.wechat;
        if (type == 'wechat') {
            core.pay(wechat.payinfo,function (res) {
                if (res.errMsg == "requestPayment:ok"){
                    $this.complete(type)
                    // $this.setData({coupon: true})
                }
            });
        } else if (type == 'credit') {
            core.confirm('确认要支付吗?', function () {
                $this.complete(type)
                // $this.setData({ coupon: true })
            }, function () {
            })
        } else if (type == 'cash') {
            core.confirm('确认要使用货到付款吗?', function () {
                $this.complete(type)
                // $this.setData({ coupon: true })
            }, function () {
            })
        } else {
            $this.complete(type)
            // $this.setData({ coupon: true })
        }
    },
    complete: function (type) {
        var $this = this;
        core.post('groups/pay/complete', {id: $this.data.options.id, type: type}, function (pay_json) {
            if (pay_json.error == 0) {
                wx.setNavigationBarTitle({title: '支付成功'});
                $this.setData({
                    success: true,
                    pay_type:pay_json.type,
                    pay_fee:pay_json.fee,
                    orderno:pay_json.orderno,
                    pay_msg:pay_json.msg
                });
                if ($this.data.list.teamid==0){
                  wx.reLaunch({
                    url: '../order/index'
                  })
                }else{
                  wx.reLaunch({
                    url: '../groups_detail/index?teamid=' + $this.data.list.teamid,
                  })
                }
                return
            }
            foxui.toast($this,pay_json.message)
        }, true, true)
    },
    shop:function(e){
        var send = core.pdata(e).id;
        if(send==0){
            this.setData({ shop:1 });
        }else{
            this.setData({ shop:0 });
        }
    },
    phone:function(e){
        core.phone(e);
    },

    closecoupon: function(){
      this.setData({ coupon: false})
    }
});