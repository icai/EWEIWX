var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery'), foxui = app.requirejs('foxui');
Page({
  data: {
    goods:{},
    mid:'',
  },
  onLoad: function (options) {
    var $this = this;
    core.get('bargain/purchase',options,function(result){
  
      $this.setData({goods:result.goods,mid:result.mid})
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

  }
})