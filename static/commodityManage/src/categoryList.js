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
		pageSize:4,
		shopId:$.getCookie('companyDmId')
	};

    var CategoryList = window.CategoryList = function(){
		return new CategoryList.fn.init();
	};

	module.exports = CategoryList;
	
	CategoryList.fn = CategoryList.prototype = {
	
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
			//template时间戳格式化
			_T.helper('dateFormat', function (val) {
				if(val=='')
					return '时间去哪了'
			    return $.formatDate('Y-m-d H:i:s',val);
			});
			_R(_I.category.list+$.formatParams(_option),'','get',function(ret){
				var html = _T('template', ret.data);
				document.getElementById('content').innerHTML = html;
				var pagehtml = _T('pageTemplate', ret.data);
				document.getElementById('pageContent').innerHTML = pagehtml;
				_this.pager();
			})
		},
		statusCategory:function(el){
			var params = {
				shopCategoryId:$(el).attr('event-val-id'),
				status:$(el).attr('event-val-status')=="0"?1:0
			}
			layer.confirm('你确定要修改分类状态？', {
			  	btn: [$(el).attr('event-val-status')=="0"?"禁用":"启用",'取消'] //按钮
			}, function(){
			  	_R(_I.category.updateStatus+$.formatParams(params),'','get',function(ret){
				if(ret.code ==0){
					layer.msg('修改成功', {
					  	icon: 1,
					  	time: 2000 //2秒关闭（如果不配置，默认是3秒）
					}, function(){
						location.reload();
					});
				}else{
					layer.msg(ret.msg, {
					  	icon: 2,
					  	time: 2000 //2秒关闭（如果不配置，默认是3秒）
					});
				}
			})
			});
		},
		addCategory:function(){
			layer.open({
				type: 2,
				title: '新增分类',
				shadeClose: true,
				shade: 0.5,
				area: ['350px', '200px'],
				content: 'categoryAdd.html'
			});
		},
		editCategory:function(el){
			layer.open({
				type: 2,
				title: '修改分类',
				shadeClose: true,
				shade: 0.5,
				area: ['350px', '200px'],
				content: 'categoryEdit.html?id='+$(el).attr('event-val-id')+"&name="+$(el).attr('event-val-name')+"&sort="+$(el).attr('event-val-sort')
			});
		}
	};
	
	CategoryList.fn.init.prototype = CategoryList.fn;
});