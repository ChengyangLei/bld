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

    var CategoryEdit = window.CategoryEdit = function(){
		return new CategoryEdit.fn.init();
	};

	module.exports = CategoryEdit;
	
	CategoryEdit.fn = CategoryEdit.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		load:function(){
			var _this = this;
			$.eventBind(_this);
			$("#name").val($.getParam("name"));
			$("#sort").val($.getParam("sort"));
		},
		ensure:function(){
			var params = {
				"dmId":$.getParam("id"),
				"shopId":parseInt($.getCookie('companyDmId')),
				"name":$("#name").val(),
				"sort":parseInt($("#sort").val())
			};
			if($.trim(params.name) == ''){
				layer.msg('分类名称不能为空',{time:1500});
				return false;
			}
			_R(_I.category.update,params,'post',function(ret){
				if(ret.code ==0){
					layer.msg('修改成功', {
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
	
	CategoryEdit.fn.init.prototype = CategoryEdit.fn;
});