
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../components/leftMenu/leftMenu');
require('../../components/cookieManager/cookieManager');
require('../../components/authManager/authManager');
require('../../components/passwdManager/passwdManager');
require('../../pages/index/index');
require('../../pages/userMember/userMember');
require('../../pages/about/about');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
