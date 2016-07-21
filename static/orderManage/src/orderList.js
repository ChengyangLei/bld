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

	var _option = {
		shopId: $.getCookie('companyDmId'),
		pageNum: 1,
		pageSize: 10
	};
	
	var _filter = {};
	
	var OrderList = window.OrderList = function() {
		return new OrderList.fn.init();
	};

	module.exports = OrderList;

	OrderList.fn = OrderList.prototype = {

		/**
		 * 初始化
		 */
		init: function() {
			return this;
		},
		load: function() {
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
		pager: function() {
			var _this = this;
			$("nav a").on('click', function() {
				var opts = {};
				$.extend(opts, _option, {
					pageNum: $(this).attr('data-val')
				})
				_option = opts;
				_this.getList();
			})
		},
		filter: function() {
			var _this = this;
			var opts = {}; 
			$.extend(opts, _filter, {
				orderId: $("#orderKey").val() == '0' ? $.trim($("#orderVal").val()) : '',
				customer: $("#orderKey").val() == '1' ? $.trim($("#orderVal").val()) : '',
				mobile: $("#orderKey").val() == '2' ? $.trim($("#orderVal").val()) : '',
				address: $("#orderKey").val() == '3' ? $.trim($("#orderVal").val()) : '',
				status: $("#orderStatus").val(),
				startDate : $("#startDate").val(),
				endDate : $("#endDate").val()
			})
			_filter = opts;
			_this.getList();
		},
		getList: function() {
			var _this = this;
			//template时间戳格式化
			_T.helper('dateFormat', function(val) {
				if (val == '')
					return '时间去哪了'
				return $.formatDate('Y-m-d H:i:s', val);
			});
			_T.helper('statusFormat', function(val) {
				var temparr = ['待受理', '待配送', '配送中', '已完成'];
				return temparr[val];
			});
			_R(_I.shop.purchaseList + $.formatParams(_option), _filter , 'post', function(ret) {
				var html = _T('template', ret.data);
				document.getElementById('content').innerHTML = html;
				var pagehtml = _T('pageTemplate', ret.data);
				document.getElementById('pageContent').innerHTML = pagehtml;
				_this.pager();
			})
		}
	};

	OrderList.fn.init.prototype = OrderList.fn;
});