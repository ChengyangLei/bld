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
		pageSize:20
	};

    var WithDrawList = window.WithDrawList = function(){
		return new WithDrawList.fn.init();
	};

	module.exports = WithDrawList;
	
	WithDrawList.fn = WithDrawList.prototype = {
	
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
					return '时间去哪了';
			    return $.formatDate('Y-m-d H:i:s',parseInt(val));
			});
			_T.helper('status', function (val) {
				var arr = ['提现中','同意提现','驳回','取消','追回'];
				return arr[val];
			});
			_R(_I.wallet.wallet.getWithdrawalsList,_option,'post',function(ret){
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
				dmId:$("#val").val(),
				astatus: $("#status").val(),
				startCreateOn: $.trim($("#startDate").val()),
				endCreateOn: $.trim($("#endDate").val())
			})
			_option = opts;
			_this.getList();
		}
	};
	
	WithDrawList.fn.init.prototype = WithDrawList.fn;
});