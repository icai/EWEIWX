/**
 *
 * index.js
 *
 * @create 2017-01-03
 * @author 咖啡
 *
 * 
 */
var app = getApp();
var core = app.requirejs('core');
var parser = app.requirejs('wxParse/wxParse');
var diypage = app.requirejs('biz/diypage');
var diyform = app.requirejs('biz/diyform');
var goodspicker = app.requirejs('biz/goodspicker');
var foxui = app.requirejs('foxui');
var $ = app.requirejs('jquery');
Page({
  onPullDownRefresh: function () {
    var $this = this
    diypage.get(this, 'home', function (res) {
      $this.getDiypage(res)
      if (res.error == 0) {
        wx.stopPullDownRefresh()
      }
    })

  },
  data: {
    imgUrls: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1509963648306&di=1194f5980cccf9e5ad558dfb18e895ab&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F9c16fdfaaf51f3de87bbdad39ceef01f3a29797f.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1509963737453&di=b1472a710a2c9ba30808fd6823b16feb&imgtype=0&src=http%3A%2F%2Fwww.qqzhi.com%2Fwenwen%2Fuploads%2Fpic.wenwen.soso.com%2Fp%2F20160830%2F20160830220016-586751007.jpg',
      'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3004162400,3684436606&fm=11&gp=0.jpg'
    ],
    indicatorDotss: true,
    autoplays: true,
    intervals: 2000,
    durations: 500,
    circulars: true,
    adveradmin: true,
    current: 0, //商品组翻页 
    clock: '',
    /*广告结束*/
    diypage: 'true',
    route: 'home',
    icons: app.requirejs('icons'),
    shop: {},
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    /* 店铺推荐列表 */
    storeRecommand: [],
    total: 1,
    page: 1,
    loaded: false,
    loading: true,
    /*滚动*/
    indicatorDotsHot: false,
    autoplayHot: true,
    intervalHot: 5000,
    durationHOt: 1000,
    circularHot: true,
    hotimg: "/static/images/hotdot.jpg",
    notification: "/static/images/notification.png",
    saleout1: "/static/images/saleout-1.png",
    saleout2: "/static/images/saleout-2.png",
    saleout3: "/static/images/saleout-3.png",
    play: "/static/images/video_play.png",
    mute: "/static/images/icon/mute.png",
    voice: "/static/images/icon/voice.png",
    // 购物车
    specs: [],
    options: [],
    diyform: {},
    specsTitle: '',
    total: 1,
    active: '',
    slider: '',
    tempname: '',
    buyType: '',
    areas: [],
    closeBtn: false,
    soundpic: true,

    modelShow: false,
    limits: true,
    result: {},
    showcoupon: false,
    showcoupontips: false,
    topmenu: {},
    topmenuDataType: '',
    tabbarData: {},
    tabbarDataType: '',
    istopmenu: false,
    //秒杀组
    seckillinfo: {},
    timer: 0,
    lasttime: 0,
    hour: '-',
    min: '-',
    sec: '-',
  },

  /* 获取首页信息 */
  getShop: function () {
    var $this = this;
    core.get('shop/get_shopindex', {}, function (result) {
      parser.wxParse('wxParseData', 'html', result.copyright, $this, '5');
      $this.setData({ shop: result });
    });
  },
  /*加载推荐商品*/
  onReachBottom: function () {
    if (this.data.loaded || this.data.storeRecommand.length == this.data.total) {
      return;
    }
    this.getRecommand();
  },
  //店铺推荐
  getRecommand: function () {
    var $this = this;
    if ($this.data.diypage == 'true') {
      return
    }
    core.get('shop/get_recommand', { page: $this.data.page }, function (result) {
      var data = { loading: false, total: result.total };
      $this.setData({
        loading: false,
        total: result.total,
        show: true
      });
      if (!result.list) {
        result.list = [];
      }
      if (result.list.length > 0) {
        $this.setData({
          storeRecommand: $this.data.storeRecommand.concat(result.list),
          page: result.page + 1
        });
        if (result.list.length < result.pagesize) {
          data.loaded = true
        }
      }

    });
  },
  onLoad: function (options) {
    // if (app.globalDataClose.flag) {//如果flag为true，退出 
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // } 

    options = options || {};
    var $this = this;
    $this.setData({ imgUrl: app.globalData.approot });

    core.get('black', {}, function (res) {
      if (res.isblack) {
        wx.showModal({
          title: '无法访问',
          content: '您在商城的黑名单中，无权访问！',
          success: function (res) {
            if (res.confirm) {
              $this.close()
            }
            if (res.cancel) {
              $this.close()
            }
          }
        })
      }
    });

    // 处理扫码scene
    var scene = decodeURIComponent(options.scene);
    if (!options.id && scene) {
      var sceneObj = core.str2Obj(scene);
      options.id = sceneObj.id;
      if (sceneObj.mid) {
        options.mid = sceneObj.mid;
        app.setCache('usermid', sceneObj)
      }
    }
    setTimeout(function () {
      $this.setData({ areas: app.getCache("cacheset").areas });
    }, 3000)
    app.url(options);

    diypage.get(this, 'home', function (res) {
      $this.getDiypage(res)
      /*启动广告*/
      if ($this.data.startadv == undefined || $this.data.startadv == '') {
        return
      }
      if ($this.data.startadv.status == 0 || $this.data.startadv == '') {
        wx.getSetting({
          success: function (res) {
            var limits = res.authSetting['scope.userInfo'];
            if (limits) {
              $this.get_nopayorder();
              return
            }
          }
        })
      }

      var params = $this.data.startadv.params;
      if (params.style == 'default') {
        var timer = params.autoclose;
        function count_down(that) {
          $this.setData({ clock: timer });
          if (timer <= 0) {
            $this.setData({ adveradmin: false });
            return;
          }
          setTimeout(function () {
            timer -= 1;
            count_down(that);
          }, 1000)
        }
        count_down($this);
      }

      if (params.showtype == 1) {
        var showtime = params.showtime;
        var countdown = showtime * 1000 * 60;
        var startadvtime = app.getCache('startadvtime');
        var nowtime = + new Date();
        var adveradmin = true;
        $this.setData({ adveradmin: true })
        if (startadvtime) {
          if ((nowtime - startadvtime) < countdown) {
            adveradmin = false;
          }
        }
        $this.setData({ adveradmin: adveradmin });
        if (adveradmin) {
          app.setCache('startadvtime', nowtime);
        }
      }
      var advstatus = $this.data.startadv.status;

    });
    $this.setData({
      cover: true,
      showvideo: false
    });
    wx.getSystemInfo({
      success: function (res) {
        var swiperheight = res.windowWidth / 1.7
        $this.setData({
          swiperheight: swiperheight
        })
      }
    });
    //获取未支付订单信息
    //$this.get_nopayorder();
  },

  onHide: function () {
    this.setData({ adveradmin: false, unpaid: false });
  },

  onShow: function () {
    var $this = this;
    var res = wx.getSystemInfoSync()
    var sysset = app.getCache('sysset');
    $this.getShop();
    $this.getRecommand();
    $this.get_hasnewcoupon();
    $this.get_cpinfos();
    wx.getSetting({
      success: function (res) {
        var limits = res.authSetting['scope.userInfo'];
        $this.setData({ limits: limits })
      }
    })

    var pagetitle = sysset.shopname || '商城首页';
    if ($this.data.pages) {
      if ($this.data.pages.title != '') {
        pagetitle = $this.data.diytitle;
      }
    }
    wx.setNavigationBarTitle({
      title: pagetitle
    });
    if ($this.data.pages) {
      wx.setNavigationBarColor({
        frontColor: $this.data.pages.titlebarcolor,
        backgroundColor: $this.data.pages.titlebarbg
      });
    }
    $this.setData({
      screenWidth: res.windowWidth
    });

  },
  goodsicon: function (e) {
    this.setData({
      iconheight: e.detail.height,
      iconwidth: e.detail.width
    })
  },
  getDiypage: function (res) {
    var $this = this;
    $.each(res.diypage.items, function (id, item) {
      if (item.id == 'topmenu') {
        $this.setData({ topmenu: item });
        if (item.data[0] == undefined) {
          var linkurl = '';
        } else {
          var linkurl = item.data[0].linkurl;
          core.get('diypage/getInfo', { dataurl: linkurl }, function (ret) {
            item.data[0].data = ret.goods.list;
          });
        }

      }

      if (item.id == 'seckillgroup') {
        var data = {};
        data.status = item.data.status;
        data.endtime = item.data.endtime;
        data.starttime = item.data.starttime;
        $this.initSeckill(data);
      }
    });
  },
  onShareAppMessage: function () {
    var url = null;
    var title = null;
    if (this.data.diytitle) {
      url = '/pages/index/index'
      title = this.data.diytitle
    }
    return core.onShareAppMessage(url, title);
  },
  imagesHeight: function (e) {
    var width = e.detail.width, height = e.detail.height, type = e.target.dataset.type, $this = this;
    wx.getSystemInfo({
      success: function (res) {
        $this.data.result[type] = res.windowWidth / width * height;
        if (!$this.data[type] || ($this.data[type] && result[type] < $this.data[type])) {
          $this.setData({ result: $this.data.result });
        }
      }
    });
  },
  bindInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  t1: function (e) {
    diypage.fixedsearch(this, e);
  },
  startplay: function (e) {
    var cover = e.target.dataset.cover;
    this.setData({
      cover: cover,
      showvideo: true
    });
    this.videoContext = wx.createVideoContext('Video');
    this.videoContext.play()
  },
  /* 隐藏未付订单 */
  unpaidcolse: function (e) {
    var unpaid = '';
    if (e.target.dataset.type == 'open') {
      unpaid = true
    } else {
      unpaid = false
    }
    this.setData({
      unpaid: unpaid
    })
  },
  /* 关闭未付订单 */
  unpaidcolse2: function (e) {
    this.setData({
      unpaidhide: true
    })
  },
  //
  get_nopayorder: function () {
    var $this = this;
    core.get('shop/get_nopayorder', {}, function (result) {
      if (result.hasinfo == 1) {
        $this.setData({
          nopaygoods: result.goods,
          nopaygoodstotal: result.goodstotal,
          nopayorder: result.order,
          unpaid: true
        });
      }
    });
  },

  //是否有新的优惠券
  get_hasnewcoupon: function () {
    var $this = this;
    core.get('shop/get_hasnewcoupon', {}, function (result) {
      if (result.hasnewcoupon == 1) {
        $this.setData({ showcoupontips: true });
      }
    });
  },
  //是否有新人优惠券
  get_cpinfos: function () {
    var $this = this;
    core.get('shop/get_cpinfos', {}, function (result) {
      if (result.hascpinfos == 1) {
        $this.setData({ showcoupon: true, cpinfos: result.cpinfos, });
      }
    });
  },
  /*关闭广告*/
  adverclose: function () {
    this.setData({ adveradmin: false })
    this.get_nopayorder();
  },
  /*广告点击跳转链接*/
  indexChangebtn: function (e) {
    var urls = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: urls,
      fail: function () {
        wx.switchTab({
          url: urls
        })
      }
    })
  },
  /* 隐藏未付订单 */
  unpaidcolse: function (e) {
    var unpaid = '';
    if (e.target.dataset.type == 'open') {
      unpaid = true
    } else {
      unpaid = false
    }
    this.setData({
      unpaid: unpaid
    })
  },

  /* 关闭未付订单 */
  unpaidcolse2: function (e) {
    this.setData({
      unpaidhide: true
    })
  },
  // 购买picker
  selectPicker: function (e) {
    app.checkAuth();
    var $this = this;
    wx.getSetting({
      success: function (res) {
        var limits = res.authSetting['scope.userInfo'];
        if (limits) {
          var goodslist = 'goodslist';
          goodspicker.selectpicker(e, $this, goodslist)
          $this.setData({
            cover: '',
            showvideo: false
          });
        } else {
          // $this.setData({modelShow: true})
          return
        }
      }
    })
  },
  // 选赠品
  chooseGift(e) {
    goodspicker.chooseGift(e, this)
  },
  // 选规格
  specsTap: function (event) {
    var $this = this
    goodspicker.specsTap(event, $this)
  },
  //关闭pickerpicker
  emptyActive: function () {
    this.setData({
      active: '', slider: 'out', tempname: '', specsTitle: ''
    });
  },
  // 立即购买
  buyNow: function (event) {
    var $this = this
    goodspicker.buyNow(event, $this)
  },
  //加入购物车
  getCart: function (event) {
    var $this = this
    goodspicker.getCart(event, $this)
  },
  select: function () {
    var $this = this
    goodspicker.select($this)
  },
  //数量输入绑定事件
  inputNumber: function (e) {
    var $this = this
    goodspicker.inputNumber(e, $this)
  },
  number: function (e) {
    var $this = this
    goodspicker.number(e, $this)
  },
  onChange: function (e) {
    return diyform.onChange(this, e)
  },
  DiyFormHandler: function (e) {
    return diyform.DiyFormHandler(this, e)
  },
  selectArea: function (e) {
    return diyform.selectArea(this, e)
  },
  bindChange: function (e) {
    return diyform.bindChange(this, e)
  },
  onCancel: function (e) {
    return diyform.onCancel(this, e)
  },
  onConfirm: function (e) {
    return diyform.onConfirm(this, e)
  },
  getIndex: function (str, areas) {
    return diyform.getIndex(str, areas)
  },
  changevoice: function () {
    if (this.data.sound) {
      this.setData({
        sound: false,
        soundpic: true
      })
    } else {
      this.setData({
        sound: true,
        soundpic: false
      })
    }
  },
  phone: function () {
    var phoneNumber = this.data.phonenumber + ''
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },
  /*用户授权-取消*/
  cancelclick: function () {
    this.setData({ modelShow: false })
  },
  /*用户授权-去设置*/
  confirmclick: function () {
    this.setData({ modelShow: false })
    wx.openSetting({
      success: function (res) { }
    })
  },
  navigate: function (e) {
    var url = e.currentTarget.dataset.url
    var phone = e.currentTarget.dataset.phone
    var appid = e.currentTarget.dataset.appid
    var appurl = e.currentTarget.dataset.appurl
    if (url) {
      wx.navigateTo({
        url: url,
        fail: function () {
          wx.switchTab({
            url: url,
          })
        }
      })
    }
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      })
    }
    if (appid) {
      wx.navigateToMiniProgram({
        appId: appid,
        path: appurl
      })
    }
  },
  // 新人优惠券弹层关闭
  closecoupon: function () {
    this.setData({ showcoupon: false })
  },

  // 顶部新优惠券提示条关闭
  closecoupontips: function () {
    this.setData({ showcoupontips: false })
  },
  // 顶部菜单切换
  tabtopmenu: function (e) {

    var $this = this,
      diypages = $this.data.diypages,
      list = diypages.items,
      id = e.currentTarget.dataset.id,
      dataurl = e.currentTarget.dataset.url,
      type = e.currentTarget.dataset.type,
      topmenu = $this.data.topmenu,
      topmenuindex = e.currentTarget.dataset.index;
    $this.setData({ topmenuindex: topmenuindex })
    if (e.currentTarget.id == 'm0' && dataurl == '') {
      core.get('diypage', { type: 'home' }, function (result) {
        var diypage = result.diypage;
        $.each(diypage.items, function (id, item) {
          if (item.id == 'topmenu') {
            item.status = type
          }
        });
        if (result.error == 0) {
          $this.setData({ diypages: result.diypage })
        }
      });
    }
    if (dataurl == '' || dataurl == undefined) {
      return;
    }
    if (dataurl.indexOf('pages') == 1) {
      var index = dataurl.lastIndexOf("=");
      var pageid = dataurl.substring(index + 1, dataurl.length);
      core.get('diypage', { id: pageid }, function (result) {
        if (result.error == 0) {
          var arr = [];
          for (var i in result.diypage.items) {
            arr.push(result.diypage.items[i]); //属性
          }
          arr.unshift(topmenu);
          var obj = new Object();
          for (var x in arr) {
            obj[x] = arr[x];
            if (arr[x].id == 'topmenu') {
              arr[x].status = type
            }
          }
          result.diypage.items = obj;
          $this.setData({ diypages: result.diypage, topmenuDataType: '' })
        }
      });
    } else {
      core.get('diypage/getInfo', { dataurl: dataurl }, function (ret) {
        var topmenu = $this.data.topmenu;
        core.get('diypage', { type: 'home' }, function (result) {
          var diypage = result.diypage;
          $.each(diypage.items, function (id, item) {
            if (item.id == 'topmenu') {
              item.status = type
              for (var i in item.data) {
                if (i == type) {
                  item.data[i]['data'] = ret.goods.list;
                  if (ret.goods.list.length <= 8) {
                    item.data[i]['showmore'] = true
                  }
                }
              }
            }
          });
          if (result.error == 0) {
            $this.setData({ diypages: result.diypage, topmenuDataType: ret.type })
          }
        });
      });
    }
    $this.setData({ diypages: diypages })
  },
  // 选项卡切换
  tabwidget: function (e) {
    var $this = this,
      diypages = $this.data.diypages,
      list = diypages.items,
      id = e.currentTarget.dataset.id,
      dataurl = e.currentTarget.dataset.url,
      type = e.currentTarget.dataset.type;

    if (dataurl == '' || dataurl == undefined) {
      return;
    }

    core.get('diypage/getInfo', { dataurl: dataurl }, function (ret) {
      for (var i in diypages.items) {
        if (i == id) {
          diypages.items[i].data[type].data = ret.goods.list;
          diypages.items[i].data[type].type = ret.type;
          diypages.items[i].type = ret.type;
          diypages.items[i].status = type;
          if (ret.goods.list.length <= 8) {
            diypages.items[i].data[type].showmore = true;
          }
          // $this.data.diypages.items[i].data[type].data = ret.goods.list;
          var obj = "diypages.items." + i + ".data[" + type + "].data";
          $this.setData({ diypages: diypages })
        }
      }
      // $this.setData({ tabbarData: ret.goods, tabbarDataType:ret.type})
    });
  },
  getstoremore: function (e) {
    var $this = this;
    var itemid = e.currentTarget.dataset.id;
    var diypages = $this.data.diypages;
    $.each(diypages.items, function (id, item) {
      if (id == itemid) {
        if (item.status == undefined || item.status == '') {
          if (item.data[0].linkurl.indexOf('stores') != -1) {
            var paramsType = 'stores';
          } else {
            var paramsType = 'goods';
          }
          var dataurl = item.data[0].linkurl;
          var num = item.data[0].data.length;
          core.get('diypage/getInfo', { dataurl: dataurl, num: num, paramsType: paramsType }, function (ret) {
            item.data[0].data = ret.goods.list;

            if (item.data[0].data.length == ret.goods.count) {
              item.data[0].showmore = true;
            }
            $this.setData({ diypages: diypages })
          });
        } else {
          if (item.data[item.status].linkurl.indexOf('stores') != -1) {
            var paramsType = 'stores';
          } else {
            var paramsType = 'goods';
          }
          var dataurl = item.data[item.status].linkurl;
          var num = item.data[item.status].data.length;
          core.get('diypage/getInfo', { dataurl: dataurl, num: num, paramsType: paramsType }, function (ret) {
            item.data[item.status].data = ret.goods.list;

            if (item.data[item.status].data.length == ret.goods.count) {
              item.data[item.status].showmore = true;
            }
            $this.setData({ diypages: diypages })
          });
        }
      }
    })

  },
  close: function () {
    app.globalData.flag = true;
    wx.reLaunch({
      url: '../index/index',
    })
  },
  //秒杀时间初始化
  initSeckill: function (seckillinfo) {
    var $this = this;
    var status = parseInt(seckillinfo.status);
    var starttime = seckillinfo.starttime;
    var endtime = seckillinfo.endtime;
    if (status != -1) {
      var lasttime = 0;
      var timer = 0;
      var approot = app.globalData.approot;
      wx.request({
        url: approot + 'map.json',
        success: function (x) {
          var currenttime = new Date(x.header.Date) / 1000;
          if (status == 0) {
            lasttime = endtime - currenttime;
          } else {
            lasttime = starttime - currenttime;
          }
          $this.setData({ lasttime: lasttime });
          clearInterval($this.data.timer);
          $this.setTimer(seckillinfo);
          timer = $this.setTimerInterval(seckillinfo);

          $this.setData({ timer: timer });
        }
      })
    }

  },
  setTimer: function (seckillinfo) {
    var $this = this;
    var lasttime = 0;
    //每十秒请求一次服务器，获取时间
    if (seckillinfo.status != -1) {
      if (parseInt($this.data.lasttime) % 10 == 0) {
        var approot = app.globalData.approot;
        wx.request({
          url: approot + 'map.json',
          success: function (x) {
            var currenttime = new Date(x.header.Date) / 1000;
            if (seckillinfo.status == 0) {
              lasttime = seckillinfo.endtime - currenttime;
            } else {
              lasttime = seckillinfo.starttime - currenttime;
            }
            $this.setData({ lasttime: lasttime });
          }
        })
      }
    }

    lasttime = parseInt($this.data.lasttime) - 1;
    var times = $this.formatSeconds(lasttime);
    $this.setData({ lasttime: lasttime, hour: times.hour, min: times.min, sec: times.sec });
    if (lasttime <= 0) {
      $this.onLoad();
    }
  },
  setTimerInterval: function (seckillinfo) {
    var $this = this;
    return setInterval(function () {
      $this.setTimer(seckillinfo);
    }, 1000);
  },
  formatSeconds: function (value) {
    var theTime = parseInt(value);
    var theTime1 = 0;
    var theTime2 = 0;
    if (theTime > 60) {
      theTime1 = parseInt(theTime / 60);
      theTime = parseInt(theTime % 60);
      if (theTime1 > 60) {
        theTime2 = parseInt(theTime1 / 60);
        theTime1 = parseInt(theTime1 % 60)
      }
    }
    return {
      'hour': theTime2 < 10 ? '0' + theTime2 : theTime2,
      'min': theTime1 < 10 ? '0' + theTime1 : theTime1,
      'sec': theTime < 10 ? '0' + theTime : theTime
    }
  },
  // 店铺装修商品组件
  cutGoods: function (e) {
    var $this = this,
      type = e.currentTarget.dataset.type,
      num = e.currentTarget.dataset.num,
      id = e.currentTarget.dataset.id,
      diypages = $this.data.diypages;
    for (var i in diypages.items) {
      if (i == id) {
        var current = diypages.items[i].current || 0;
        if (type == 'advance') {
          if (current < num - 1) {
            diypages.items[i].current = current + 1;
            $this.setData({ diypages: diypages })
          } else {
            diypages.items[i].current = 0;
            $this.setData({ diypages: diypages })
          }
        } else {
          if (current > 0) {
            diypages.items[i].current = current - 1;
            $this.setData({ diypages: diypages })
          } else {
            diypages.items[i].current = num - 1;
            $this.setData({ diypages: diypages })
          }
        }
      }
    }

  }
});
