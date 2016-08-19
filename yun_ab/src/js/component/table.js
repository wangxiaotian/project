// 普通写法
(function() {

    var TYtable = function() {

        }
        /*
         * 1、将一个dot模板写到一个组件里边，应该怎么写？安邦里的写法，
         *模板是一个单独的文件，用ajax请求的方式来来请求模板，中间隔了一层util工具类函数，
         *进行模板的请求和处理。这里也确实不适合写到组件里边，那样的话组件就不好阅读了，也
         *不利于组件和模板的维护。
         * 2、数据请求，通过ajax来请求
         * 3、在进行数据表格渲染时，涉及到两方面的数据，一个是表头数据，由由用户配置，一个
         * 是表格体数据，由后台获取，但在渲染时用到的是一个数据进行渲染的，so，要对两个数据
         * 进行处理，处理成一个数据，在用于渲染。
         * 4、在chrome里遇到一个问题，即点击浏览器回退按钮后，页面的渲染会丢失组件，并且在调试
         * 的时候，具有很多的不确定性，此时的代码在火狐和IE下是没问题的；然后：将调用的获取模板
         * 并渲染的函数放在获取数据的回调里面，问题就解决了
         * 5、涉及到状态储存的问题，例如：现在设置表格显示20条数据，然后点击编辑跳转页面，在点击
         * 浏览器的回退按钮返回，如果没有本地存储或者没有用到本地存储，那么表格渲染的时候会渲染10
         * 条数据，因为它渲染时的状态是初始化时的状态，并不记得select事件选择20条数据的状态，并且
         * 根据这个状态，好多东西都要更新，还是很复杂的；接下来了解本地存储吧
         * 
         */
    TYtable.prototype.configuration = {
        container: '',
        url: '',
        operation: '',
        // 表头每一列的信息
        cols: [{
            name: 'number',
            alias: '工号'
        }, {
            name: 'name',
            alias: '姓名'
        }, {
            name: 'department',
            alias: '部门'
        }, {
            name: 'role',
            alias: '工作'
        }]
    }
    TYtable.prototype.init = function(options) {
            var self = this;
            $.extend(true, this, self.configuration, options);
            // 先加载DOM框架
            self.initFrame();
            self.delData();
            self.pagingRender();
            self.trigger();
        }
        // 初始化框架，分为table框架和分页框架
    TYtable.prototype.initFrame = function() {
            var self = this;
            self.$container = $(self.container);
            var htmlstr = '<div class="table_content">\
                            <div class="tableContainer"></div>\
                            <div class="page"></div>\
                        </div>';
            self.$input = $(htmlstr);
            self.$input.appendTo(self.container)
        }
        // 处理数据
    TYtable.prototype.delData = function() {
            var self = this;
            self.tabData = {};
            self.thdata = [],
                arr = self.cols,
                data = '',
                url = self.url;
            $.each(arr, function(index, val) {
                self.thdata.push(val.alias);
            })
            self.tabData.thData = self.thdata;
            Utils.getData(url, data, function(response) {
                var tdData = response.data;
                self.tabData.tdData = tdData;
                
                self.addOperation();
                self.render();
            })
        }
        // 增加需要操作的数据
    TYtable.prototype.addOperation = function() {
            var self = this;
            self.$ops = self.operation;
            self.opsData = [];
            $.each(self.$ops, function(index, val) {
                var opsStr = '<a href = "javascript:;" class = "operation-' + index + '">' + val.name + '</a>';
                self.opsData.push(opsStr);
                self.$container.on('click','.operation-' + index,function(){
                    // 这里如果直接向下面这样返回，第二次返回的时候就会覆盖第一次返回的内容;
                    // 循环绑定事件是没有问题的，出错是因为事件代理搞错了，没有绑定到相应的
                    // 元素上面
                	val.todo();
                })
            })
            self.tabData.opsData = self.opsData;
        }
        // 模板渲染
    TYtable.prototype.render = function() {
        var self = this;
        // 获取模板
        Utils.requireTmpl('table', function(tpl) {
        	self.tpl = tpl;
            Utils.render({
                data: self.tabData,
                container_child: self.$input.find('.tableContainer'),
                tmpl: tpl
            })
        })
    }
        // 分页
    TYtable.prototype.pagingRender = function(){
    	var self = this;
    	Utils.requireTmpl('page1',function(tpl){
    		Utils.render({
    			data : '',
    			container_child : self.$input.find('.page'),
    			tmpl : tpl
    		})
    	})
    }
    TYtable.prototype.trigger = function(){
    	var self = this;
    	self.$page = self.$input.find('.page');
        // 这里我直接通过find方法查找select元素，找不到，先找到page，用事件代理继续绑定才可以
    	self.$page.on('change','.tytable-select',function(){
    		var pageNum = 2;
    		self.pagingRenderAgain(pageNum);
    	})
    }
    TYtable.prototype.pagingRenderAgain = function(n){
        var self = this;
        var url = '../apis/table3/table3-' + n + '.json';
        var data;
        Utils.getData(url,data,function(rep){
        	var pageData = {};
        	pageData.thData = self.thdata;
        	pageData.tdData = rep.data;
        	pageData.opsData = self.opsData;
            Utils.render({
            	data : pageData,
            	container_child : self.$input.find('.tableContainer'),
            	tmpl : self.tpl
            })
        })
    }
    
    // 暴露到全局
    window.tytable = {
        init: function(options) {
            var tytable = new TYtable();
            tytable.init(options);
            return tytable;
        }
    }
})()
