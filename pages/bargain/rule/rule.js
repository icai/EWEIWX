var app = getApp(), core = app.requirejs('core'), $ = app.requirejs('jquery'), foxui = app.requirejs('foxui');
var parser = app.requirejs('wxParse/wxParse');
Page({
  data: {
    list:{},
  },
  onLoad: function (options) {
    var $this = this;
    core.get('bargain/rule',options,function(res){
     
      parser.wxParse('wxParseData', 'html', res.rule.rule, $this, '0');
    });
  }
})