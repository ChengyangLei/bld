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

    var ShopInfo = window.ShopInfo = function(){
		return new ShopInfo.fn.init();
	};

	module.exports = ShopInfo;
	
	ShopInfo.fn = ShopInfo.prototype = {
	
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
			_R(_I.shop.getShopInfo+$.formatParams({shopId:$.getCookie('companyDmId')}),{},'get',function(ret){
				if(ret.data){
					var html = _T('template', ret.data);
					document.getElementById('content').innerHTML = html;
				}else{
					$.nodata('content');
				}
				$('[event-id="chooseStatusShow"]', window.parent.document).attr('event-val',ret.data.dmId).text('【'+(ret.data.status == 0 ?'正在营业':'停止营业')+'】');
			})
		}
	};
	
	ShopInfo.fn.init.prototype = ShopInfo.fn;
});