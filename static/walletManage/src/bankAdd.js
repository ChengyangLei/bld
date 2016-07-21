define(function(require, exports, module) {
	//所有页面必须请求该模块验证身份
	require('authentication');
	require('utils');

    var $ = require('jquery'),
    	layer = require('layer'),
    	_R = require('request'),
    	_T = require('template'),
    	_I = require('interface');
    layer.config({
	  	path: '/module/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
	});
    var BankAdd = window.BankAdd = function(){
		return new BankAdd.fn.init();
	};

	module.exports = BankAdd;
	
	BankAdd.fn = BankAdd.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		load:function(){
			var _this = this;
			$.eventBind(_this);
			$("#cardholder").val($("#accountType").val()==0?$.getCookie('companyName'):$.getCookie('lpName'));
			$("#accountType").on('change',function(){
				$("#cardholder").val($("#accountType").val()==0?$.getCookie('companyName'):$.getCookie('lpName'));
			})
		},
		ensure:function(){
			var ispost = true;
			$("input[type='text']").each(function(i,v){
				if($.trim($(v).val()) == ''){
					$(v).focus();
					layer.tips($(v).attr('placeholder'), $(v));
					ispost = false;
					return false;
				}
			})
			if(!ispost){
				return false;
			}
			var params = {};
			$("input,select").each(function(){
				params[this.id] = $(this).val();
			})
			
			_R(_I.wallet.bankCard.binding+$.formatParams(params),'','post',function(ret){
				if(ret.code ==0){
					layer.msg('绑定成功', {
					  	icon: 1,
					  	time: 2000 //2秒关闭（如果不配置，默认是3秒）
					}, function(){
					  	location.href='bank.html'
					});
				}else{
					layer.msg(ret.msg, {
					  	icon: 2,
					  	time: 2000 //2秒关闭（如果不配置，默认是3秒）
					});
				}
			});

		}
	};
	
	BankAdd.fn.init.prototype = BankAdd.fn;
});