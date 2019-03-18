// pages/groups/confirm/index.js
var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery');
var foxui = app.requirejs('foxui');
var diyform = app.requirejs('biz/diyform');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:[],
    data:{},
    api:0,
    message:'',
    real_name:'',
    mobile:'',
    deduct:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $this = this;
    this.setData({ options: options});
   
    var isIpx = app.getCache('isIpx');
    if (isIpx) {
      $this.setData({
        isIpx: true,
        iphonexnavbar: 'fui-iphonex-navbar'
      })
    } else {
      $this.setData({
        isIpx: false,
        iphonexnavbar: ''
      })
    }

    core.get('groups/order/create_order', { 
      id: $this.data.options.id,
      group_option_id: $this.data.options.option_id,
      ladder_id: $this.data.options.ladder_id,
      type: $this.data.options.type,
      heads: $this.data.options.heads,
      teamid: $this.data.options.teamid,
      },function(msg){
        if( msg.error == 1 ){
          core.alert( msg.message );
          core.confirm(msg.message, function () { wx.navigateBack() }, function () { wx.navigateBack()} );
          return;
        }
      
        $this.setData({data:msg.data,sysset:msg.sysset});
        if (msg.data.address ){
          $this.setData({ aid: msg.data.address.id });
        }
        if(msg.data.fields.length>0){
          $this.setData({
            diyform: {
              f_data: msg.data.f_data,
              fields: msg.data.fields
            }})
        }
      });

  },
  onChange: function (e) {
    return diyform.onChange(this, e)
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
    diyform.onConfirm(this, e)

    var val = this.data.pval;
    var areas = this.data.areas;
    var detail = this.data.areaDetail.detail;
    detail.province = areas[val[0]].name;
    detail.city = areas[val[0]].city[val[1]].name;
    detail.datavalue = areas[val[0]].code + " " + areas[val[0]].city[val[1]].code;
    if (areas[val[0]].city[val[1]].area && areas[val[0]].city[val[1]].area.length > 0) {

      detail.area = areas[val[0]].city[val[1]].area[val[2]].name;
      detail.datavalue += " " + areas[val[0]].city[val[1]].area[val[2]].code;
      this.getStreet(areas, val);
    } else {
      detail.area = "";
    }

    detail.street = '';
    this.setData({ 'areaDetail.detail': detail, streetIndex: 0, showPicker: false });

    return
  },
  getIndex: function (str, areas) {
    return diyform.getIndex(str, areas)
  }, 

  // 清除表单内容
  clearform: function () {
    var diyform = this.data.diyform;
    var new_fdata = {};
    $.each(diyform, function (k, v) {  //lgt 清除表单时保留图片上传功能
      $.each(v, function (key, value) {
        if (value.data_type == 5) {
          diyform.f_data[value.diy_type].count = 0;
          diyform.f_data[value.diy_type].images = [];
          new_fdata[value.diy_type] = diyform.f_data[value.diy_type];
        }
      });
    });
    diyform.f_data = new_fdata;
    this.setData({
      diyform: diyform
    })
  },
  //提交
  submit:function(){
    var $this = this;
    var diyformdata = this.data.diyform;
    if ($this.data.diyform == undefined){
      var diydata ='';
    }else{
      var diydata = $this.data.diyform.f_data;
    }
    
    if (diyformdata!=undefined){
      var verify = diyform.verify(this, diyformdata);
      if (!verify) {
        core.alert('请查看是否有未填写的内容');
        return;
      }
    }

    core.post('groups/order/create_order', {
      id: $this.data.options.id,
      group_option_id: $this.data.options.option_id,
      ladder_id: $this.data.options.ladder_id,
      type: $this.data.options.type,
      heads: $this.data.options.heads,
      teamid: $this.data.options.teamid,
      aid:$this.data.aid,
      message:$this.data.message,
      realname:$this.data.real_name,
      mobile: $this.data.mobile,
      deduct: $this.data.deduct,
      diydata: diydata
      } , function(msg){
        if(msg.error == 1){
          core.alert( msg.message );
          return;
        }
        wx.navigateTo({url: '../pay/index?id=' + msg.orderid +'&teamid='+msg.teamid,});
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var $this = this, address = app.getCache("orderAddress"), shop = app.getCache("orderShop");
    if (address) {
      this.setData({
        'data.address': address,
        aid: address.id
      });
    }

  },
  toggle:function(e){
    var data = core.pdata(e), id = data.id, type = data.type, d = {};
    (id == 0 || typeof id == 'undefined') ? d[type] = 1 : d[type] = 0;
    this.setData(d);
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  message:function(e){
    this.setData({message:e.detail.value});
  },
  realname:function(e){
    this.setData({ real_name: e.detail.value });
  },
  mobile:function(e){
    this.setData({ mobile: e.detail.value });
  },
  dataChange: function (e) {
    var data = this.data.data, id = e.target.id;
    data.deduct = e.detail.value;
    
    var realprice = parseFloat(data.price);
    realprice += data.deduct ? - parseFloat(data.credit.deductprice) : parseFloat(data.credit.deductprice);
    data.price = realprice;
    data.price = $.toFixed(data.price, 2);
    this.setData({
      data: data,
      deduct: e.detail.value
    })
  }
})