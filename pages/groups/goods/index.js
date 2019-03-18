// pages/groups/goods/index.js

var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery'), foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');
var times= 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
      goods_id:0,
      advHeight: 1
  },
  //商品详情轮播图按照第一张图片显示
  imageLoad: function (e) {
    let h = e.detail.height,
      w = e.detail.width,
      height = Math.floor((750 * h) / w);
    
    if (h == w) {
      this.setData({ advHeight: 750 })
    } else {
      this.setData({ advHeight: height })
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
        iphonexnavbar: 'fui-iphonex-navbar'
      })
    } else {
      $this.setData({
        isIpx: false,
        iphonexnavbar: ''
      })
    }
    var id = options.id
    this.setData({ goods_id:id});
    core.post('groups.goods', {id:id}, function (result) {
      $this.setData({
        data: result.data,
        
        // content: result.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;" ')
      })
      parser.wxParse('wxParseData', 'html', result.data.content, $this, '0')
    })
  },
  singlebuy:function(e){
    var $this = this;
    // 判断是否可以单购
    core.post('groups/goods/goodsCheck', { id:$this.data.goods_id, type: 'single' }, function (msg) {
      if (msg.error == 1){
        core.alert(msg.message);
        return;
      }else{
          // 单规格
          if ($this.data.data.more_spec == 0) {
            wx.navigateTo({
              url: '../confirm/index?id=' + $this.data.goods_id + '&type=single',
            })
          } else {
            // 多规格
            $this.setData({
              layershow: true,
              options: true
            })
            $this.setData({
              optionarr: [],
              selectSpecsarr: []
            })
            var id = $this.data.data.id
            core.get('groups.goods.get_spec', { id: id }, function (result) {
              
              $this.setData({
                spec: result.data
              })
            })

            $this.setData({
              layershow: true,
              options: true
            })
          }
      }
    })
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
  
    core.post('groups.goods.get_option', { spec_id: $this.data.optionarr, groups_goods_id: $this.data.goods_id }, function (result) {
      $this.setData({
        optiondata: result.data,
      })
    })
  },
  buy: function (e) {
    var $this = this
    var buyop = core.pdata(e).op, goods_id = $this.data.goods_id, optiondata = $this.data.optiondata
    if ($this.data.optiondata) {
        if (optiondata.stock > 0) {
          wx.navigateTo({
            url: "../confirm/index?id=" + goods_id + "&option_id=" + optiondata.id +' &type=single',
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
  onShareAppMessage: function () {
    var $this = this;
    var $data = $this.data.data;
  
    return {
      title:$data.title
    }
  },

  check:function(){
    
  }
})