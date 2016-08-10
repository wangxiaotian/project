// 普通写法
(function(){
	var TYtable = function(){

	}
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
	window.tytable = {
		init : function(options){
            var tytable = new TYtable();
            tytable.init(options);
            return tytable;
		}
	}
})()