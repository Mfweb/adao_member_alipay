const app = getApp();
const http = require('../../utils/http.js');
const cookie = require('../../utils/cookie.js');
var WxParse = require('../../wxParse/wxParse.js');
var timer = null;
var authData = null;


Page({
  data: {
    statusBarHeight: app.globalData.SystemInfo.Windows.statusBarHeight,
    verifyCodeURL: "",//验证码链接
    vCodeLoading: false,//验证码是否在载入

    cookieManagerOpenData: {},
    authOpenData: {},
    changePasswdOpenData: {},
    popupMenuOpenData: {},
  },
  resetData: function() {
    this.setData({
      statusBarHeight: app.globalData.SystemInfo.Windows.statusBarHeight,
      verifyCodeURL: "",
      vCodeLoading: false,

      cookieManagerOpenData: {
        CookieList: [],//饼干列表
        vCodeShow: false,//验证码是否已显示
        needDeleteID: "",//需要删除的饼干index
        FormID: "",//表单提交ID
        EnterButLoading: false,//确认按钮loading
        CookieNum: '[0/0]',
        CookieWarning: null,
      },
      authOpenData: {
        EnterButLoading: false,//确认按钮loading
        CertStatus: "未知",//实名认证状态
        PhoneStatus: "未知",//手机实名认证状态
        CanCert: false,//是否可以手机实名认证（是否显示按钮）
        CertFormShow: false,//实名认证表单是否显示
        Cindex: 0,
        Carray: [
          '中国 - +86', '美国 - +1', '加拿大 - +1', '香港 - +852', '澳门 - +853', '台湾 - +886', '马来西亚 - +60', '印度尼西亚 - +62',
          '新加坡 - +65', '泰国 - +66', '日本 - +81', '韩国 - +82', '越南 - +84', '哈萨克斯坦 - +7', '塔吉克斯坦 - +7', '土耳其 - +90', '印度 - +91',
          '巴基斯坦 - +92', '阿富汗 - +93', '斯里兰卡 - +94', '缅甸 - +95', '伊朗 - +98', '文莱 - +673', '朝鲜 - +850', '柬埔寨 - +855', '老挝 - +865',
          '孟加拉国 - +880', '马尔代夫 - +960', '叙利亚 - +963', '伊拉克 - +964', '巴勒斯坦 - +970', '阿联酋 - +971', '以色列 - +972', '巴林 - +973',
          '不丹 - +975', '蒙古 - +976', '尼珀尔 - +977', '英国 - +44', '德国 - +49', '意大利 - +39', '法国 - +33', '俄罗斯 - +7', '希腊 - +30', '荷兰 - +31',
          '比利时 - +32', '西班牙 - +34', '匈牙利 - +36', '罗马尼亚 - +40', '瑞士 - +41', '奥地利 - +43', '丹麦 - +45', '瑞典 - +46', '挪威 - +47',
          '波兰 - +48', '圣马力诺 - +223', '匈牙利 - +336', '南斯拉夫 - +338', '直布罗陀 - +350', '葡萄牙 - +351', '卢森堡 - +352', '爱尔兰 - +353',
          '冰岛 - +354', '马耳他 - +356', '塞浦路斯 - +357', '芬兰 - +358', '保加利亚 - +359', '立陶宛 - +370', '乌克兰 - +380', '南斯拉夫 - +381',
          '捷克 - +420', '秘鲁 - +51', '墨西哥 - +52', '古巴 - +53', '阿根廷 - +54', '巴西 - +55', '智利 - +56', '哥伦比亚 - +57', '委内瑞拉 - +58',
          '澳大利亚 - +61', '新西兰 - +64', '关岛 - +671', '斐济 - +679', '圣诞岛 - +619164', '夏威夷 - +1808', '阿拉斯加 - +1907', '格陵兰岛 - +299',
          '牙买加 - +1876', '南极洲 - +64672'],
        CertMsg: null,//手机实名认证显示的消息
        ShowCertMsg: false,//是否显示实名认证消息
        CopyLoading: false,//复制手机号loading
      },
      changePasswdOpenData: {
        CPLoading: false
      },
      popupMenuOpenData: {
        show: false,
        statusBarHeight: app.globalData.SystemInfo.Windows.statusBarHeight,
        selectedIndex: 0,
        picURL: '',
        userName: '匿名肥宅',
        menuList: [
          {
            name: '饼干管理',
            icon: 'cookie'
          },
          {
            name: '实名认证',
            icon: 'certified'
          },
          {
            name: '密码修改',
            icon: 'passwd'
          },
          {
            name: '关于',
            icon: 'about'
          },
          {
            name: '退出',
            icon: 'exit'
          },
        ]
      },
    });
  },
  /**
   * 页面渲染完成
   */
  onReady: function() {
    this.resetData();
    this.pullDownRefreshAll();
    let userName = my.getStorageSync({key: 'UserName'}).data;
    if (userName == null || userName == '') {
      userName = '匿名肥宅';
    }
    this.setData({ 'popupMenuOpenData.userName': userName });
    app.getImage(function(url) {
      this.setData({ 'popupMenuOpenData.picURL': url });
    }.bind(this));
  },
  /**
   * 页面关闭
   */
  onHide: function() {
    if (timer != null) {
      clearInterval(timer);
      timer = null;
    }
  },
  /**
   * 开始下拉刷新
   */
  onPullDownRefresh: function() {
    if (this.data.popupMenuOpenData.selectedIndex == 0) {
      //处理饼干数据
      this.setData({ 'cookieManagerOpenData.vCodeShow': false });
      this.getCookies();
    }
    else if (this.data.popupMenuOpenData.selectedIndex == 1) {
      //处理实名认证相关数据
      if (timer != null) {
        clearInterval(timer);
        timer = null;
      }
      this.getCertifiedStatus();
      this.setData({
        'authOpenData.CertFormShow': false,
        'authOpenData.ShowCertMsg': false
      });
    }
    else if (this.data.popupMenuOpenData.selectedIndex == 2) {
      my.stopPullDownRefresh();
    }
  },
  /**
   * 切换页面
   */
  onTapMenuItem: function(e) {
    if (e.currentTarget.id == 3) {
      my.navigateTo({
        url: '../about/about',
      });
    }
    else if (e.currentTarget.id == 4) {
      app.logOut();
    }
    else {
      this.setData({ 'popupMenuOpenData.selectedIndex': e.currentTarget.id });
    }
    this.setData({ 'popupMenuOpenData.show': false });
  },

  /**
   * 点击了左上角菜单按钮
   */
  onTapMenuButton: function(e) {
    this.setData({ 'popupMenuOpenData.show': true });
  },
  /**
   * 点击了遮罩层
   */
  onTapOverlay: function() {
    this.setData({ 'popupMenuOpenData.show': false });
  },
  onPopupMenuCatchScroll: function() {

  },
  onEat: function(e) {
    app.playEat();
  },
  pullDownRefreshAll: function() {
    my.showNavigationBarLoading();
    this.setData({
      'cookieManagerOpenData.vCodeShow': false,
      'authOpenData.CertFormShow': false,
      'authOpenData.ShowCertMsg': false,
    });

    //处理饼干数据
    this.getCookies();
    //处理实名认证相关数据
    if (timer != null) {
      clearInterval(timer);
      timer = null;
    }
    this.getCertifiedStatus();
  },

  /**
   * 点击了关闭实名认证
   */
  onAuthClose: function() {
    this.setData({ 'authOpenData.CertFormShow': false });
  },
  /**
   * 确认修改密码
   */
  onChangePasswdSubmit(e) {
    var old_passwd = e.detail.value.opass;
    var new_passwd = e.detail.value.npass;
    var new_passwd2 = e.detail.value.npass2;
    if (old_passwd < 5 || new_passwd < 5 || new_passwd2 < 5) {
      app.showError('密码至少5位');
      return;
    }
    if (new_passwd != new_passwd2) {
      app.showError('两次输入不一致');
      return;
    }
    if (this.data.changePasswdOpenData.CPLoading == true) return;
    this.setData({ 'changePasswdOpenData.CPLoading': true });

    http.api_request(
      app.globalData.ApiUrls.ChangePasswordURL,
      {
        oldpwd: old_passwd,
        pwd: new_passwd,
        repwd: new_passwd2
      },
      function(res) {
        if (typeof res == 'object') {
          if (res.status == 1)
            app.logOut();
          else
            app.showError(res.info);
        }
        else {
          app.showError("发生了错误");
        }
        this.setData({ 'changePasswdOpenData.CPLoading': false });
      }.bind(this),
      function() {
        app.showError('发生了错误');
        this.setData({ 'changePasswdOpenData.CPLoading': false });
      }.bind(this)
    );
  },
  /**
   * 确认实名认证
   */
  onEnterAuth: function(e) {
    var u_vcode = e.detail.value.verifycode;
    if (u_vcode.length != 5) {
      app.showError('验证码错误');
      return;
    }
    if (this.data.authOpenData.EnterButLoading == true) return;
    this.setData({ 'authOpenData.EnterButLoading': true });

    var u_country = this.data.authOpenData.Cindex + 1;
    var u_phone = e.detail.value.phonenumber;
    if (!(/^\d{5,}$/.test(u_phone))) {
      app.showError('手机号错误');
      return false;
    }

    http.api_request(
      app.globalData.ApiUrls.MobileCertURL,
      {
        verify: u_vcode,//验证码
        mobile_country_id: u_country,//国家序号
        mobile: u_phone//手机号
      },
      function(res) {
        try {
          if (res.status == 0) {
            app.showError(res.info);
          }
          else {
            authData = res;
            res = res.replace(/\r/g, "");
            res = res.replace(/\n/g, "");

            var body_match = res.match(/<form[\s\S]*?>[\s\S]*?<\/form>/ig);
            if (body_match != null) {
              body_match[0] = body_match[0].replace(/tpl-form-maintext">[\s\D]*<b>/ig, "Sdata\"><b>");
              this.setData({
                'authOpenData.CertMsg': WxParse.wxParse('item', 'html', body_match[0], this, null).nodes,
                'authOpenData.ShowCertMsg': true,
                'authOpenData.CertFormShow': false
              });
              this.waitCert();
            }
            else {
              app.showError('发生了错误');
            }
          }

          this.setData({ 'authOpenData.EnterButLoading': false });
        }
        catch (err) {
          app.log(err.message);
          app.showError(err.message);
          this.setData({ 'authOpenData.EnterButLoading': false });
        }
      }.bind(this),
      function() {
        app.showError('发生了错误');
        this.setData({ 'authOpenData.EnterButLoading': false });
      }.bind(this));
  },
  /**
   * 点击了开始实名认证
   */
  onPhoneCert: function() {
    this.getNewVcode();
    this.setData({ 'authOpenData.CertFormShow': true });
  },
  /**
   * 修改了国家选择Picker
   */
  bindPickerChange: function(e) {
    this.setData({ 'authOpenData.Cindex ': e.detail.value });
  },
  /**
   * 点击了复制手机号
   */
  onCopyAuthPhoneNumber: function(e) {
    if (this.data.authOpenData.CopyLoading == true) return;
    this.setData({ 'authOpenData.CopyLoading': true });

    http.api_request(
      app.globalData.ApiUrls.GetAuthPhoneURL,
      {
        rawdata: authData,
      },
      function(res) {
        if (res == null || res == "error") {
          app.showError('复制失败');
        }
        else {
          my.setClipboard({
            text: res,
            success: function() {
              app.showSuccess('复制完成');
            },
            fail: function() {
              app.showError('复制失败');
            }
          });
        }
        this.setData({ 'authOpenData.CopyLoading': false });
      }.bind(this),
      function() {
        app.showError('获取失败');
        this.setData({ 'authOpenData.CopyLoading': false });
      }.bind(this)
    );
  },

  /**
   * 点击了删除饼干按钮
   */
  onDeleteCookie: function(e) {
    this.getNewVcode();
    this.setData({
      'cookieManagerOpenData.vCodeShow': true,
      'cookieManagerOpenData.needDeleteID': e.target.id,
      'cookieManagerOpenData.FormID': 'delete'
    });
  },
  /**
   * 点击了获取饼干按钮
   */
  onGetCookie: function(event) {
    let selId = event.target.id;
    my.showActionSheet({
      items: ['获取二维码', '复制内容'],
      success: function(e) {
        if (e.index == 0) {
          this.getCookieQR(selId);
        }
        else if (e.index > 0) {
          this.getCookieToClipboard(selId);
        }
      }.bind(this)
    })
  },
  /**
   * 点击了关闭验证码输入框按钮
   */
  onUClose: function(e) {
    this.setData({ 'cookieManagerOpenData.vCodeShow': false });
  },
  /**
   * 确认操作删除或获取饼干
   */
  onEnterCookie: function(e) {
    var u_vcode = e.detail.value.verifycode;
    var u_index = e.detail.value.needDeleteID;
    if (u_vcode.length != 5) {
      app.showError('验证码错误');
      return;
    }
    if (this.data.cookieManagerOpenData.EnterButLoading == true) return;
    this.setData({ 'cookieManagerOpenData.EnterButLoading': true });
    if (e.target.id == 'delete')//删除Cookie
    {
      if (this.data.cookieManagerOpenData.CookieList[u_index].delLoading == true) return;
      var selectData = 'cookieManagerOpenData.CookieList[' + u_index + '].delLoading';
      this.setData({ [selectData]: true });//对应的删除按钮显示loading

      http.api_request(
        app.globalData.ApiUrls.CookieDeleteURL + this.data.cookieManagerOpenData.CookieList[u_index].id + ".html",
        {
          verify: u_vcode
        },
        function(res) {
          if (res.status == 1) {
            my.startPullDownRefresh({});//删除请求成功，刷新页面
            this.setData({ 'cookieManagerOpenData.vCodeShow': false });
            app.showSuccess('删除完成');
            app.log('cookie delete success');
          }
          else {
            app.log('cookie delete error:' + res.info);
            this.getNewVcode();
            app.showError(res.info);
          }
          this.setData({
            'cookieManagerOpenData.EnterButLoading': false,
            [selectData]: false
          });
        }.bind(this),
        function() {
          app.showError('发生了错误');
          this.setData({
            [selectData]: false,
            'cookieManagerOpenData.EnterButLoading': false
          });
        }.bind(this));
    }
    else if (e.target.id == 'new')//获取新Cookie
    {
      http.api_request(
        app.globalData.ApiUrls.CookieGetNewURL,
        {
          verify: u_vcode
        },
        function(res) {
          //app.log(res);
          if (res.status == 1) {
            my.startPullDownRefresh({});//获取新Cookie成功，刷新页面
            app.showSuccess('大成功');
            app.log('get new cookie success');
            my.startPullDownRefresh({});
          }
          else {
            app.log('get new cookie error:' + res.info);
            app.showError(res.info);
          }
          this.setData({
            'cookieManagerOpenData.vCodeShow': false,
            'cookieManagerOpenData.EnterButLoading': false
          });
        }.bind(this),
        function() {
          app.showError('发生了错误');
          this.setData({ 'cookieManagerOpenData.EnterButLoading': false });
        }.bind(this));
    }
  },
  /**
   * 获取新Cookie
   */
  onGetNewCookie: function() {
    this.setData({
      'cookieManagerOpenData.vCodeShow': true,
      'cookieManagerOpenData.FormID': 'new'
    });
    this.getNewVcode();
  },
  /**
   * 刷新验证码
   */
  onTapVerifyCode: function(e) {
    this.getNewVcode();
  },
  /**
   * 获取新验证码
   */
  getNewVcode: function() {
    this.setData({ vCodeLoading: true, verifyCodeURL: '' });
    http.get_verifycode(function(sta, img, msg) {
      if (sta == false) {
        app.showError(msg);
      }
      this.setData({ vCodeLoading: false, verifyCodeURL: img });
    }.bind(this));
  },
  /**
   * 获取Cookie列表
   */
  getCookies: function(callback = null) {
    cookie.getCookies(function(status, msg, info) {
      if (info != null) {
        this.setData({
          'cookieManagerOpenData.CookieNum': info.capacity,
          'cookieManagerOpenData.CookieWarning': info.warning
        });
      }
      my.stopPullDownRefresh();

      if (status == false) {
        app.showError(msg);        
        if (callback !== null) callback(false);
        return;
      }
      this.setData({ 'cookieManagerOpenData.CookieList': msg });
      if (callback !== null) callback(true);
      my.hideNavigationBarLoading();
    }.bind(this));
  },
  /**
   * 创建并显示二维码
   */
  createQRCode: function(content, callback) {
    my.previewImage({
      urls: ["http://qr.liantu.com/api.php?w=500&text=" + encodeURI(content)]
    });
    callback();
  },
  /**
   * 获取Cookie详细并显示二维码
   */
  getCookieQR: function(index) {
    if (this.data.cookieManagerOpenData.CookieList[index].getLoading == true) return;
    var selectData = 'cookieManagerOpenData.CookieList[' + index + '].getLoading';
    this.setData({ [selectData]: true });

    cookie.getCookieDetail(this.data.cookieManagerOpenData.CookieList[index].id, function(sta, detail) {
      if (sta == true) {
        this.createQRCode(JSON.stringify({ cookie: detail }), function() {
          this.setData({ [selectData]: false });
          return;
        }.bind(this));
      }
      else {
        app.showError(detail);
        this.setData({ [selectData]: false });
      }
    }.bind(this));
  },
  /**
    * 获取Cookie详细并复制到剪切板
    */
  getCookieToClipboard: function(index) {
    if (this.data.cookieManagerOpenData.CookieList[index].getLoading == true) return;
    var selectData = 'cookieManagerOpenData.CookieList[' + index + '].getLoading';
    this.setData({ [selectData]: true });

    cookie.getCookieDetail(this.data.cookieManagerOpenData.CookieList[index].id, function(sta, detail) {
      if (sta == true) {
        my.setClipboard({
          text: detail,
          success: function() {
            app.showSuccess('饼干已复制');
          },
          fail: function() {
            app.showError('复制失败');
          }
        });
      }
      else {
        app.showError(detail);
      }
      this.setData({ [selectData]: false });
    }.bind(this));
  },
  /**
   * 获取当前认证状态
   */
  getCertifiedStatus: function() {
    http.api_request(
      app.globalData.ApiUrls.CertifiedStatusURL,
      null,
      function(res) {
        if (typeof res != 'string') {
          my.stopPullDownRefresh();
          return;
        }
        res = res.replace(/ /g, '');
        res = res.replace(/\r/g, '');
        res = res.replace(/\n/g, '');
        var cert_status = '';
        var phone_status = '';
        if (res.indexOf('实名状态') > 0) {
          cert_status = res.split('实名状态')[1].match(/<b>[\s\S]*?<\/b>/i);
          if (cert_status != null) {
            cert_status = cert_status[0].replace(/(<b>)|(<\/b>)/ig, '');
            this.setData({ 'authOpenData.CertStatus': cert_status });
          }
          else {
            app.showError('实名状态错误');
          }

          if (res.indexOf('已绑定手机') > 0)//手机认证已经成功的
          {
            phone_status = res.split('已绑定手机')[1].replace(/(><)/g, "").match(/>[\s\S]*?</i);
            if (phone_status != null) {
              phone_status = phone_status[0].replace(/(>)|(<)/ig, "");
              if (phone_status != null) {
                this.setData({ 'authOpenData.PhoneStatus': phone_status });
              }
            }
            this.setData({ 'authOpenData.CanCert': false });
          }
          else if (res.indexOf('绑定手机') > 0)//未进行手机实名认证
          {
            this.setData({
              'authOpenData.PhoneStatus': '未认证',
              'authOpenData.CanCert': true
            });
          }
        }
        else {
          app.showError('发生了错误');
        }
        my.stopPullDownRefresh();
      }.bind(this),
      function() {
        app.showError('发生了错误');
        my.stopPullDownRefresh();
      }.bind(this)
    );
  },
  /**
   * 等待认证成功
   */
  waitCert: function() {
    timer = setInterval(function() {
      http.api_request(app.globalData.ApiUrls.MobileCheckURL,
        null,
        function(res) {
          console.log(res);
          if (res == true) {
            clearInterval(timer);
            timer = null;
            app.log('phone auth success');
            my.startPullDownRefresh({});
          }
        },
        function() {

        }
      );
    }, 5000);
  }
});
