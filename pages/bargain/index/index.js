var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery'), foxui = app.requirejs('foxui');
Page({
  data: {
    list:{},
    emptyHint:false,
    label: "/static/images/label.png",
  },
  onLoad: function () {
    var $this = this;
    core.get('bargain/get_list',{},function(ret){
     
      
      $this.setData({list:ret.list});
    });
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

  },
  bindFocus:function(){
    this.setData({
      fromsearch:true
    })
  },
  bindback:function(){
    this.setData({
      fromsearch: false
    })
    this.onLoad();
  },
  bindSearch:function(e){
   
    var $this = this;
    var keywords = e.detail.value;
    core.get('bargain/get_list', {keywords:keywords}, function (ret) {
     
      if (ret.list.length <= 0){
        $this.setData({emptyHint:true});
      }else{
        $this.setData({ emptyHint: false });
      }
      $this.setData({ list: ret.list });
    });
  }
})