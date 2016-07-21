define(function(require, exports, module) {
	//所有页面必须请求该模块验证身份
	require('authentication');

	require('utils');
    var $ = require('jquery'),
    	layer = require('layer'),
    	_R = require('request'),
    	_I = require('interface'),
    	_T = require('template');
    require('uploadify');
    layer.config({
	  	path: '/module/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
	});

    var ShopEdit = window.ShopEdit = function(){
		return new ShopEdit.fn.init();
	};

	module.exports = ShopEdit;
	
	ShopEdit.fn = ShopEdit.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		load:function(){
			var _this = this;
			_this.getInfo();
			$.eventBind(_this);
		},
		getInfo:function(){
			//template时间戳格式化
			_T.helper('dateFormat', function (val) {
				if(val=='')
					return '时间去哪了'
			    return $.formatDate('Y-m-d H:i:s',val);
			});
			_R(_I.shop.business+$.formatParams({shopId:$.getCookie('companyDmId')}),{},'get',function(ret){
				var html = _T('template', ret.data);
				document.getElementById('content').innerHTML = html;
				seajs.use('datetimepicker',function(){
					$('#serviceStartTimeStr').datetimepicker({
						datepicker:false,
						format:'H:i'
					});
					$('#serviceEndTimeStr').datetimepicker({
						datepicker:false,
						format:'H:i'
					});
				})
				
			})
		},
		upload:function(el){
			$.upload(el);
		},
		ensure:function(){
			var params = {
				shopId:$.getCookie('companyDmId'),
				icon:$('#icon').attr('src')//暂时还没有做上传功能，先放空
			};
			var ispost = true;
			$("input[type='text'],input[type='hidden']").each(function(i,v){
				if($.trim($(v).val()) == ''){
					$(v).focus();
					layer.tips($(v).parents('.form-group').find('label').text(), $(v));
					ispost = false;
					return false;
				}
				params[this.id] = $(v).val();
			})
			if(!ispost)
				return false;
			params.isSendPrice = $("#isSendPrice").prop("checked") ?1:0;
			_R(_I.shop.update,params,'post',function(ret){
				if(ret.code ==0){
					layer.msg('修改成功', {
					  	icon: 1,
					  	time: 2000 //2秒关闭（如果不配置，默认是3秒）
					}, function(){
					  	location.href='shopSettings.html'
					});
				}else{
					layer.msg(ret.msg, {
					  	icon: 2,
					  	time: 2000 //2秒关闭（如果不配置，默认是3秒）
					});
				}
			});
		}
	};
	
	ShopEdit.fn.init.prototype = ShopEdit.fn;
});