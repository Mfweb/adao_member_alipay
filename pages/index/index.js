const app = getApp();
const http = require('../../utils/http.js');
var WxParse = require('../../wxParse/wxParse.js');
const pageTitles = ['登录', '注册', '找回密码'];
var rememberPW = false;
var pageEvent = null;

Page({
  data: {
    verifyCodeURL: "",
    Mode: 0,
    animations: [],
    TitleText: pageTitles[0],
    vCodeLoading: true,
    BLoading: false,
    RememberPW: false,
    UserName: '',
    PassWord: '',
    showTermsWindow: false,
    termsNodes: null
  },
  onReady: function() {
    let _this = this;
    let sUN = my.getStorageSync({ key: 'UserName' }).data;
    let sPW = my.getStorageSync({ key: 'PassWord' }).data;

    if (sUN != '' && sPW != '') {
      rememberPW = true;
      this.setData({ RememberPW: true, UserName: sUN, PassWord: sPW });
    }

    this.setData({ BLoading: true });
    app.getTerms();
    this.switchPage(0);
    my.showNavigationBarLoading();
    this.showNotice(function() {
      http.api_request(
        app.globalData.ApiUrls.CheckSessionURL,
        null,
        function(res) {
          if (typeof res == 'string' && res.indexOf('饼干管理') > 0) {
            my.switchTab({
              url: '../member-cookie/member-cookie',
            });
          }
          else if (typeof res == 'object' && res.info !== undefined) {
            if (res.info != "并没有权限访问_(:з」∠)_") {
              app.showError(res.info);
            }
          }
          else {
            console.log(res);
            app.showError('未知错误');
          }
          _this.setData({ BLoading: false });
          _this.getNewVcode();
          my.hideNavigationBarLoading();
        },
        function() {
          app.showError('连接服务器失败');
          _this.setData({ BLoading: false });
          my.hideNavigationBarLoading();
        }
      );
    });
  },
  onTapVerifyCode: function(e) {
    this.getNewVcode();
  },
  onTapIlogin: function() {
    this.switchPage(0);
    this.getNewVcode();
  },
  onTapIsignup: function() {
    this.switchPage(1);
    this.getNewVcode();
  },
  onTapIforgot: function() {
    this.switchPage(2);
    this.getNewVcode();
  },
  /**
     * APP下载
     */
  onAppDw: function() {
    my.showActionSheet({
      itemList: ['APP下载', '关于'],
      itemColor: '#334054',
      success: function(e) {
        if (e.cancel != true) {
          if (e.tapIndex == 0) {//App下载
            app.showDownloadAPP();
          }
          else if (e.tapIndex == 1) {//关于
            my.navigateTo({
              url: '../about/about',
            });
          }
        }
      },
      fail: function() { }
    });
  },
  onReadPrivacy: function() {
    my.navigateTo({ url: '../thread/thread?id=11689471&is_bt=false' });
  },
  /**
   * 载入服务条款
   */
  onReadTerms: function() {
    var _this = this;
    app.getTerms(function(res) {
      if (res === false) {
        app.showError('网络错误');
      }
      else if (res.status != 'ok') {
        app.showError(res.errmsg);
      }
      else {
        _this.setData({ termsNodes: WxParse.wxParse('item', 'html', res.data, _this, null).nodes, showTermsWindow: true });
      }
    });
  },
  onReadTermsFinish: function() {
    this.setData({ showTermsWindow: false });
  },
  f_touch: function() {
  },
  /**
   * 获取新验证码
   */
  getNewVcode: function() {
    this.setData({ vCodeLoading: true, verifyCodeURL: "" });
    var _this = this;
    http.get_verifycode(function(sta, img, msg) {
      if (sta == false) {
        app.showError(msg);
      }
      _this.setData({ vCodeLoading: false, verifyCodeURL: img });
    });
  },
  /**
   * 切换页面
   */
  switchPage: function(new_page) {
    this.setData({ Mode: new_page, TitleText: pageTitles[new_page] });
    /*
    var now_page = this.data.Mode;
    var now_anime = this.data.animations;

    var animeOut = my.createAnimation({
      duration: 200,
      timeFunction: 'ease'
    });
    animeOut.opacity(0).step();
    now_anime[now_page] = animeOut.export();
    this.setData({ animations: now_anime });

    var _this = this;
    setTimeout((function callback() {
      _this.setData({ Mode: new_page });
      var now_anime = _this.data.animations;
      var animeIn = my.createAnimation({
        duration: 200,
        timeFunction: 'ease'
      });
      animeIn.opacity(1).step();
      now_anime[new_page] = animeIn.export();
      _this.setData({ animations: now_anime, TitleText: pageTitles[new_page] });
      if (new_page == 1) {
        my.showModal({
          title: '提示',
          content: '目前微软旗下的所有邮箱（包括Hotmail、Outlook、Live等）和新浪邮箱全都屏蔽了A岛的注册邮件，请使用其他邮箱注册。',
          showCancel: false
        });
      }
    }).bind(this), 200);*/
  },
  /**
   * 获取并显示公告
   */
  showNotice: function(callback) {
    my.httpRequest({
      url: app.globalData.ApiUrls.GetNoticeURL,
      dataType: 'json',
      success: function(res) {
        console.log(res);
        if (typeof res.data == 'object') {
          if (res.data.errno == '0' && res.data.notice.length > 0) {
            var noticeMark = my.getStorageSync({ key: 'NoticeMark' }).data;
            if (noticeMark == undefined || noticeMark == null || noticeMark == '')
              noticeMark = 0;
            if (noticeMark < res.data.id) {
              my.showModal({
                title: '提示',
                content: res.data.notice,
                confirmText: '不再显示',
                success: function(e) {
                  if (e.confirm == true) {
                    my.setStorageSync({ key: 'NoticeMark', data: res.data.id});
                  }
                  callback();
                }
              });
              return;
            }
          }
        }
        callback();
      },
      fail: function() {
        callback();
      },
    });
  }
});
