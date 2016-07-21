define(function(require, exports, module) {
	//所有页面必须请求该模块验证身份
	require('authentication');

	require('utils');
    var $ = require('jquery'),
    	layer = require('layer'),
    	_R = require('request'),
    	_I = require('interface'),
    	_T = require('template');
    layer.config({
	  	path: '/module/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
	});

	var _option={
		nowPage:1,
		pageSize:1,
		dmId:$.getParam('id')
	};

    var WithdrawDetail = window.WithdrawDetail = function(){
		return new WithdrawDetail.fn.init();
	};

	module.exports = WithdrawDetail;
	
	WithdrawDetail.fn = WithdrawDetail.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		load:function(){
			var _this = this;
			_this.getInfo();
		},
		getInfo:function(){
			_T.helper('status', function (val) {
				var arr = ['提现中','同意提现','驳回','取消','追回'];
				return arr[val];
			});
			_T.helper('dateFormat', function (val) {
				if(val=='')
					return '时间去哪了'
			    return $.formatDate('Y-m-d H:i:s',val);
			});
			_R(_I.wallet.wallet.getWithdrawalsList,_option,'post',function(ret){
				var html = _T('template', ret.data.list[0]);
				document.getElementById('content').innerHTML = html;
			})
		}
	};
	
	WithdrawDetail.fn.init.prototype = WithdrawDetail.fn;
});