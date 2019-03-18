// pages/groups/category/index.js
var app = getApp();
var core = app.requirejs('core');
var $ = app.requirejs('jquery');
var diyform = app.requirejs('biz/diyform');
var goodspicker = app.requirejs('biz/goodspicker');
var foxui = app.requirejs('foxui');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    list: [],
    defaults: {
      keywords: '',
      isrecommand: '',
      ishot: '',
      isnew: '',
      isdiscount: '',
      issendfree: '',
      istime: '',
      cate: '',
      order: '',
      by: 'desc',
      merchid: 0,
    }
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
        iphonexnavbar: 'fui-iphonex-navbar',
        options: options
      })
    } else {
      $this.setData({
        isIpx: false,
        iphonexnavbar: '',
        options: options
      })
    }
    var id = $this.data.options.id || '';
    $this.getList();
  },
  getList:function(){
    var $this = this;
    core.post('groups.list', { category: $this.data.options.id, page: $this.data.page }, function (result) {
      if (result.error == 0) {
        if (result.list.length <= 0) {
          $this.setData({
            res: result,
            empty: true
          })
        } else {
          $this.setData({
            page: $this.data.page + 1,
            res: result,
            list: $this.data.list.concat(result.list),
            empty: false
          })
        }
        
        if (result.list.length < result.pagesize) {
          $this.setData({
            loaded: true
          });
        }
      } else {
        
      }

    })
  },
  onReachBottom: function () {
    
    if (this.data.loaded || this.data.res.list.length == this.data.total) {
      return;
    }
    this.getList();
  },
  bindSearch: function (e) {
    
    var $this = this;
    var keywords = e.detail.value;
    core.get('groups.list', { keyword: keywords }, function (res) {
     
      if (res.list.length <= 0) {
        $this.setData({ empty: true });
      } else {
        $this.setData({ empty: false });
      }
      $this.setData({ list: res.list});
    });
  },
  back:function(){
    wx.navigateBack({
      delta:1
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})