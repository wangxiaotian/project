// 普通写法
(function(){
	
	var TYtable = function(){

	}
	/*
	 * 1、将一个dot模板写到一个组件里边，应该怎么写？安邦里的写法，
	 *模板是一个单独的文件，用ajax请求的方式来来请求模板，中间隔了一层util工具类函数，
	 *进行模板的请求和处理。这里也确实不适合写到组件里边，那样的话组件就不好阅读了，也
	 *不利于组件和模板的维护。
	 * 2、数据请求，通过ajax来请求
	 */
	TYtable.prototype.configuration = {
		container : '',
	}
	TYtable.prototype.init = function(options){
		var self = this;
		$.extend(true,this,self.configuration,options);
		// 先加载DOM框架
		self.initFrame();
	}
	// 初始化框架，分为table框架和分页框架
	TYtable.prototype.initFrame = function(){
        var self = this;
        var htmlstr =  '<div class="table_content">\
                            <div class="table"></div>\
                            <div class="page"></div>\
                        </div>';
        $(self.container).html(htmlstr);
	}
	// 获取数据
	TYtable.prototype.getData = function(){
		var self = this;
		$.ajax({
			type : 'GET',
			url : '',
			dataType : 'json',
			/*一般情况下，请求数据的回调函数都有很多内容，故，请求数据的
			函数一般都写作一个公共的接口，以供调用*/
			success : function(rep){
                
			}
		}) 
	}
	// 暴露到全局
	window.tytable = {
		init : function(options){
            var tytable = new TYtable();
            tytable.init(options);
            return tytable;
		}
	}
})()