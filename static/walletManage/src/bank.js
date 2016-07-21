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
    var Bank = window.Bank = function(){
		return new Bank.fn.init();
	};

	module.exports = Bank;
	
	Bank.fn = Bank.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		load:function(){
			var _this = this;
			_this.getInfo();
			$.eventBind(_this);
		},
		getInfo:function(){
			_R(_I.wallet.bankCard.getPpshGroup+$.formatParams({organizeId:$.getCookie('companyDmId')}),{},'get',function(ret){
				var html = _T('template', ret);
				document.getElementById('content').innerHTML = html;
			})
		},
		unbind:function(el){
			var _this = this;
			var id = $(el).attr('event-val');
			_R(_I.wallet.bankCard.delBinding+$.formatParams({bankId:id}),'','post',function(ret){
				if(ret.code ==0){
					layer.msg('解绑成功', {
					  	icon: 1,
					  	time: 2000 //2秒关闭（如果不配置，默认是3秒）
					}, function(){
					  	_this.getInfo();
					});					
				}
			});
		}
	};
	
	Bank.fn.init.prototype = Bank.fn;
});