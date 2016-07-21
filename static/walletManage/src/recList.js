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
    	stat:$.getParam('status'),
		nowPage:1,
		pageSize:20
	};

    var RecList = window.RecList = function(){
		return new RecList.fn.init();
	};

	module.exports = RecList;
	
	RecList.fn = RecList.prototype = {
	
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
			seajs.use('datetimepicker', function() {
				$('#startDate').datetimepicker({
					format: "Y-m-d",
					timepicker: false
				});
				$('#endDate').datetimepicker({
					format: "Y-m-d",
					timepicker: false
				});
			})
		},
		pager:function(){
			var _this = this;
			$("nav a").on('click',function(){
				var opts = {};
				$.extend(opts,_option,{
					nowPage:$(this).attr('data-val')
				})
				_option = opts;
				_this.getList();
			})
		},
		getList:function(){
			var _this = this;
			_T.helper('dateFormat', function (val) {
				if(val=='')
					return '时间去哪了'
			    return $.formatDate('Y-m-d H:i:s',val);
			});
			_R(_I.wallet.wallet.getIncomeList,_option,'post',function(ret){
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
			$.extend(opts,_option,{
				orderId: $("#key").val()=='0'?$.trim($("#val").val()):'',
				goodsId: $("#key").val()=='1'?$.trim($("#val").val()):'',				
				skuId: $("#key").val()=='2'?$.trim($("#val").val()):'',
				startTime: $.trim($("#startDate").val()),
				endTime: $.trim($("#endDate").val())
			})
			_option = opts;
			_this.getList();
		}
	};
	
	RecList.fn.init.prototype = RecList.fn;
});