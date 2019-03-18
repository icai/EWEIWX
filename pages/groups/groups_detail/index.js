// pages/groups/groups_detail/index.js
var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery'), foxui = app.requirejs('foxui');
var times = 0
var parser = app.requirejs('wxParse/wxParse');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showtab:'groups',
    count_down:true,
    time:'',
    share:1,
    options:'',
    show:false
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
        iphonexnavbar:''
      })
    }

    this.setData({ teamid: options.teamid});
    this.get_details(options.teamid );
  },

  get_details:function(teamid){
    var $this = this;
    core.get('groups/team/details', { teamid: teamid }, function (result) {
      if (result.error == 0) {
        result.data.goods.content = result.data.goods.content.replace(/data-lazy/g, "src")

        $this.setData({
          data: result.data,
        })
        parser.wxParse('wxParseData', 'html', result.data.goods.content, $this, '0')
      }
      if (result.data.tuan_first_order.success == 0) {
        if (result.data.lasttime2 <= 0) {
          $this.setData({ count_down: false });
          return;
        }
        clearInterval($this.data.timer);
        if (result.data.tuan_first_order.success == 0 ){
          var timer = setInterval(function () {
            $this.countDown(result.data.tuan_first_order.createtime, result.data.tuan_first_order.endtime);
          }, 1000);
        }
        $this.setData({ timer: timer });
      }

      
    })
  },

  /*倒计时js start
  timestart----开始时间
  timeend----结束时间
  type-------类型
  */
  countDown: function (timestart, timeend, type) {
    var now = parseInt(Date.now() / 1000);
    var endDate = timestart > now ? timestart : timeend;
    var leftTime = endDate - now;
    var leftsecond = parseInt(leftTime);
    var day = Math.floor(leftsecond / (60 * 60 * 24));
    var hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600);
    var minute = Math.floor((leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60);
    var second = Math.floor(leftsecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
    if (day == 0 && hour == 0 && minute == 0 && second == 0 ){
      this.get_details(this.data.teamid );
    }
    var time = [day, hour, minute, second]
    this.setData({
      time: time
    });
  },
  tuxedobuy: function (e) {
    app.checkAuth();
    var $this = this;
      
    var id = $this.data.data.goods.id


    if( $this.data.data.goods.more_spec == 0 ){
      if ($this.data.data.goods.stock > 0) {
        core.get('groups/order/create_order', {
          id: id,
          ladder_id: $this.data.data.tuan_first_order.ladder_id,
          type: 'groups',
          heads: 0,
          teamid: $this.data.teamid,
        }, function (msg) {
          if (msg.error == 1) {
            core.alert(msg.message);
            return;
          }
          // 用户不存在则跳转
          if (msg.error == -1) {
            wx.redirectTo({url: '/pages/message/auth/index'});
            return;
          }
          wx.navigateTo({
            url: "../confirm/index?id=" + id + "&heads=0&type=groups&teamid="+$this.data.teamid+"&ladder_id="+$this.data.data.tuan_first_order.ladder_id,
            success: function () {
              $this.setData({
                layershow: false,
                chosenum: false,
                options: false
              })
            }
          })
            
        });
        

      } else {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 2000
        });
      }
    
  
    }else{
  
      core.get('groups.goods.get_spec', { id: id }, function (result) {
        $this.setData({
          spec: result.data
        })
      })
  
      $this.setData({
        layershow: true,
        options: true
      })
      $this.setData({
        optionarr: [],
        selectSpecsarr: []
      })
      if ($this.data.data.goods.stock > 0) {
        wx.navigateTo({
          url: "../confirm/index?id=" + goods_id + "&type=groups&teamid="+$this.data.teamid,
          success: function () {
            $this.setData({
              layershow: false,
              chosenum: false,
              options: false
            })
          }
        })

      } else {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 2000
        });
      }

      $this.setData({
        layershow: true,
        options: true
      })
    }
      

  },
  close: function () {
    var $this = this;
    $this.setData({
      layershow: false,
      options: false
    })
  },
  specsTap: function (e) {
    times++
    var $this = this
    var specs = $this.data.spec;
    var spec_id = core.pdata(e).spedid, id = core.pdata(e).id, specindex = core.pdata(e).specindex, idx = core.pdata(e).idx;
    // 改颜色
    specs[specindex].item.forEach(function (e, index) {
      if (e.id == id) {
        specs[specindex].item[index].status = 'active';
      } else {
        specs[specindex].item[index].status = '';
      }
    });
    $this.setData({
      spec: specs
    })
    // 存id
    var optionarr = $this.data.optionarr
    // 规格下标数组
    var selectSpecsarr = $this.data.selectSpecsarr;
    if (times == 1) {
      optionarr.push(id);
      selectSpecsarr.push(spec_id);
    } else {
      if (selectSpecsarr.indexOf(spec_id) > -1) {
        optionarr.splice(specindex, 1, id);
      } else {
        // 不同规格添加
        optionarr.push(id);
        selectSpecsarr.push(spec_id);
      }
    }
    $this.data.optionarr = optionarr;
    $this.data.selectSpecsarr = selectSpecsarr
  
    core.post('groups.goods.get_option', { spec_id: $this.data.optionarr, groups_goods_id: $this.data.data.goods.id }, function (result) {
      $this.setData({
        optiondata: result.data,
      })
    })
  },
  buy: function (e) {
    var $this = this
    var buyop = core.pdata(e).op, goods_id = $this.data.data.goods.id, optiondata = $this.data.optiondata
    if ($this.data.optiondata) {
      if (optiondata.stock > 0) {
        wx.navigateTo({
          url: "../confirm/index?id=" + goods_id + "&type=groups&option_id=" + optiondata.id + ' &teamid='+$this.data.teamid,
          success: function () {
            $this.setData({
              layershow: false,
              chosenum: false,
              options: false
            })
          }
        })

      } else {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 2000
        });
      }
    } else {
      wx.showToast({
        title: '请选择规格',
        icon: 'none',
        duration: 2000
      });
    }

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
  onShareAppMessage: function (res) {
    var $this = this;
    return {
      title:$this.data.data.shopshare.title,
      path: '../groups_detail/index?teamid=' + $this.data.data.tuan_first_order.teamid ,
      imageUrl:$this.data.data.shopshare.imgUrl
    }
   
  }
  ,
  goodsTab:function(e){
    this.setData({ showtab: e.target.dataset.tap});
  }
})