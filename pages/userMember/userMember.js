const app = getApp();

Page({
  data: {
    pageIndex: 0,
    cookieLoading: true,
    authLoading: true,
    sportLoading: true,

    popupMenuOpenData: {}
  },
  resetData: function() {
    this.setData({
      pageIndex: 0,

      cookieLoading: true,
      authLoading: false,
      sportLoading: false,


      popupMenuOpenData: {
        show: false,
        selectedIndex: 0,
        picURL: '',
        userName: '匿名肥宅',
        menuList: [{
          name: '饼干管理',
          icon: 'cookie',
          canSwitch: true
        }, {
          name: '实名认证',
          icon: 'certified',
          canSwitch: true
        }, {
          name: '密码修改',
          icon: 'passwd',
          canSwitch: true
        }, {
          name: '关于',
          icon: 'about',
          canSwitch: false
        }, {
          name: '退出',
          icon: 'exit',
          canSwitch: false
        },
        ]
      }
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
  },
  /**
   * 开始下拉刷新
   */
  onPullDownRefresh: function() {
    if (this.data.pageIndex == 0) {
      //处理饼干数据
      this.cookieManagerCom.startLoadCookies();
    }
    else if (this.data.pageIndex == 1) {
      //处理实名认证相关数据
      this.authManagerCom.startLoadAuth();
    }
    else if (this.data.pageIndex == 2) {
      my.stopPullDownRefresh();
    }
  },
  pullDownRefreshAll: function() {
    //my.showNavigationBarLoading();
    //this.cookieManagerCom.startLoadCookies();
    //this.authManagerCom.startLoadAuth();
  },

  /**
   * 切换页面
   */
  onChangePage: function(id) {
    switch (parseInt(id)) {
      case 0:
      case 1:
      case 2:
        this.setData({ pageIndex: id });
        break;
      case 3:
        my.navigateTo({
          url: '../about/about',
        });
        break;
      case 4:
        app.logOut();
        break;
      default:
        app.showError('哈？');
    }
  },
  onLoadStart: function(event) {
    console.log(event);
    switch (event.detail.from) {
      case 'auth':
        this.setData({ authLoading: true });
        break;
      case 'cookie':
        this.setData({ cookieLoading: true });
        break;
    }
  },
  onLoadEnd: function(event) {
    console.log(event);
    switch (event.detail.from) {
      case 'auth':
        this.setData({ authLoading: false });
        break;
      case 'cookie':
        this.setData({ cookieLoading: false });
        break;
    }

    if (event.detail.needRefresh) {
      my.startPullDownRefresh({});
    }
    else {
      my.stopPullDownRefresh();
    }
    this.setData({ authLoading: false });
  }
});
