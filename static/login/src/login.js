define(function(require, exports, module) {

	require('utils');

    var $ = require('jquery'),
    	layer = require('layer'),
    	_R = require('request'),
    	_V = require('valid'),
    	_T = require('validTip'),
    	_I = require('interface');
    layer.config({
	  	path: '/module/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
	});
    var Login = window.Login = function(){
		return new Login.fn.init();
	};

	module.exports = Login;
	
	Login.fn = Login.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		load:function(){
			var _this = this;				
			$("[event-id]").click(function(){
				var event_id = $(this).attr('event-id');
				_this[event_id]();
			});
		},
		login:function(){
			var username = $("[input-id='username']").val(),
				password = $("[input-id='password']").val();

			if(!_V.isEmpty(username)){
				layer.tips(_T.mobile.empty, "[input-id='username']");
				return false;
			}else if(!_V.isMobile(username)){
				layer.tips(_T.mobile.verify, "[input-id='username']");
				return false;
			}
			var pwdValid = _V.isPwdValid(password);
			if(!pwdValid.valid){
				layer.tips(pwdValid.msg, "[input-id='password']");
				return false;
			}

			var	params = {
					name:username,
					pwd:password
				},
				url = _I.login;
			_R(url+$.formatParams(params),{},'get',function(ret){
				if(ret.code ==0){
					$.setCookie('token',ret.data.token,'d7');
					for(var key in ret.data.user){
						$.setCookie(key,ret.data.user[key],'d7');
					}
					location.href="/";
				}else{
					layer.msg(ret.msg, {icon: 2,time:1500}); 
				}
			})
		}
	};
	
	Login.fn.init.prototype = Login.fn;
});