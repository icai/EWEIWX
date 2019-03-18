var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery'), foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');
Page({
  data: {
    label: "/static/images/label.png",
    showtab:'family',
    bargainid:'',
    layer:false,
    cutPrice:'',
    error_hint:false,
    error_hint_title:'',
    list:{},
    bargain:{},
    bargain_set:{},
    istimeTitle:'剩余时间',
    bargain_record:{},
    bargain_actor:{},
    swi:'',
    trade_swi:'',
    myself_swi:'',
    mid:'',
    randomHint:{
      0:'大王，您即将触及我的价格底线，不要放弃继续砍价吧～',
      1:'主人，达到价格底线就可以带我回家啦！等你哦～',
      2:'加把劲，再砍一刀，马上就到底价了哦～',
      3:'砍到底价才能购买哦，邀请小伙伴来帮忙吧！',
      4:'叫上您的小伙伴来砍价，我们的的目标是底价买买买！',
    },
    marked_words:'',
    arrived:'',
    timeout:0,
  },
  onLoad: function (options) {
    app.url(options)
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
    core.get('bargain/bargain',options,function(result){
      if(result.error == 1){
        $this.setData({ upper_limit: true, upper_limitTitle:result.message});
        return;
      }
      if(result.error == 0){
        if (result.unequalMid == 1){
          wx.navigateTo({
            url: '/pages/bargain/bargain?id=' + result.id + '&mid=' + result.mid,
          })
        }
    
        $this.setData({ list: result.list, bargain: result.bargain, bargain_set: result.bargain_set, bargain_record: result.bargain_record, bargain_actor: result.bargain_actor, swi: result.swi, trade_swi: result.trade_swi, myself_swi: result.myself_swi, bargainid: result.list.id, mid: result.mid, arrived: result.arrived, timeout:result.timeout});       
        parser.wxParse('wxParseData', 'html', result.bargain.content, $this, '0');

        if (result.bargain.rule == '' || result.bargain.rule == undefined){
          parser.wxParse('wxParseDataRule', 'html', result.bargain_set.rule, $this, '0');
        }else{
          parser.wxParse('wxParseDataRule', 'html', result.bargain.rule, $this, '0'); 
        }

        $this.countDown(result.bargain.start_time, result.bargain.end_time,'istime');

        clearInterval($this.data.timer);
        var timer = setInterval(function () {
          $this.countDown(result.bargain.start_time, result.bargain.end_time, 'istime');
        }, 1000);
        $this.setData({ timer: timer });
      }
    });
 
    var num = Math.floor(Math.random() * 4);
    var hintwords = $this.data.randomHint[num];
    $this.setData({ marked_words:hintwords});
   
  },
  goodsTab:function(e){ 
    this.setData({
      showtab: e.currentTarget.dataset.tap
    })
  },
  cutPrice: function (){
    app.checkAuth();
    const url = '/pages/message/auth/index';
    var $this = this;
    var bargainid = $this.data.bargainid;
    var ajax = 151;
    var mid = $this.data.mid;
    core.get('bargain/bargain', {id:bargainid,ajax:ajax,mid:mid}, function (result) {
      // 未获取授权首先获取授权
      if (result.error == -1) {
        wx.redirectTo({ url: url});
        return;
      }

      if (result.error == 1) {
        $this.setData({ error_hint: true, error_hint_title: result.message });
        return;
      }
      if(result.error == 0 && result.cutPrice){
        $this.setData({ layer: true, cutPrice: result.cutPrice});
      } else {
        wx.redirectTo({ url: url});
      }
    });
    // this.setData({
    //   layer: true
    // })
  },
  closeLayer:function(){
    this.setData({
      layer: false
    })
    var id = this.data.bargainid;
    var mid = this.data.mid;
    this.onLoad({id:id,mid:mid});
  },
  goBackPrev:function(){
    wx.navigateBack({
      delta: 1
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
  closeError:function(){
    this.setData({ error_hint: false });
  },
  seekHelp:function(){
    this.onShareAppMessage();
  },
  onShareAppMessage: function (res) {
    var $this = this;
    var id = $this.data.bargainid;
    var mid = $this.data.mid;
    return {
      title: '帮砍价',
      path: '/pages/bargain/bargain?id=' + id + '&mid=' + mid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})