// pages/groups/category/index.js
var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery'), foxui = app.requirejs('foxui');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showtab:'do',
    success: '',
    page: 1,
    list: [],
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
    this.get_list();
  },

  get_list: function (e) {
    var $this = this;

    core.get('groups/team', { success: $this.data.success, page: $this.data.page }, function (result) {
     
      if (result.error == 0) {
        $this.setData({
          list: $this.data.list.concat(result.list)
        })
        wx.stopPullDownRefresh();
      }
    })
  },

  tab:function( e ){
    if (this.data.success == e.target.dataset.success ){
      return ;
    }
    this.setData({ success: e.target.dataset.success,page:1,list:[]});
    this.get_list(  );
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
    this.setData({page:1,list:[]});
    this.get_list();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({ page: this.data.page+1 });
    this.get_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  selected: function (e) {
    this.setData({
      showtab: e.currentTarget.dataset.type
    })
  },
})