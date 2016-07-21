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
		pageSize:10
	};

    var PurchaseList = window.PurchaseList = function(){
		return new PurchaseList.fn.init();
	};

	module.exports = PurchaseList;
	
	PurchaseList.fn = PurchaseList.prototype = {
	
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
			_R(_I.shop.getGoodsPage+$.formatParams(_option),'','get',function(ret){
				var html = _T('template', ret.data);
				document.getElementById('content').innerHTML = html;
				var pagehtml = _T('pageTemplate', ret.data);
				document.getElementById('pageContent').innerHTML = pagehtml;
				_this.pager();
				$("#total").text('0');
				$("[data-skuId]").keyup(function(){
					if(!/\D/g.test(this.value)){
						var total = 0;
						$("[data-skuId]").each(function(i,v){
							if(!v.value == '')
								total = parseInt(total)+parseInt(v.value);							
						})
						$("#total").text(total)
					}						
					else
						this.value=this.value.replace(/\D/g,'');

				})
			})
		},
		ensure:function(el){
			var _this = this;
			if(parseInt($("#total").text())==0){
				layer.msg('您还没有选择进货数量', {
				  	icon: 2,
				  	time: 2000 //2秒关闭（如果不配置，默认是3秒）
				});
			}else{
				seajs.use(['jquery','citySelect'],function($,citySelect){
					citySelect($); // 初始化插件
					$("#city").citySelect({
						url:'/static/resource/city.data.js',
						prov:"广东省", 
						city:"深圳市",
						dist:"南山区"
					}); 
				});				
				$("#customer").val($.getCookie('name'));
				$("#purinfo").slideDown(500);
				$("#pageContent").hide();
				$('.sontable [data-skuId]').each(function(i,v){
					if(v.value != ''){
						$(v).parent().html('<span data-skuId="'+$(v).attr('data-skuId')+'" data-goodsId="'+$(v).attr('data-goodsId')+'">'+$(v).val()+'</span>');
					}else{
						$(v).parent().parent().remove();
					}
				})
				$('.tr1 .sontable').each(function(i,v){
					if($(v).find('tr').length == 0){
						$(v).parents('tr.tr1').remove();
					}
				})

				$(el).text('提交订单').unbind('click').bind('click',_this.enorder);
			}
		},
		enorder:function(){
			var params = {
				cczxId:$.getCookie('cczxId'),
				shopId:$.getCookie('companyDmId'),
				townId:0
			};
			var ispost = true;
			$("input[type='text'],textarea,select").each(function(i,v){
				if($.trim($(v).val()) == ''){
					$(v).focus();
					layer.tips($(v).attr('placeholder'), $(v));
					ispost = false;
					return false;
				}
				params[this.id] = $(v).val();
			})
			if(!ispost)
				return false;
			params.shopPurchaseOrderItemList = [];
			$('.sontable [data-skuId]').each(function(i,v){
				params.shopPurchaseOrderItemList.push({skuId:$(v).attr('data-skuId'),goodsId:$(v).attr('data-goodsId'),purchaseNum:$(v).text()})
			})
			_R(_I.shop.purchaseAdd,params,'post',function(ret){
				if(ret.code ==0){
					layer.msg('添加成功', {
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
			});
		}
	};
	
	PurchaseList.fn.init.prototype = PurchaseList.fn;
});