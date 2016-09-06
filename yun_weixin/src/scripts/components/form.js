(function(){
	var TYform = function(){

	}
    /*
     * 1、关于组件内如何取得外部dom对象的问题，这个实在是太简单了，可以
     * 在配置项内直接取得，并传给组件，如此就好。由此类推，对于一些带有
     * 必须功能的按钮或者其它dom对象，比如说表单提交的，可直接在配置项
     * 里面配置
     * 2、
     */
	TYform.prototype.configuration = {
		contianer : '',
		action : '',
		validate : {},
        submitButton : '',
        success : function(){},
        error : function(){}
	}
	TYform.prototype.init = function(options){
		var self = this;
		$.extend(true,this,this.configuration,options);
        self.initPlug();
        self.initSubmitBtn();
	}
	TYform.prototype.initPlug = function(){
		var self = this;
		self.$container = $(self.container);
        var rules = self.validate.rules;
        var messages = self.validate.messages;
        self.validateFunc = self.$container.validate({
            rules : rules,
            messages : messages,
            errorPlacement : function(error,element){
            	error.insertAfter(element.parent())
            }
        })
	}
	TYform.prototype.initSubmitBtn = function(){
		var self = this;
		self.$submitBtn = $(self.submitButton);
		self.$submitBtn.on('click',function(){
			var validated = self.$container.valid();
			
			
		})
	}
	window.tyform = {
		initForm : function(options){
			var tyform = new TYform();
			tyform.init(options);
			return tyform;
		}
	}
})()