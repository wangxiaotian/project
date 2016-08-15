/*
 * 这里定义工具类，一些经常用到的公共方法，因为它是直接
 * 调用其单个方法的，每个方法之间没有什么联系，故，写成
 * 对象的形式，调用的时候直接以对象方法的形式进行调用
 */
(function(){
	window.Utils = {};
	// 方法相互之间没有联系，不需要公共配置项，不需要添加
	// 原型。
	Utils.getData = function(url,data,callback,error){
		// url 要进行编码，data要进行转化，为之字符串
        var encodeUrl = encodeURI(url);
        if(typeof data === 'object'){
        	data = $.param(data);
        }
        data = encodeURI(data);
        $.ajax({
        	type : 'GET',
        	url : encodeUrl,
        	data : data,
        	dataType : 'json',
        	contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
        	success : function(rep){
                if(!rep){
                	return;
                }
                try()
        	}
        })
	}
})()