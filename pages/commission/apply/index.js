/**
 *
 * commission/apply/index.js
 *
 * @create 2017-2-7
 * @author Young
 *
 * @update  Young 2017-2-7
 *
 */
var app = getApp(), core = app.requirejs('core'),$=app.requirejs('jquery'),foxui=app.requirejs('foxui');
Page({
    data: {},
    onShow: function () {
        this.getData();
    },
    getData: function () {
        var $this = this;
        core.get('commission/apply', {}, function (json) {
            if (!$.isEmptyObject(json.type_array)){
                json.show = true;
                if($.isArray(json.last_data)){
                    json.last_data = {};
                }
                if (json.last_data){
                    json.last_data.alipay1 =  json.last_data.alipay;
                    json.last_data.bankcard1 = json.last_data.bankcard;
                }
                json.bankIndex = json.bankIndex||0;
                $this.setData(json);
            }else{
                core.alert(json.message || '没有提现方式!');
                setTimeout(function () {
                    if (json.error == 70001){
                      wx.redirectTo({
                            url: '/pages/member/info/index'
                        });
                    }else{
                        wx.navigateBack();
                    }
                },2000);
            }
        },false,true);
    },
    typeChange: function (e) {
       
        var val = e.currentTarget.dataset.name;
        
        this.setData({ applytype: val });
    },
    bankChange: function (e) {
        var val = e.detail.value;
        this.setData({bankIndex:val});
    },
    inputChange: function (e) {
        var realinfo = this.data.last_data;
        var bindtype = e.currentTarget.dataset.type,value = $.trim(e.detail.value);
        realinfo[bindtype]=value;
        this.setData({last_data: realinfo});
    },
    submit: function (event) {
        var $this=this, data=this.data,confirm_msg;
        if(!data.cansettle || data.isSubmit){
            return;
        }
        //mjy 弹窗提示
        if (data.applytype==0){
          var html = "提现到余额"
        } else if (data.applytype ==1){
          var html = "提现到微信钱包"

        } else if (data.applytype == 2) {
          var html = "提现到支付宝"

        } else if (data.applytype ==3) {
          var html = "提现到银行卡"

        }
     
        var postData = {type: data.applytype};
       
        if(data.applytype==2){
            if(!data.last_data.realname){
                foxui.toast($this, "请填写姓名");
                return;
            }
            if(!data.last_data.alipay){
                foxui.toast($this, "请填写支付宝帐号");
                return;
            }
            if(!data.last_data.alipay1){
                foxui.toast($this, "请确认支付宝帐号");
                return;
            }
            if(data.last_data.alipay != data.last_data.alipay1){
                foxui.toast($this, "两次填写的支付宝不一致");
                return;
            }
            html += "？姓名:" + data.last_data.realname + " 支付宝帐号:" + data.last_data.alipay;
            postData.realname = data.last_data.realname;
            postData.alipay = data.last_data.alipay;
            postData.alipay1 = data.last_data.alipay1;
           
        }
        
        else if(data.applytype==3){
            if(!data.banklist[data.bankIndex]['bankname']){
                foxui.toast($this, "请选择提现银行");
                return;
            }
            if(!data.last_data.realname){
                foxui.toast($this, "请填写姓名");
                return;
            }
            if(!data.last_data.bankcard){
                foxui.toast($this, "请填写银行卡号");
                return;
            }
            if(!data.last_data.bankcard1){
                foxui.toast($this, "请确认银行卡号");
                return;
            }
            if(data.last_data.bankcard != data.last_data.bankcard1){
                foxui.toast($this, "两次填写的银行卡号不一致");
                return;
            }
            html += "？姓名:" + data.last_data.realname + " 银行:" + data.banklist[data.bankIndex]['bankname'] + " 卡号:" + data.last_data.bankcard;
            postData.realname = data.last_data.realname;
            postData.bankname = data.banklist[data.bankIndex]['bankname'];
            postData.bankcard = data.last_data.bankcard;
            postData.bankcard1 = data.last_data.bankcard1;
            
        }
        if (data.applytype < 2) {
            confirm_msg = '确认要' + html + "？";
        } else {
            confirm_msg = '确认要' + html;
        }
        if (data.set_array['charge'] > 0) {
            confirm_msg += ' 扣除手续费 ' + data.deductionmoney + ' 元,实际到账金额 ' + data.realmoney + ' 元';
        }

        core.confirm(confirm_msg, function () {
            $this.setData({isSubmit: true});
            core.post('commission/apply', postData, function (result) {
                if(result.error){
                    foxui.toast($this, result.message);
                    $this.setData({isSubmit: false});
                    return;
                }
                foxui.toast($this, "提现申请成功，请等待审核");
                setTimeout(function () {
                    wx.navigateBack();
                }, 500);
            },true,true);
        });
    }
});