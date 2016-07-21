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
    	shopCategoryId:$.getParam('id'),
		shopId:$.getCookie('companyDmId')
	};

    var GoodsListByCategory = window.GoodsListByCategory = function(){
		return new GoodsListByCategory.fn.init();
	};

	module.exports = GoodsListByCategory;
	
	GoodsListByCategory.fn = GoodsListByCategory.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		load:function(){
			var _this = this;
			$.eventBind(_this);
			$("#addGoodsCategory").attr('href',$("#addGoodsCategory").attr('href')+'?id='+$.getParam('id'));
			_this.getList();
			_this.getCategory();
		},
		getList:function(){
			var _this = this;
			_R(_I.goods.shopCategoryId+$.formatParams(_option),{shopGoodsPage:''},'post',function(ret){
				var html = _T('template', ret.data);
				document.getElementById('content').innerHTML = html;
			})
		},
		ensure:function(el){
			if($("#changeCategory option:selected").val() == 0){
				layer.msg('请选择分类');
				return false;
			}
			var str = '';
			$("input[type='checkbox']:checked").each(function () {
				if(this.value !="0")
                	str += this.value+','
            })
            if(str.length <= 0){
            	layer.msg('您没有选择商品');
            	return false;
            }
			var params = {
				shopGoodsIds:str.substring(0,str.length-1).split(','),
				shopId:$.getCookie('companyDmId'),
				shopCategoryId:$("#changeCategory option:selected").val()
			}
			_R(_I.goods.changeCategory+$.formatParams(params),'','get',function(ret){
				if(ret.code ==0){
					layer.msg('修改成功', {
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
		},
		getCategory:function(){
			_R(_I.category.list+$.formatParams({pageNum:1,pageSize:50,shopId:$.getCookie('companyDmId')}),'','get',function(ret){
				var source = '<option value="0">批量移至分类...</option>{{each list as obj}}<option value="{{obj.dmId}}">{{obj.name}}</option>{{/each}}'; 
				var render = _T.compile(source);
				var html = render(ret.data);
				document.getElementById('changeCategory').innerHTML = html;
			})
		},
		checkAll:function(el){
			$("input[type='checkbox']").prop('checked', $(el).prop('checked'));
		}
	};
	
	GoodsListByCategory.fn.init.prototype = GoodsListByCategory.fn;
});