Component({
  props: {
    defaultData: {},
    onPageChange: (id) => null
  },
  data: {
    settings: {}
  },
  didMount: function () {
    this.setData({ settings: this.props.defaultData});
    getApp().getImage(function (url) {
      this.setData({ 'settings.picURL': url });
    }.bind(this));
  },
  methods: {
    /**
     * 点击了左上角菜单按钮
     */
    onTapMenuButton: function (e) {
      this.setData({ 'settings.show': true });
    },
    /**
     * 切换页面
     */
    onTapMenuItem: function (e) {
      this.props.onPageChange(e.currentTarget.id);
      if (this.data.settings.menuList[e.currentTarget.id].canSwitch == true) {
        this.setData({ 'settings.selectedIndex': e.currentTarget.id });
      }
      this.setData({ 'settings.show': false });
    },
    
    /**
     * 点击了遮罩层
     */
    onTapOverlay: function () {
      this.setData({ 'settings.show': false });
    },
    onViewImage: function () {
      my.previewImage({
        urls: [this.data.settings.picURL],
      });
      getApp().getImage(function (url) {
        this.setData({ 'settings.picURL': url });
      }.bind(this));
    }
  }
})
