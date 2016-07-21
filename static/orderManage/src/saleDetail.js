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

    var SaleDetail = window.SaleDetail = function(){
		return new SaleDetail.fn.init();
	};

	module.exports = SaleDetail;
	
	SaleDetail.fn = SaleDetail.prototype = {
	
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
					return '&nbsp;'
			    return $.formatDate('Y-m-d H:i:s',val);
			});
			_T.helper('statusFormat', function(val) {
				var arr = ['交易成功','未付款','商家同意退款','商家拒绝接单','已发货','待发货','用户取消订单','申请退款','商家拒绝退款','商家同意退货'];
				return arr[val];
			});
			_T.helper('handleType', function (val) {
				var arr = ['','用户','商家','客服介入'];
				return arr[val];
			});
			_T.helper('handleTypeStyle', function (val) {
				var arr = ['','default','info','warning'];
				return arr[val];
			});
			_T.helper('stateExplain', function (val) {
				var param = {7:'退款中',2:'同意退款',8:'拒绝退款'};
				return param[val];
			});
			_R(_I.backOrder.getOrderInfo+$.formatParams({orderId:$.getParam('id')}),{},'get',function(ret){
				var html = _T('template', ret.data);
				document.getElementById('content').innerHTML = html;			
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
		}
	};
	
	SaleDetail.fn.init.prototype = SaleDetail.fn;
});