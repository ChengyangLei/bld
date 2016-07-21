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

    var GoodsDetail = window.GoodsDetail = function(){
		return new GoodsDetail.fn.init();
	};

	module.exports = GoodsDetail;
	
	GoodsDetail.fn = GoodsDetail.prototype = {
	
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
			_R(_I.goods.getGoodsById+$.formatParams({goodsId:$.getParam('id'),pageType:1}),'','post',function(ret){
				if(ret.data){
					var html = _T('template', ret.data);
					document.getElementById('content').innerHTML = html;
					$("#desc").html(ret.data.goods.desc)
				}else{
					$.nodata('content');
				}
			})
		}
	};
	
	GoodsDetail.fn.init.prototype = GoodsDetail.fn;
});