var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery'), foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');
Page({
  data:{
    id:'',
    layer:false,
    goods:{},
    istimeTitle:'',
    timer:0,
    upper_limit: false,
    upper_limitTitle: '',
    act_swi:'',
    error_hint:false,
    error_hint_title:'',
    advHeight: 1
  },

  //商品详情轮播图按照第一张图片显示
  imageLoad: function(e){
    let h = e.detail.height,
        w = e.detail.width,
        height = Math.floor((750*h) / w);
         
    if(h == w){
      this.setData({ advHeight: 750})
    }else{
      this.setData({ advHeight: height})
    }
  },
  onLoad:function(options){
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
    core.get('bargain/get_detail',options,function(ret){
      $this.setData({goods:ret.list});
      $this.setData({ id: ret.list.id,act_swi: ret.list.act_swi });
      parser.wxParse('wxParseData', 'html', ret.list.content, $this, '0');
      $this.countDown(ret.list.start_time, ret.list.end_time, 'istime');
      if (ret.list.isStart == 1){
        clearInterval($this.data.timer);
        var timer = setInterval(function () {
          $this.countDown(ret.list.start_time, ret.list.end_time, 'istime');
        }, 1000);
        $this.setData({ timer: timer });
      }
    });
    wx.setNavigationBarTitle({
      title: '砍价商品详情'//页面标题为路由参数
    })
    
  },
  cutPrice: function () {
    this.setData({
      layer: true
    })
    
  },
  closeLayer: function () {
    this.setData({
      layer: false
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
    var time = [day, hour, minute, second]
    this.setData({
      time: time
    });
    if (type = 'istime') {
      var istimeTitle = '';
      if (timestart > now) {
        istimeTitle = '未开始';
        this.setData({ istime: 0 });
      } else if (timestart <= now && timeend > now) {
        istimeTitle = '剩余时间';
        this.setData({ istime: 1 });
      } else {
        istimeTitle = '活动已经结束，下次早点来~';
        this.setData({ istime: 2 });
      }
      this.setData({ istimeTitle: istimeTitle });
    }
  },
  backhome:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  goJoin: function (){
    app.checkAuth();
    var $this = this;
    var id = $this.data.id;
    core.get('bargain/join', {id:id}, function (result) {
      if (result.error == 1) {
        $this.setData({ error_hint: true, error_hint_title: result.message });
        return;
      } else if (result.error == 0){
        if (result.initiate == 1){
          $this.setData({ upper_limit: true, upper_limitTitle: '您已经发起过一次本商品的砍价活动,是否立即查看？', act_swi:result.bargainid});
          return;
        }
        wx.navigateTo({
          url: '/pages/bargain/bargain?id=' + result.id +'&mid=' + result.mid,
        })
      } 
      
    });
  },
  alreadyHave:function(){
    app.checkAuth();
    var $this = this;
    $this.setData({ upper_limit:true,upper_limitTitle:'您已经发起过一次本商品的砍价活动,是否立即查看？'});
  },
  closeUpper:function(){
    this.setData({ upper_limit: false });
  },
  affirmUpper:function(){
    var $this = this;
    var act_id = $this.data.act_swi;
    wx.navigateTo({
      url: '/pages/bargain/bargain?id='+act_id,
    })
  },
  closeError:function(){
    this.setData({ error_hint:false });
  }
})