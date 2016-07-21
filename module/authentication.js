define(function(require,exports,module){
	require('utils');
	var $ = require('jquery');
	if($.getCookie('status') != '0' || $.getCookie('status') == null){
		location.href="/app/login.html";
	}
})