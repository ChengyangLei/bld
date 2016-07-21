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
		sellerId: $.getCookie('companyDmId'),
		pageIndex: 1,
		pageSize: 10
	};

	var SalesList = window.SalesList = function() {
		return new SalesList.fn.init();
	};

	module.exports = SalesList;

	SalesList.fn = SalesList.prototype = {

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
			});
			seajs.use('bootstrap', function() {
				$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
					_this.filter()
					  //var status = $(e.target).data('status');
				})
			});
		},
		pager: function() {
			var _this = this;
			$("nav a").on('click', function() {
				var opts = {};
				$.extend(opts, _option, {
					pageIndex: $(this).attr('data-val')
				})
				_option = opts;
				_this.getList();
			})
		},
		shipping: function(el) {
			var orderId, status, sellerId;
			orderId = $(el).attr('data-orderid');
			sellerId = $(el).attr('data-sellerId');
			status = 4;
			var params = {
				orderId: orderId,
				sellerId: sellerId,
				status: status
			};
			layer.confirm('你确定要接单吗？', {
				btn: ['确定', '取消'] //按钮
			}, function() {
				_R(_I.backOrder.whetherShopReceiveOrder+$.formatParams(params), '', 'post', function(ret) {
					if (ret.code == 0) {
						layer.msg('接单成功', {
							icon: 1,
							time: 2000 //2秒关闭（如果不配置，默认是3秒）
						}, function() {
							location.reload();
						});
					} else {
						layer.msg(ret.msg, {
							icon: 2,
							time: 2000 //2秒关闭（如果不配置，默认是3秒）
						});
					}
				})
			});
		},
		cancel: function(el) {
			var orderId, status, sellerId;
			orderId = $(el).attr('data-orderid');
			sellerId = $(el).attr('data-sellerId');
			status = 3;
			var params = {
				orderId: orderId,
				sellerId: sellerId,
				status: status
			};
			layer.confirm('你确定要取消订单？', {
				btn: ['确定', '取消'] //按钮
			}, function() {
				_R(_I.backOrder.whetherShopReceiveOrder+$.formatParams(params), '', 'post', function(ret) {
					if (ret.code == 0) {
						layer.msg('取消成功', {
							icon: 1,
							time: 2000 //2秒关闭（如果不配置，默认是3秒）
						}, function() {
							location.reload();
						});
					} else {
						layer.msg(ret.msg, {
							icon: 2,
							time: 2000 //2秒关闭（如果不配置，默认是3秒）
						});
					}
				})
			});
		},
		filter: function() {
			var _this = this;
			var opts = {};
			$.extend(opts, _option, {
				orderId: $("#orderKey").val() == '0' ? $.trim($("#orderVal").val()) : '',
				receivingName: $("#orderKey").val() == '1' ? $.trim($("#orderVal").val()) : '',
				receivingPhone: $("#orderKey").val() == '2' ? $.trim($("#orderVal").val()) : '',
				receivingAddress: $("#orderKey").val() == '3' ? $.trim($("#orderVal").val()) : '',
				status: $("ul.nav-pills .active a").attr('data-status'),
				startTime: $("#startDate").val(),
				endTime: $("#endDate").val()
			})
			_option = opts;
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
				var arr = ['交易成功','未付款','商家同意退款','商家拒绝接单','已发货','待发货','用户取消订单','申请退款','商家拒绝退款','商家同意退货'];
				return arr[val];
			});
			_R(_I.backOrder.getList + $.formatParams(_option), '', 'GET', function(ret) {
				var html = _T("template0", ret.data);
				document.getElementById("salesList").innerHTML = html;
				var pagehtml = _T('pageTemplate', ret.data);
				document.getElementById('pageContent').innerHTML = pagehtml;
				if (ret.data.rowCount > 0)
					$("#rowCount").html(ret.data.rowCount);
				else
					$("#rowCount").html("");
				_this.pager();
			})
		}
	};

	SalesList.fn.init.prototype = SalesList.fn;
});