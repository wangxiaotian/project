(function(){
	/*这是另外一种写法，技术实现上很简单。操作实现上为先定义一个对象，
	然后为这个对象扩展方法，每一个扩展的方法都是一个构造函数。此方法的好处就是
	可以将组件的调用汇集到一个入口上，用一个入口来调用很多扩展的功能，类似于命名空间的
	那种东西吧*/
	var TYinput = {
	};
	(function(){
		// 带lable标签的文本输入框
		var Text = TYinput.Text = function(){

		}
		Text.prototype.configuration = {
			container : ''
		}
		Text.prototype.init = function(options){
			var self = this;
			$.extend(true,this,self.configuration,options);

		}
		Text.prototype.initFrame = function(){
			var self = this;
			var str = '<div class = "from-group"></div>'
		}
        Text.prototype.createDom = function(){
        	var self = this;
        	var str = ''
        }
	})()
})()