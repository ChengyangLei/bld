define(function(require, exports, module) {

	//所有页面必须请求该模块验证身份
	require('authentication');

	require('utils');
    var $ = require('jquery');
    	layer = require('layer'),
    	_R = require('request'),
    	_I = require('interface');
    layer.config({
	  	path: '/module/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
	});

    var Index = window.Index = function(){
		return new Index.fn.init();
	};

	module.exports = Index;
	
	Index.fn = Index.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		load:function(){
			var _this = this;		
			$("[event-id]").click(function(){
				var event_id = $(this).attr('event-id');
				_this[event_id](this);
			});
			_this.menuExpansion();
			_this.getInfo();
		},
		menuExpansion:function(){
			setTimeout(setLeftMenuHg(), 1000);
			$(".leftMenu-items-ul li").each(function() {
				$(this).on("click", function() {
					$(".leftMenu-active .subItmes").css({
						"padding": "0",
						"height": "0px"
					})
					$(".leftMenu-active").removeClass("leftMenu-active");
					$(this).addClass("leftMenu-active");
					setLeftMenuHg();
				});
			});

			$(".subItmes-span").on("click",function(){
				$(".subItmes-span").removeClass("subItmes-active");
				$(this).addClass("subItmes-active");
			});

			function setLeftMenuHg() {
				var hg = $(".leftMenu-active .subItmes .subItem").height();
				$(".leftMenu-active .subItmes").css({
					"padding": "12px 0",
					"height": (hg + 24) + "px"
				})
			}
		},
		getInfo:function(){
			var ret = {name:$.getCookie('name')};
			$("[data-store]").each(function(i,v){
				var storeId = $(this).attr('data-store');
				$(this).html(ret[storeId]);
			})
		},
		logout:function(){
			$.clsCookie();
			location.href="/app/login.html";
			// _R(_I.logout,{},'post',function(ret){
			// 	if(ret.code ==0){
			// 		$.clsCookie();
			// 		location.href="/app/login.html";
			// 	}else{
			// 		layer.msg(ret.msg, {icon: 2,time:1500}); 
			// 	}
			// })
		},
		chooseStatusShow:function(){
			//自定页
			layerStatus = layer.open({
			  type: 1,
			  skin: 'layui-layer-st1',
			  closeBtn: 0,
			  shift: 2,
			  shadeClose: true,
			  title:'更改营业状态',
			  content: $("[layer-dom='chooseStatus']")
			});
		},
		chooseStatus:function(t){
			_R(_I.shop.updateStatus+$.formatParams({dmId:$("[event-id='chooseStatusShow']").attr('event-val'),status:$(t).attr('data-val')}),'','get',function(ret){
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
			});
		}
	};
	
	Index.fn.init.prototype = Index.fn;
});