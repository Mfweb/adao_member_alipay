
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../pages/index/index');
require('../../pages/userMember/userMember');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
