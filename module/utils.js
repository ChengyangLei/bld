/**
 * 工具类 （扩展到jQuery)
 * @author panbing 120728729@qq.com
 * @version 1.0 
 * @date 2016/05/17
 * @company ppsh.co
 */

define(function(require,exports,module){

	var $ = require('jquery');

	var	_utils = {
	    setCookie:function(name,value,time){
	    	var strsec = getsec(time);
			var exp = new Date();
			exp.setTime(exp.getTime() + strsec*1);
			document.cookie = name + "="+ escape (value) + ";path=/;expires=" + exp.toGMTString();
	    },
	    getCookie:function(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if(arr=document.cookie.match(reg))
				return unescape(arr[2]);
			else
				return null;
	    },
	    delCookie:function(name){
	    	var _this = this;
	    	var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval=_this.getCookie(name);
			if(cval!=null)
			document.cookie= name + "="+cval+";path=/;expires="+exp.toGMTString();
	    },
	    clsCookie:function(){
	    	var _this = this;
	    	var keys=document.cookie.match(/[^ =;]+(?=\=)/g); 
			if  (keys) { 
				for (var i = keys.length; i--;) 
				document.cookie=keys[i]+'=0;path=/;expires=' + new Date( 0).toUTCString();
			}
	    },
	    eventBind:function(self){
			$(document).on("click","[event-id]",function(){
				var event_id = $(this).attr('event-id');
				self[event_id](this);
			}); 
	    },
	     /**
         * 获取URL问号后面的值
         * @return 返回指定key的value
         */
        getParam: function (param) {
            var local = document.location.search.substring(1);
            var splits = local.split("&");
            for (var i = 0; i < splits.length; i++) {
                var sp = splits[i];
                if (sp.indexOf(param + "=") == 0) {
                    var val = sp.substring(param.length + 1);
                    return decodeURIComponent(val);
                }
            }
        },
        formatParams: function(params){
        	var urlParam = "?";
        	for(var key in params){
        		urlParam+=key+"="+encodeURI(params[key])+"&";
        	}
        	return urlParam.substring(0,urlParam.length-1);
        },
        /** 
		 * 和PHP一样的时间戳格式化函数 
		 * @param {string} format 格式 
		 * @param {int} timestamp 要格式化的时间 默认为当前时间 
		 * @return {string}   格式化的时间字符串 
		 */
        formatDate:function(format,timestamp){
        	return _formatDate(format,timestamp);
        },
        nodata:function(content){
        	var html = '<p class="nodata"><img src="/static/img/nodata.png" class="mr15" />我虽然很努力的请求，但是还是没有找到数据！<a href="javascript:;" onclick="location.reload()">重试</a></p>';
			document.getElementById(content).innerHTML = html;
        },
        listNodata:function(){
        	return '<p class="nodata"><img src="/static/img/nodata.png" class="mr15" />我虽然很努力的请求，但是还是没有找到数据！<a href="javascript:;" onclick="location.reload()">重试</a></p>';
        },
        upload:function(el){
        	var layer = require('layer');
        	layer.open({
				type: 2,
				title: '图片上传',
				shadeClose: true,
				shade: 0.5,
				area: ['350px', '250px'],
				content: '/module/upload/upload.html?id='+$(el).attr('data-val')
			});
        }
	};

	var getsec = function (str){
		var str1=str.substring(1,str.length)*1;
		var str2=str.substring(0,1);
		if (str2=="s")
		{
			return str1*1000;
		}
		else if (str2=="h")
		{
			return str1*60*60*1000;
		}
		else if (str2=="d")
		{
			return str1*24*60*60*1000;
		}
	}
	$.extend(_utils);

	function _formatDate(format, timestamp) { 
		var a, jsdate = ((timestamp) ? new Date(timestamp) : new Date()); 
		var pad = function(n, c) {  
			if ((n = n + "").length < c) {   
				return new Array(++c - n.length).join("0") + n;  
			} else {   
				return n;  
			} 
		}; 
		var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
		var txt_ordin = {
			1 : "st",
			2 : "nd",
			3 : "rd",
			21 : "st",
			22 : "nd",
			23 : "rd",
			31 : "st"
		}; 
		var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
		var f = {   // Day 
			  d: function() {
				return pad(f.j(), 2)
			},
			  D: function() {
				return f.l().substr(0, 3)
			},
			  j: function() {
				return jsdate.getDate()
			},
			  l: function() {
				return txt_weekdays[f.w()]
			},
			  N: function() {
				return f.w() + 1
			},
			  S: function() {
				return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'
			},
			  w: function() {
				return jsdate.getDay()
			},
			  z: function() {
				return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0
			},
			      // Week 
			  W: function() {   
				var a = f.z(),
				b = 364 + f.L() - a;   
				var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;   
				if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {    
					return 1;   
				} else {    
					if (a <= 2 && nd >= 4 && a >= (6 - nd)) {     nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");     
						return date("W", Math.round(nd2.getTime() / 1000));    
					} else {     
						return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);    
					}   
				}  
			},
			      // Month 
			  F: function() {
				return txt_months[f.n()]
			},
			  m: function() {
				return pad(f.n(), 2)
			},
			  M: function() {
				return f.F().substr(0, 3)
			},
			  n: function() {
				return jsdate.getMonth() + 1
			},
			  t: function() {   
				var n;   
				if ((n = jsdate.getMonth() + 1) == 2) {    
					return 28 + f.L();   
				} else {    
					if (n & 1 && n < 8 || !(n & 1) && n > 7) {     
						return 31;    
					} else {     
						return 30;    
					}   
				}  
			},
			      // Year 
			  L: function() {
				var y = f.Y();
				return (! (y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0
			},
			   //o not supported yet 
			  Y: function() {
				return jsdate.getFullYear()
			},
			  y: function() {
				return (jsdate.getFullYear() + "").slice(2)
			},
			      // Time 
			  a: function() {
				return jsdate.getHours() > 11 ? "pm": "am"
			},
			  A: function() {
				return f.a().toUpperCase()
			},
			  B: function() {    // peter paul koch: 
				   
				var off = (jsdate.getTimezoneOffset() + 60) * 60;   
				var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;   
				var beat = Math.floor(theSeconds / 86.4);   
				if (beat > 1000) beat -= 1000;   
				if (beat < 0) beat += 1000;   
				if ((String(beat)).length == 1) beat = "00" + beat;   
				if ((String(beat)).length == 2) beat = "0" + beat;   
				return beat;  
			},
			  g: function() {
				return jsdate.getHours() % 12 || 12
			},
			  G: function() {
				return jsdate.getHours()
			},
			  h: function() {
				return pad(f.g(), 2)
			},
			  H: function() {
				return pad(jsdate.getHours(), 2)
			},
			  i: function() {
				return pad(jsdate.getMinutes(), 2)
			},
			  s: function() {
				return pad(jsdate.getSeconds(), 2)
			},
			   //u not supported yet 
			      // Timezone 
			   //e not supported yet 
			   //I not supported yet 
			  O: function() {   
				var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);   
				if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
				else t = "+" + t;   
				return t;  
			},
			  P: function() {
				var O = f.O();
				return (O.substr(0, 3) + ":" + O.substr(3, 2))
			},
			   //T not supported yet 
			   //Z not supported yet 
			      // Full Date/Time 
			  c: function() {
				return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()
			},
			   //r not supported yet 
			  U: function() {
				return Math.round(jsdate.getTime() / 1000)
			} 
		};    
		return format.replace(/[\\]?([a-zA-Z])/g,
		function(t, s) {  
			if (t != s) {    // escaped 
				   ret = s;  
			} else if (f[s]) {    // a date function exists 
				   ret = f[s]();  
			} else {    // nothing special 
				   ret = s;  
			}  
			return ret; 
		});
	}
});