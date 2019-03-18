// pages/groups/imdex/index.js
var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery'), foxui = app.requirejs('foxui');
Page({
  onPullDownRefresh: function(){
    var $this = this

    core.get('groups', {}, function (result) {
      if (result.error == 0) {
        $this.setData({
          res: result
        })
        wx.stopPullDownRefresh()
      } 
    })
  },
  data: {
  
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
    core.get('groups', {}, function (result) {
      $this.setData({
        res:result
      })
    })
  },
  advheight:function(e){
    var $this = this;
    var advratio = e.detail.width / e.detail.height;
    $this.setData({
      advheight:750 / advratio
    })
  },
  navigate:function(e){
    var link = core.pdata(e).link
   
    wx.navigateTo({
      url: link,
      fail:function(){
        wx.switchTab({
          url: link,
        })
      }
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
  onReachBottom: function () {
    this.onPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})