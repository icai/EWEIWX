// pages/groups/order/imdex.js
var app = getApp();
var core = app.requirejs('core');
var $ = app.requirejs('jquery');
var diyform = app.requirejs('biz/diyform');
var goodspicker = app.requirejs('biz/goodspicker');
var foxui = app.requirejs('foxui');
var order = app.requirejs('biz/group_order');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      type_:'',
      page:1,
      list:[],
      cancel: order.cancelArray,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	var $this = this;
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
    this.setData({
      options: options
    });

    this.get_list();
  },

  get_list:function(e){
    var $this = this;
    if (e){
      if (e.target ){
        if ($this.data.type_ == e.target.dataset.type_) {
          return;
        }
        $this.setData({ type_: e.target.dataset.type_ });
      }
      
      $this.setData({ page: 1 ,list:[]});  
    }
    
    core.get('groups/order', {status:$this.data.type_,page:$this.data.page}, function (result) {
    
      if( result.error == 0 ){
        $this.setData({
          list: $this.data.list.concat(result.list)
        })
        wx.stopPullDownRefresh();
      }
    })
  },

  finish:function(e){
    var $this = this;
    var order_id = e.target.dataset.orderid;
    core.confirm('是否确认收货',function(){
      core.get('groups/order/finish', { id: order_id}, function (result) {
        if (result.error == 0) {
          $this.get_list(true);
        } else {
          core.alert(result.result.message);
        }
      })
    });
  },

  delete_:function(e){
    var $this = this;
    var order_id = e.target.dataset.orderid;
    core.confirm('是否确认删除', function () {
      core.get('groups/order/delete', { id: order_id }, function (result) {
        if (result.error == 0) {
          $this.get_list(true);
        } else {
          core.alert(result.result.message);
        }
      })
    });
  },

  // cancel:function(e){
  //   var $this = this;
  //   var order_id = e.target.dataset.orderid;
  //   core.confirm('是否确认取消', function () {
  //     core.get('groups/order/cancel', { id: order_id }, function (result) {
  //       if (result.error == 0) {
  //         $this.get_list(true);
  //       }else{
  //         core.alert(result.result.message);
  //       }
  //     })
  //   });
  // },
  cancel: function (e) {
    var order_id = e.target.dataset.orderid;
    order.cancel(order_id, e.detail.value, '../order_detail/index?order_id=' + order_id);
  },
  close: function () {
    this.setData({
      code: false,
    })
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
    this.setData({ page: 1,list:[] });
    this.get_list();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function ()
  {
    this.setData({ page: this.data.page + 1 });
    this.get_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  code: function (e) {
    var $this = this, orderid = core.data(e).orderid, verifycode = core.data(e).verifycode;
    core.post('groups/verify/qrcode', { id: orderid, verifycode:verifycode }, function (json) {
      if (json.error == 0) {
        $this.setData({
          code: true,
          qrcode: json.url
        })
      } else {
        core.alert(json.message);
      }
    }, true);
  },
})