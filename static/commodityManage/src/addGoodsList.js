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
		pageSize:20,
		parmCode:3,
		shopId:$.getCookie('companyDmId')
	};

    var AddGoodsList = window.AddGoodsList = function(){
		return new AddGoodsList.fn.init();
	};

	module.exports = AddGoodsList;
	
	AddGoodsList.fn = AddGoodsList.prototype = {
	
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
			_R(_I.goods.goodslist+$.formatParams(_option),{shopGoodsPage:''},'post',function(ret){
				var html = _T('template', ret.data);
				document.getElementById('content').innerHTML = html;
				var pagehtml = _T('pageTemplate', ret.data);
				document.getElementById('pageContent').innerHTML = pagehtml;
				_this.pager();
			})
		},
		ensure:function(){
			var str = '';
			$("input[type='checkbox']:checked").each(function () {
                str += this.value+','
            })
            if(str.length <= 0){
            	layer.msg('您没有选择商品');
            	return false;
            }
			var params = {
				shopGoodsIds:str.substring(0,str.length-1).split(','),
				shopId:$.getCookie('companyDmId'),
				shopCategoryId:$.getParam('id')
			}
			_R(_I.goods.changeCategory+$.formatParams(params),'','get',function(ret){
				if(ret.code ==0){
					layer.msg('添加成功', {
					  	icon: 1,
					  	time: 2000 //2秒关闭（如果不配置，默认是3秒）
					}, function(){
						location.href= 'goodsListByCategory.html?id='+$.getParam('id');
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
	
	AddGoodsList.fn.init.prototype = AddGoodsList.fn;
});