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
		pageNum:1,
		pageSize:20,
		parmCode:1,
		shopId:$.getCookie('companyDmId')
	};

	var _filter = {};

    var GoodsList = window.GoodsList = function(){
		return new GoodsList.fn.init();
	};

	module.exports = GoodsList;
	
	GoodsList.fn = GoodsList.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		load:function(){
			var _this = this;
			$.eventBind(_this);
			_this.getList();
		},
		pager:function(){
			var _this = this;
			$("nav a").on('click',function(){
				var opts = {};
				$.extend(opts,_option,{
					pageNum:$(this).attr('data-val')
				})
				_option = opts;
				_this.getList();
			})
		},
		getList:function(){
			var _this = this;
			_R(_I.goods.goodslist+$.formatParams(_option),_filter,'post',function(ret){
				var html = _T('template', ret.data);
				document.getElementById('content').innerHTML = html;
				var pagehtml = _T('pageTemplate', ret.data);
				document.getElementById('pageContent').innerHTML = pagehtml;
				_this.pager();
			})
		},
		filter:function(){
			var _this = this;
			var opts = {};
			$.extend(opts,_filter,{
				name: $("#goodsKey").val()=='name'?$.trim($("#goodsVal").val()):'',
				code: $("#goodsKey").val()=='code'?$.trim($("#goodsVal").val()):'',
				skuId: $("#goodsKey").val()=='skuId'?$.trim($("#goodsVal").val()):'',
				startActual: $.trim($("#startActual").val()),
				endActual: $.trim($("#endActual").val())
			})
			_filter = opts;
			_this.getList();
		}
	};
	
	GoodsList.fn.init.prototype = GoodsList.fn;
});