// pages/groups/imdex/index.js
var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery'), foxui = app.requirejs('foxui');
Page({
  data: {
    show: false
  },
  onPullDownRefresh: function () {
    wx.startPullDownRefresh()
  },
  /**
   * 生命周期函数--监听页面加载
   */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onLoad: function () {
    var $this = this;
    setTimeout(function () {
      $this.onPullDownRefresh()
    }, 300)
    wx.reLaunch({
      url: '/pages/bargain/index/index',
    })
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
    wx.showTabBar({})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.showTabBar({})
  },

  onReachBottom: function () {
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})