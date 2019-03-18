// pages/commission/poster/index.js
var app = getApp();
var core = app.requirejs('core');
var foxui = app.requirejs('foxui');
var touchDot = 0;
var startY = 0;
var time = 0;
var interval = "";
Page({
    data: {
        full: false,
        scrollleft: '',
        margin: '',
        showloading: true,
        accredit: '',
        index: 0,
        errMsg: '',
        check: "/static/images/check.png",

        posterArr: []
    },
    onLoad: function () {
        var $this = this
        wx.getSystemInfo({
            success: function (res) {
                var posterwidth = res.screenWidth;
                var windowHeight = res.windowHeight;
                $this.setData({
                    posterwidth: posterwidth,
                    windowHeight: windowHeight,
                    index: 0
                })
            }
        });

        core.json('commission/poster', {}, function (ret) {
            if(ret.error==0){
                $this.setData({
                    posterArr: ret.poster || [],
                    posterboxwidth: $this.data.posterwidth * ret.poster.length
                });
                $this.getImage(0);
            }
            else if(ret.error==70000){
                wx.redirectTo({
                    url:'../register/index'
                });
                return;
            }
            else if (ret.error == 70001){
                wx.redirectTo({
                    url:'/pages/member/info/index'
                });
                return;
            }
            else{
                foxui.toast($this, ret.message);
            }
        });
    },

    onshow: function () {
        this.setData({index: 0});
    },

    // 点击保存图片
    savePicture: function () {
        var $this = this;
        wx.getSetting({
            success: function (res) {
                var accredit = res.authSetting['scope.writePhotosAlbum']
                if (accredit) {
                    wx.showLoading({
                        title: '图片下载中...',
                    })
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 1000);                

                    wx.downloadFile({
                        url: $this.data.posterArr[$this.data.index].poster,
                        success: function (res) {
                            wx.saveImageToPhotosAlbum({
                                filePath: res.tempFilePath,
                                success: function (ret) {
                                    foxui.toast($this, "保存图片成功");
                                },
                                fail: function (ret) {
                                    $this.setData({errMsg: ret.errMsg})
                                    foxui.toast($this, "保存图片失败");
                                }
                            })
                        }
                    })
                } else {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        fail: function () {
                            /*获取权限时点击了拒绝以后的弹窗*/
                            wx.showModal({
                                title: '警告',
                                content: '您点击了拒绝授权，将无法正常使用保存图片或视频的功能体验，请删除小程序重新进入。'
                            })
                        }
                    })
                }
            }
        })
    },

    // 获取图片
    getImage: function (index) {
        var arr = this.data.posterArr, $this = this;
        setTimeout(function () {
            if ($this.data.full == true) {
                if (arr[index].poster) {
                    return;
                }
                $this.requestImg(index);
            } else {
                if (arr[index].thumb) {
                    return;
                }
                $this.requestImg(index);
            }
        }, 10)
    },

    // 请求 获取图片
    requestImg: function (index) {
        var arr = this.data.posterArr, $this = this;
        $this.setData({
            showloading: true
        });
        core.json('commission/poster/getimage', {
            id: arr[index].id
        }, function (ret) {
            
            if(ret.error == 0){
                arr[index].thumb = ret.thumb;
                arr[index].poster = ret.poster;
                $this.setData({
                    posterArr: arr
                });
            }else{
                foxui.toast($this, "保存图片失败");
            }

        });
    },

    // 触摸开始事件
    touchStart: function (e) {
        touchDot = e.touches[0].pageX;
        startY = e.touches[0].pageY;
        interval = setInterval(function () {
            time++;
        }, 1000);
    },

    // 触摸移动事件
    touchMove: function (e) {
        var touchMove = e.touches[0].pageX;
        var moveY = e.touches[0].pageY;
        this.setData({
          moveY: moveY,
          touchMove: touchMove
        })
        
        // 向左滑动
        if (touchMove - touchDot <= -60 && time < 10) {
            this.setData({
                diff: touchMove - touchDot,
                touchMove: touchMove
            })
        }
        // 向右滑动
        if (touchMove - touchDot >= 60 && time < 10) {
            this.setData({
                diff: touchMove - touchDot
            })
        }
    },

    // 触摸结束事件
    touchEnd: function (e) {
        var index = this.data.index
        var endY = Math.abs(this.data.moveY - startY)
        var endX = Math.abs(this.data.touchMove - touchDot)
        var differ = endX - endY
        clearInterval(interval);
        time = 0;
        if (this.data.diff > 40 && differ>0) {
            if (index == 0) {
                index = 0
            } else {
                index--
            }
        } else if (this.data.diff < -40 && differ > 0) {
            if (index == this.data.posterArr.length-1) {
                index = this.data.posterArr.length-1
            } else {
                index++
            }
        }
        var left = index * this.data.posterwidth;
        this.setData({
            left: left,
            diff: 0,
            index: index
        })
        this.getImage(index);
    },

    pre: function () {
        var index = this.data.index
        if (index == 0) {
            index = 0
        } else {
            index--
        }
        var left = index * this.data.posterwidth;
        this.setData({
            left: left,
            index: index
        })
        this.getImage(index);
    },

    next: function () {
        var index = this.data.index;
        if (index == this.data.posterArr.length-1) {
            index = this.data.posterArr.length-1
        } else {
            index++
        }
        var left = index * this.data.posterwidth;
        this.setData({
            left: left,
            index: index
        })
        this.getImage(index);
    },

    loadImg: function (e) {
        var arr = this.data.posterArr,
            lgimgheight = e.detail.height,
            index = core.pdata(e).index,
            poster = core.pdata(e).poster;

        if(poster){
            arr[index].posterLoaded = true;
        }else{
            arr[index].thumbLoaded = true;
        }
        this.setData({
            lgimgheight: lgimgheight,
            showloading: false,
            posterArr: arr
        })
    },

    enlarge: function () {
        this.setData({
            full: true
        })
        this.getImage(this.data.index);
    },

    ensmall: function () {
        this.setData({
            full: false
        })
        this.getImage(this.data.index);
    }
})  