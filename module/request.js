/**
 * ajax封装类
 * @author panbing 120728729@qq.com
 * @version 1.0 
 * @date 2016/05/17
 * @company ppsh.co
 */

define(function(require,exports,module){
	var $ = require('jquery'),
		layer = require('layer'),
		loadLayer = null,
        // serverHost = '/proxy/proxy.jsp?http://192.168.0.54:8080',
        serverHost = '',
		appPath = serverHost+'/qtz_sm',
		// getAppPath = function (url) {
  //           var token = url.split('?').length == 1?$.getCookie('token') != null ?"?token="+$.getCookie('token'):'':$.getCookie('token') != null ?"&token="+$.getCookie('token'):'';
	 //        return appPath + url + token;
	 //    };
        getAppPath = function (url) {
            return appPath + url;
        };
	require('utils');
	layer.config({
	  	path: '/module/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
	});
	/**
     * 远程调用获取服务器数据
     * @param URL 服务器URL
     * @param params 传递到服务器参数，例如：username=aaa&password=111
     * @param type 请求方式 ("POST" 或 "GET")
     * @param callback 回调函数
     */    
	var _request =  function (url, params, type, callBack) {
        $.ajax({
            type: type,
            url: getAppPath(url),
            data: type=='post'?JSON.stringify(params):'',
            contentType:'application/json',
            dataType: 'json',
            processData:false,
            timeout: 3000,
            beforeSend: function (xhr) {
            	loadLayer = layer.load(1);
            	if($.getCookie('token')!=null){
            		xhr.setRequestHeader("token", $.getCookie('token'));
            	}
            },
            success: function(ret){
            	setTimeout(function(){
            		if (ret) {
	                    callBack(ret);
	                }else{
                        layer.msg('返回值为空，请检查接口文件！', {icon: 2,time:1500});
	                }
            	},500);
            },
            error: function(xhr, type){
                layer.msg('请求失败，稍后再试！', {icon: 2,time:1500});
            },
            complete:function(xhr, ts){
            	setTimeout(function(){layer.close(loadLayer);},500);            	
            }
        })
    }

	module.exports = _request;
});