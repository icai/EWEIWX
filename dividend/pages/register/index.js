var app = getApp();
var core = app.requirejs('/core');
var foxui = app.requirejs('/foxui');
var $ = app.requirejs('jquery');
var diyform = app.requirejs('biz/diyform');
Page({
  data: {
    checked: false,
    diyform: {},
    msg: {},

    showPicker: false,
    pvalOld: [0, 0, 0],
    pval: [0, 0, 0],
    areas: [],
    street: [],
    streetIndex: 0,
    noArea: false,
  },

  onLoad: function (options) {
    var $this = this;
	$this.setData({
      imgUrl: app.globalData.approot
    });
	setTimeout(function () {
      $this.setData({ areas: app.getCache("cacheset").areas });
    }, 1000)  },

  onShow: function () {
    var $this = this;
    $this.getlist()
  },

  changeinput: function (e) {
    var $this = this,
        val = e.detail.value,
        key = e.target.dataset.input,
        msg = $this.data.msg;
    msg[key] = val;
    $this.setData({ msg: msg });
  },

  selected: function(e){
    var checked = e.currentTarget.dataset.checked == true ? false : true;
    this.setData({checked: checked})
  },

  getlist: function(){
    var $this = this;
    core.get('dividend/register', '', function (res) {
      if (res.error == 1) {
        console.error(res.message)
        foxui.toast($this, res.message);
        setTimeout(function(){
          wx.reLaunch({
            url: '/pages/index/index'
          })
        },1000)
        // return
      }
      if (res.error == 82025){
        wx.redirectTo({
          url: '/pages/commission/register/index',
        })
      }
      wx.setNavigationBarTitle({
        title: "申请" + res.set.texts.become || '申请成为队长'
      });

      if (res.error == 0) {
        $this.setData({
          message: res, 
          diyform: {
            f_data: res.f_data,
            fields: res.fields
          }
        })
      }
    })
  },

  opendeal: function(){
    this.setData({isdeal: true})
  },
  close: function () {
    this.setData({ isdeal: false })
  },
  submit: function(e){
    var $this = this,
        msg = $this.data.msg,
        checked = $this.data.checked,
        open_protocol = e.currentTarget.dataset.open_protocol;
    if (!checked && open_protocol == 1 ){
      return
    }
    if (!$this.data.message.template_flag){
      if (!msg.realname) {
        foxui.toast($this, '请输入姓名');
        return
      }
      if (!msg.mobile) {
        foxui.toast($this, '请输入手机号');
        return
      }
    }else{
      // 自定义表单
      var memberdata = this.data.diyform;
      var verify = diyform.verify(this, memberdata);
      if (!verify) {
        return
      }
      msg = {'memberdata': this.data.diyform.f_data}
    }
   
    core.post('dividend/register', msg, function(res){
      if(res.error != 0){
        foxui.toast($this, res.message);
        return
      }
      $this.getlist()
    })
  },
  DiyFormHandler: function (e) {
    return diyform.DiyFormHandler(this, e)
  },
  selectArea: function (e) {
    return diyform.selectArea(this, e)
  },
  
  getIndex: function (str, areas) {
    return diyform.getIndex(str, areas)
  },
  
  onCancel: function (e) {
    return diyform.onCancel(this, e)
  },
  
  bindChange: function (e) {
    return diyform.bindChange(this, e)
  },
  onConfirm: function (e) {
    return diyform.onConfirm(this, e)
  },
})