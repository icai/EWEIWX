/**
 *
 * commission/register/index.js
 *
 * @create 2017-2-6
 * @author Young
 *
 * @update  Young 2017-2-6
 *
 */
var app = getApp(), core = app.requirejs('core');
var diyform = app.requirejs('biz/diyform');
Page({
    data: {
        areas: [],
    },
    onLoad: function (options) {
        var $this = this
        setTimeout(function () {
            $this.setData({ areas: app.getCache("cacheset").areas });
        }, 300)
    },
    onShow: function () {
        this.getData();
    },
    getData: function () {
        var $this = this;
        core.get('commission/register', {}, function (json) {
            if (json.error == 70003){
                wx.redirectTo({
                    url:'../index'
                });
                return;
            }
            json.show = true;
            wx.setNavigationBarTitle({
                title: "申请成为"+json.set.texts.agent||'申请'
            });
            $this.setData(json);
            $this.setData({
              diyform: {
                f_data: json.f_data,
                fields: json.fields
              }});
        
        });
    },
    inputChange: function (e) {
        if (e.target.id == 'realname') {
            this.setData({'member.realname': e.detail.value})
        } else if (e.target.id == 'mobile') {
            this.setData({'member.mobile': e.detail.value})
        } else if (e.target.id == 'weixin') {
            this.setData({'member.weixin': e.detail.value})
        } else if (e.target.id == 'icode'){
          this.setData({ 'member.icode': e.detail.value })
        }
    },
    submit: function (e) {
    
      if ( this.data.template_flag == 0){
        if (!this.data.member.realname) {
          core.alert('请填写,真实姓名!');
          return;
        }
        if (!this.data.member.mobile) {
          core.alert('请填写,手机号!');
          return;
        }
        var data = {
          'realname': this.data.member.realname,
          'mobile': this.data.member.mobile,
        };
      }else{
        var memberdata = this.data.diyform;
        var verify = diyform.verify(this, memberdata);
        if (!verify) {
          core.alert('请检查必填项是否填写');
          return;
        }

        var data = {
          'memberdata': this.data.diyform.f_data,
          'agentid': this.data.mid,
          'icode': this.data.member.icode,
          'weixin': this.data.member.weixin,
        }
      }
      
        core.post('commission/register', data, function (json) {
            if (json.error == 0){
                wx.redirectTo({
                    url:json.check==1?'../index':'../register/index',
                    fail: function () {
                      wx.switchTab({
                        url: json.check == 1 ? '../index' : '../register/index'
                      })
                    }
                });
                return;
            }else{
                core.alert(json.message)
            }
        });
    },
    DiyFormHandler: function (e) {
      return diyform.DiyFormHandler(this, e)
    },
    selectArea: function (e) {
        return diyform.selectArea(this, e)
    },
    bindChange: function (e) {
        return diyform.bindChange(this, e)
    },
    onCancel: function (e) {
        return diyform.onCancel(this, e)
    },
    onConfirm: function (e) {
        return diyform.onConfirm(this, e)
    },
    getIndex: function (str, areas) {
        return diyform.getIndex(str, areas)
    },
});