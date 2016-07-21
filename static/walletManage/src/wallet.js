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
    var Wallet = window.Wallet = function(){
		return new Wallet.fn.init();
	};

	module.exports = Wallet;
	
	Wallet.fn = Wallet.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		load:function(){
			var _this = this;
			$.eventBind(_this);
			_this.getInfo();
		},
		withdraw:function(el){
			layer.open({
				type: 2,
				title: '提现',
				shadeClose: true,
				shade: 0.5,
				area: ['450px', '300px'],
				content: 'withdraw.html?amount='+$(el).attr('event-amount')
			});
		},
		getInfo:function(){
			_R(_I.wallet.wallet.getMyWallet,{},'get',function(ret){
				var html = _T('template', ret);
				document.getElementById('content').innerHTML = html;
			})
		}
	};
	
	Wallet.fn.init.prototype = Wallet.fn;
});