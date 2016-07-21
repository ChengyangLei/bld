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

    var ShopSettings = window.ShopSettings = function(){
		return new ShopSettings.fn.init();
	};

	module.exports = ShopSettings;
	
	ShopSettings.fn = ShopSettings.prototype = {
	
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
			//template时间戳格式化
			_T.helper('dateFormat', function (val) {
				if(val=='')
					return '时间去哪了'
			    return $.formatDate('Y-m-d H:i:s',val);
			});
			_T.helper('types', function (val) {
				var arr = ['全部','配送','到店'];
				return arr[val];
			});
			_R(_I.shop.business+$.formatParams({shopId:$.getCookie('companyDmId')}),'','get',function(ret){
				if(ret.data){
					var html = _T('template', ret.data);
					document.getElementById('content').innerHTML = html;
				}else{
					$.nodata('content');
				}
			})
		}
	};
	
	ShopSettings.fn.init.prototype = ShopSettings.fn;
});