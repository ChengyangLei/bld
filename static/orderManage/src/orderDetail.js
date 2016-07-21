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

    var OrderDetail = window.OrderDetail = function(){
		return new OrderDetail.fn.init();
	};

	module.exports = OrderDetail;
	
	OrderDetail.fn = OrderDetail.prototype = {
	
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
			var _this = this;
			_T.helper('dateFormat', function (val) {
				if(val=='')
					return '时间去哪了'
			    return $.formatDate('Y-m-d H:i:s',val);
			});
			_T.helper('statusFormat', function (val) {
				var temparr = ['待受理','待配送','配送中','已完成'];
				return temparr[val];
			});
			_R(_I.shop.getOrderInfo+$.formatParams({orderId:$.getParam('id')}),{},'get',function(ret){
				var html = _T('template', ret.data);
				document.getElementById('content').innerHTML = html;			
			})
		}
	};
	
	OrderDetail.fn.init.prototype = OrderDetail.fn;
});