const hostURL = "https://amember.mfweb.top";

App({
  globalData: {
    ApiUrls: {
      VerifyCodeURL: hostURL + "/nmb/Member/User/Index/verify.html",//请求验证码
      LoginURL: hostURL + "/nmb/Member/User/Index/login.html",//登录
      SignupURL: hostURL + "/nmb/Member/User/Index/sendRegister.html",//注册
      ForgotURL: hostURL + "/nmb/Member/User/Index/sendForgotPassword.html",//忘记密码
      CheckSessionURL: hostURL + "/nmb/Member/User/Index/index.html",//检查是Session是否有效
      CookiesListURL: hostURL + "/nmb/Member/User/Cookie/index.html",//饼干列表
      CookieDeleteURL: hostURL + "/nmb/Member/User/Cookie/delete/id/",//删除饼干
      CookieGetQRURL: hostURL + "/nmb/Member/User/Cookie/export/id/",//获取饼干二维码
      CookieGetDetailURL: hostURL + "/nmb/Member/User/Cookie/switchTo/id/",//获取饼干内容
      CookieGetNewURL: hostURL + "/nmb/Member/User/Cookie/apply.html",//获取新饼干
      CertifiedStatusURL: hostURL + "/nmb/Member/User/Authentication/mobile.html",//认证状态
      MobileCertURL: hostURL + "/nmb/Member/User/Authentication/mobileReverseAuthCode",//手机认证
      MobileCheckURL: hostURL + "/nmb/Member/User/Authentication/isBindMobile",//手机认证校验
      ChangePasswordURL: hostURL + "/nmb/Member/User/Index/changePassword.html",//修改密码

      GetNoticeURL: hostURL + "/adao/member/notice.php",//获取公告
      GetAuthPhoneURL: hostURL + "/adao/member/getphone.php",//获取三酱验证手机号
      GetRandomPicURL: hostURL + "/adao/getpicture.php",//获取随机图
      Tnnaii_H_IslandURL: "http://cdn.aixifan.com/h/mp3/tnnaii-h-island-c.mp3",//奈奈-食我大雕
      //获取分享串
      GetSharesURL: hostURL + "/adao/getshare.php",
      //获取服务条款
      GetTermsURL: hostURL + "/adao/member/getterms.php",
      GetCDNURL: "https://nmb.fastmirror.org/Api/getCdnPath?appid=wechatapp",//获取CDN地址
      //主岛配置
      ThreadURL: hostURL + "/nmb/Api/thread?appid=wechatapp",//获得串内容和回复
      GetThreadURL: hostURL + "/nmb/Api/ref?appid=wechatapp",//获得串内容
      ThumbImgURL: "https://nmbimg.fastmirror.org/thumb/",//缩略图
      FullImgURL: "https://nmbimg.fastmirror.org/image/",//原图
      //备胎岛配置
      BTThreadURL: hostURL + "/btnmb/Api/thread?appid=wechatapp",//获得串内容和回复
      BTGetThreadURL: hostURL + "/btnmb/Api/ref?appid=wechatapp",//获得串内容
      BTThumbImgURL: "https://tnmbstatic.fastmirror.org/Public/Upload/thumb/",//缩略图
      BTFullImgURL: "https://tnmbstatic.fastmirror.org/Public/Upload/image/",//原图
      //小程序功能
      WeLoginURL: hostURL + "/adao/member/login.php",//登录
      WeUploadRunURL: hostURL + "/adao/member/uprun.php",//上传微信运动数据
      WeDownloadRunURL: hostURL + "/adao/member/dwrun.php",//获取微信运动排行
    }
  },
  todos: [
    { text: 'Learning Javascript', completed: true },
    { text: 'Learning ES2016', completed: true },
    { text: 'Learning 支付宝小程序', completed: false },
  ],
  showSuccess: function(msg) {
    if (msg.length > 7) {
      my.alert({
        title: '提示',
        content: msg,
        buttonText: '确认'
      })
    }
    else {
      my.showToast({
        type: 'success',
        content: msg
      });
    }
  },
  showError: function(msg) {
    let xmsg = '无';
    if (typeof msg != 'string') {
      if (typeof msg != 'undefined') {
        try {
          xmsg = JSON.stringify(msg);
        }
        catch (err) {
          xmsg = typeof msg;
        }
      }
      msg = '错误';
    }

    if (msg.length > 7) {
      my.alert({
        title: '错误',
        content: msg,
        buttonText: '确认'
      })
    }
    else {
      my.showToast({
        content: msg,
        type: 'fail'
      });
    }
  },
  log: function(msg) {
    console.log(msg);
    if (my.getLogManager) {
      const logger = my.getLogManager();
      logger.log(msg);
    }
  },
  showDownloadAPP: function() {
    var that = this;
    my.showActionSheet({
      itemList: ['iOS-芦苇娘', 'iOS-橙岛', '安卓-芦苇娘', '安卓-基佬紫', '人权机'],
      itemColor: '#334054',
      success: function(e) {
        if (e.cancel != true) {
          my.setClipboardData({
            data: that.globalData.AppList[e.tapIndex],
            success: function() {
              that.showSuccess('链接已复制');
            },
            fail: function() {
              that.showError('复制失败');
            }
          });
        }
      }
    });
  },
  ExitMenu: function() {
    var that = this;
    my.showActionSheet({
      itemList: ['APP下载', '关于', '退出登录'],
      itemColor: '#334054',
      success: function(e) {
        if (e.cancel != true) {
          if (e.tapIndex == 0) {//App下载
            that.showDownloadAPP();
          }
          else if (e.tapIndex == 1) {//关于
            my.navigateTo({
              url: '../about/about',
            });
          }
          else if (e.tapIndex == 2) {//退出登录
            that.logOut();
          }
        }
      },
      fail: function() { }
    });
  },
  logOut: function() {
    my.setStorageSync({ key: 'user_cookie', data :''});
    my.setStorageSync({ key: 'LoginSession', data: ''});
    //const http = require('utils/http.js');
    //http.set_cookie_key('memberUserspapapa', '');
    my.reLaunch({
      url: '../index/index',
    });
  },
  playEat: function() {
    my.playBackgroundAudio({
      dataUrl: this.globalData.ApiUrls.Tnnaii_H_IslandURL,
    });
    this.log('play eat');
  },
  getTerms: function(callback = null) {
    var terms_saved;
    try {
      terms_saved = JSON.parse(my.getStorageSync({ key: 'Terms'})).data;
    }
    catch (e) {
      terms_saved = null;
    }

    if (terms_saved == null || Date.parse(new Date()) - terms_saved.get_time > (1 * 60 * 60 * 1000)) {
      my.httpRequest({
        url: this.globalData.ApiUrls.GetTermsURL,
        dataType: 'text',
        success: function(res) {
          if (res.data[0] == '{') {
            res.data = JSON.parse(res.data);
          }
          if (res.data.status == 'ok' && res.data.status !== undefined) {
            res.data.get_time = Date.parse(new Date());
            my.setStorageSync({ key: 'Terms', data: JSON.stringify(res.data) });
          }
          if (callback != null) {
            callback(res.data);
          }
        },
        fail: function() {
          if (callback != null) {
            if (terms_saved != null) {
              callback(terms_saved);
            }
            else {
              callback(false);
            }
          }
        }
      });
    }
    else {
      if (callback != null) {
        callback(terms_saved);
      }
    }
  }
});