define(function(require, exports, module) {
	//所有页面必须请求该模块验证身份
	require('authentication');

	require('utils');
    var $ = require('jquery'),
    	layer = require('layer'),
    	_R = require('request'),
    	_I = require('interface');
    layer.config({
	  	path: '/module/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
	});

    var CategoryAdd = window.CategoryAdd = function(){
		return new CategoryAdd.fn.init();
	};

	module.exports = CategoryAdd;
	
	CategoryAdd.fn = CategoryAdd.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		load:function(){
			var _this = this;
			$.eventBind(_this);
		},
		ensure:function(){
			var params = {
				"shopId":parseInt($.getCookie('companyDmId')),
				"name":$("#name").val(),
				"sort":parseInt($("#sort option:selected").val())
			};
			if($.trim(params.name) == ''){
				layer.msg('分类名称不能为空',{time:1500});
				return false;
			}
			_R(_I.category.add,params,'post',function(ret){
				if(ret.code ==0){
					layer.msg('添加成功', {
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
		}
	};
	
	CategoryAdd.fn.init.prototype = CategoryAdd.fn;
});