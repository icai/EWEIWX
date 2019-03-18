// pages/groups/jointeam/index.js
var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery'), foxui = app.requirejs('foxui');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      goods_id:0,
      option_id:0,
      ladder_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $this = this;
    var id = options.id
    var ladder_id = options.ladder_id
    this.setData({ goods_id: options.id,option_id:options.option_id,ladder_id:options.ladder_id});
   
    core.get('groups.goods.fight_groups', { id: id,ladder_id:ladder_id }, function (result) {
      if(result.error == 1 ){
        core.alert( result.message );
        return;
      }
      $this.setData({
        data: result.data,
        other: result.other
      })
      setInterval(function () {
        var other = $this.data.other;
        for (var i in other) {
          var s = other[i].residualtime, h = 0, m = 0
          if (s > 60) {
            m = parseInt(s / 60)
            s = parseInt(s % 60);
            if (m > 60) {
              h = parseInt(m / 60)
              m = parseInt(m / 60)
            }
          }
          if (s < 0) {
            h=0;
            m = 0;
            s = 0;
            $this.data.other[i].status = "hide";
            $this.data.other=[]
          }
          $this.data.other[i].hours = h;
          $this.data.other[i].minite = m;
          $this.data.other[i].second = s;
          $this.data.other[i].residualtime = $this.data.other[i].residualtime-1
        }
        $this.setData({
          other: other
        })
      },1000)
    })
  },

  join:function(){
      
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
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  do_:function(e){
    var $this = this;
    var teamid = e.target.dataset.teamid;
    core.get('groups/order/create_order', {
      id: $this.data.goods_id,
      group_option_id: $this.data.option_id,
      ladder_id: $this.data.ladder_id,
      type: 'groups',
      heads: 0,
      teamid: teamid,
    }, function (msg) {
      if (msg.error == 1) {
        core.alert(msg.message);
        return;
      }

      wx.navigateTo({
        url: '../confirm/index?id=' + $this.data.goods_id + '&heads=0&type=groups&option_id=' + $this.data.option_id + '&teamid=' + teamid + '&ladder_id=' + $this.data.ladder_id,
      })
    });
    
  }
})