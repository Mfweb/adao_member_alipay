const app = getApp();
const http = require('../../utils/http.js');

Component({
  /**
   * 组件的属性列表
   */
  props: {
    hide: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    CPLoading:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
      if (this.data.CPLoading == true) return;
      this.setData({ 'CPLoading': true });

      http.api_request(
        app.globalData.ApiUrls.ChangePasswordURL,
        {
          oldpwd: old_passwd,
          pwd: new_passwd,
          repwd: new_passwd2
        },
        function (res) {
          if (typeof res == 'object') {
            if (res.status == 1)
              app.logOut();
            else
              app.showError(res.info);
          }
          else {
            app.showError("发生了错误");
          }
          this.setData({ 'CPLoading': false });
        }.bind(this),
        function () {
          app.showError('发生了错误');
          this.setData({ 'CPLoading': false });
        }.bind(this)
      );
    }
  }
})
