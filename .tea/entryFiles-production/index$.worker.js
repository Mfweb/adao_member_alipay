
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../pages/index/index');
require('../../pages/userMember/userMember');
require('../../pages/about/about');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
