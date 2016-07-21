define(function(require, exports, module) {
	//所有页面必须请求该模块验证身份
	require('authentication');
	require('utils');

    var $ = require('jquery'),
    	layer = require('layer'),
    	_R = require('request'),
    	_T = require('template'),
    	_I = require('interface');
    layer.config({
	  	path: '/module/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
	});
    var Withdraw = window.Withdraw = function(){
		return new Withdraw.fn.init();
	};

	module.exports = Withdraw;
	
	Withdraw.fn = Withdraw.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		load:function(){
			var _this = this;
			$.eventBind(_this);
			_this.getInfo();
		},
		getInfo:function(){			
			_R(_I.wallet.bankCard.getPpshGroup+$.formatParams({organizeId:$.getCookie('companyDmId')}),{},'get',function(ret){
				var html = _T('template', ret);
				document.getElementById('content').innerHTML = html;
				$("#withAmount").text($.getParam('amount'));
			})
		},
		withdraw:function(el){
			if($.trim($("#withdraw").val()) == '' || parseInt($.trim($("#withdraw").val())) <=0){
				layer.msg('提现金额不能为空或小于0',{time:1500});
				return false;
			}
			var params = {
				amount:$("#withdraw").val(),
				bankCardId:$("#bankCardId").val()
			};
			_R(_I.wallet.wallet.applyWithdrawals+$.formatParams(params),'','post',function(ret){
				if(ret.code ==0){
					layer.msg('提现成功', {
					  	icon: 1,
					  	time: 2000 //2秒关闭（如果不配置，默认是3秒）
					}, function(){
						window.parent.location.reload();
					});
				}else{
					layer.msg(ret.msg, {
					  	icon: 2,
					  	time: 2000 //2秒关闭（如果不配置，默认是3秒）
					});
				}
			})
		},
		withdrawall:function(){
			$("#withdraw").val($("#withAmount").text());
		}
	};
	
	Withdraw.fn.init.prototype = Withdraw.fn;
});