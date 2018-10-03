/**
 * @brief 保存所有Cookie
 * @param data:本次请求的setcookie内容
 * @retval None
 */
function save_cookie(data)
{
  //console.log('save cookie');
  //console.log(data);
  data = data.replace(" ","");
  data = data.split(";");
  var saved_data = my.getStorageSync({ key: 'user_cookie' }).data;
  saved_data = JSON.parse(saved_data==''?'{}':saved_data);

  var save_array = Array();
  for(let i = 0;i < data.length;i++)
  {
    var temp_data = data[i].split("=");
    saved_data[temp_data[0]] = temp_data[1];
  }
  my.setStorageSync({ key: 'user_cookie', data: JSON.stringify(saved_data)});
}
/**
 * @brief 获取所有Cookie
 * @retval cookie内容
 */
function get_cookie()
{
  //console.log('load cookie');
  var cookies = my.getStorageSync({ key: 'user_cookie' }).data;
  console.log(cookies);
  cookies = JSON.parse((cookies == '' || cookies == null) ? '{}' : cookies);
  //console.log(cookies);
  var out_str = '';
  for(let o in cookies)
  {
    if (o == 'path') continue;
    out_str += o;
    out_str += '=';
    out_str += cookies[o];
    out_str += ';';
  }
  //out_str = out_str.substring(0, out_str.length - 1);
  //console.log(out_str);
  return out_str;
}
/**
 * @brief 获取指定key的Cookie内容
 * @param key:指定key
 * @retval 指定Key的内容
 */
function get_cookie_key(key)
{
  var cookies = my.getStorageSync({ key: 'user_cookie' }).data;
  cookies = JSON.parse(cookies == '' ? '{}' : cookies);
  return cookies[key];
}
/**
 * @brief 设置指定key的cookie内容
 * @param key:指定key
 * @param value:内容
 * @retval None
 */
function set_cookie_key(key,value)
{
  var cookies = my.getStorageSync({ key: 'user_cookie' }).data;
  cookies = JSON.parse(cookies == '' ? '{}' : cookies);
  try {
    if (cookies[key] !== undefined) {
      cookies[key] = value;
    }
    else {
      cookies.push({ key: value });
    }
  }
  catch(e){
    cookies.push({ key: value });
  }
    
  my.setStorageSync({ key: 'user_cookie',data: JSON.stringify(cookies)})
}
/**
 * @brief 带Cookie请求一个地址，并更新Cookie
 * @param url:要请求的地址
 * @param pdata:POST数据
 * @param success:请求成功回调
 * @param fail:请求失败回调
 * @retval None
 */
function api_request(url, pdata, success, fail)
{
  my.httpRequest({
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
//      'User-Agent': 'HavfunClient-WeChatAPP',
      'X-Requested-With': 'XMLHttpRequest',
      'Cookie': get_cookie()
    },
    data: pdata == null ? {} : pdata,
    dataType: 'text',
    method: 'POST',

    success: function(res){
      if (res.data[0] == '{') {
        res.data = JSON.parse(res.data);
      }
      console.log(res);
      try{
        if (res != undefined && res.headers !== undefined && res.header['Set-Cookie'] !== undefined)
          save_cookie(res.header['Set-Cookie']);
      }
      catch(e){}

      if(success != null)
        success(res.data, res.header);
    },
    fail: function(){
      if(fail != null)
        fail();
    }
  })
}

var gettingVCode = false;
/**
 * @brief 下载验证码
 * @param success:请求成功回调
 * @param fail:请求失败回调
 * @retval None
 */
function _get_verifycode(success,fail)
{
  const app = getApp();
  my.downloadFile({
    url: app.globalData.ApiUrls.VerifyCodeURL + "?code=" + Math.random(),
    header: {
      'Cookie': get_cookie()
    },
    success: function(res)
    {
      if (success != null)
        success(res);
    },
    fail:function()
    {
      if (fail != null)
        fail();
    }
  })
}

function get_verifycode(callback) {
  if (gettingVCode)return;
  gettingVCode = true;
  
  _get_verifycode(function (res) {
    gettingVCode = false;
    callback(true, res.apFilePath);
  },
  function () {
    gettingVCode = false;
    callback(true, "../../imgs/loaderror.png", '网络错误');
  });
}

module.exports = {
  api_request: api_request,
  get_cookie_key: get_cookie_key,
  set_cookie_key: set_cookie_key,
  get_verifycode: get_verifycode
}
