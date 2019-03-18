// pages/groups/join/index.js
var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery'), foxui = app.requirejs('foxui');
var times = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    layershow:false,
    chosenum:false,
    options:false,
    optionarr:[],
    selectSpecsarr:[],
    goods_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $this = this;
    var id = options.id
    this.setData( {goods_id:id} );
    core.get('groups.goods.openGroups', {id:id}, function (result) {
      $this.setData({
        data: result.data,
        teams: result.teams,
        ladder: result.ladder
      })
    })
  },
  joinTeam:function(e){
    // app.checkAuth();
    var $this =this;
    var types = core.pdata(e).type;
    var op = core.pdata(e).op;
    $this.setData({
      optionarr: [],
      selectSpecsarr: []
    })
    if(op=='creat'){
      $this.setData({
        op: 'creat'
      })
    }else{
      $this.setData({
        op: ''
      })
    }

      if (types == 'ladder') {
        var id = $this.data.data.id
        core.get('groups.goods.goodsCheck', { id: id, type: "group" }, function (result) {
          if (result.error == 0) {
            $this.setData({
              layershow: true,
              chosenum: true
            })
          } else {
            wx.showToast({
              title: result.message,
              icon: 'none',
              duration: 2000
            });
          }
        })

      } else {
        if ($this.data.data.more_spec == 0) {
          var id = $this.data.data.id
          core.get('groups.goods.goodsCheck', { id: id, type: "group" }, function (result) {
            if (result.error == 0) {
              if (op == 'creat') {
                wx.navigateTo({
                  url: '../confirm/index?type=groups&id=' + id + "&heads=1"
                })

              } else {
                core.get('groups.goods.check_tuan', { id: id, type: "group" }, function (result) {
                  if (result.data.order_num <= 0) {
                    core.alert('暂无拼团');
                    return;
                  }
                  wx.navigateTo({
                    url: '../jointeam/index?id=' + id,
                  })
                });
              }
            } else {
              wx.showToast({
                title: result.message,
                icon: 'none',
                duration: 2000
              });
            }
          })
        } else {
          var id = $this.data.data.id
          core.get('groups.goods.goodsCheck', { id: id, type: "group" }, function (result) {
            if (result.error == 0) {
                core.get('groups.goods.get_spec', { id: id }, function (result) {
                  $this.setData({
                    spec: result.data
                  })
                })
                $this.setData({
                  layershow: true,
                  options: true
                })
              
            } else {
              wx.showToast({
                title: result.message,
                icon: 'none',
                duration: 2000
              });
            }
          })
        }
      }
    
  },
  chosenum:function(e){
    var selectindex = core.pdata(e).index;
    var id = core.pdata(e).goodsid;
    var ladder_id = core.pdata(e).id;
    var ladder_price = core.pdata(e).price
  
    this.setData({
      selectindex: selectindex,
      id:id,
      ladder_id: ladder_id,
      ladder_price: ladder_price
    })
  },
  close:function(){
    var $this = this;
    $this.setData({
      layershow: false,
      chosenum: false,
      options:false
    })
  },
  ladder_buy:function(){
    var $this = this;
    if (!$this.data.ladder_id ){
      core.alert( '请选择拼团人数' );
      return ;
    } 
    if ( this.data.op != 'creat' ){
      core.get('groups.goods.check_tuan', { id: $this.data.goods_id, ladder_id: $this.data.ladder_id }, function (result) {
        if (result.data.ladder_num <= 0) {
          core.alert('暂无拼团');
          return;
        }

        wx.navigateTo({
          url: "../jointeam/index?id=" + $this.data.goods_id + "&ladder_id=" + $this.data.ladder_id,
          success: function () {
            $this.setData({
              layershow: false,
              chosenum: false,
              options: false
            })
          }
        })
      });
    }else{
      wx.navigateTo({
        url: "../confirm/index?id=" + $this.data.goods_id + "&heads=1&type=groups&ladder_id=" + $this.data.ladder_id,
        success: function () {
          $this.setData({
            layershow: false,
            chosenum: false,
            options: false
          })
        }
      })
    }
    this.close();
  },
  //选规格
  specsTap: function (e) {
    times++
    var $this = this
    var specs = $this.data.spec;
    var spec_id = core.pdata(e).spedid, id = core.pdata(e).id, specindex = core.pdata(e).specindex,idx = core.pdata(e).idx;
    // 改颜色
    specs[specindex].item.forEach(function (e,index) {
      if (e.id == id){
        specs[specindex].item[index].status = 'active';
      }else{
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
   
    core.post('groups.goods.get_option', { spec_id: $this.data.optionarr, groups_goods_id: $this.data.goods_id},function(result){
    
      $this.setData({
        optiondata: result.data,
      })
    })
  },
  buy:function(e){
    var $this = this
    var buyop = core.pdata(e).op, goods_id = $this.data.goods_id, optiondata = $this.data.optiondata
    
    if ($this.data.optiondata){
    if (buyop=='creat'){
      if (optiondata.stock>0){
        wx.navigateTo({
          url: "../confirm/index?id=" + goods_id + "&heads=1&type=groups&option_id=" + optiondata.id,
          success: function () {
            $this.setData({
              layershow: false,
              chosenum: false,
              options: false
            })
          }
        })
        
      }else{
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 2000
        });
      }  
    }else{
      if (optiondata.stock > 0){
        core.get('groups.goods.check_tuan', { id: goods_id, type: "group" }, function (result) {
          if (result.data.order_num <= 0) {
            core.alert('暂无拼团');
            return;
          }

          wx.navigateTo({
            url: "../jointeam/index?id=" + goods_id + "&option_id=" + optiondata.id,
            success: function () {
              $this.setData({
                layershow: false,
                chosenum: false,
                options: false
              })
            }
          })
        });
        
        
      }else{
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 2000
        });
      }
    }
    }else{
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
    app.checkAuth();
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
  
  }
})