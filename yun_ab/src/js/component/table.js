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
            self.addOperation();
            self.render();
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
            var thdata = [],
                arr = self.cols,
                data,
                url = self.url;
            $.each(arr, function(index, val) {
                thdata.push(val.alias);
            })
            self.tabData.thData = thdata;
            Utils.getData(url, data, function(response) {
                var tdData = response.data;
                self.tabData.tdData = tdData;
            })
        }
        // 增加需要操作的数据
    TYtable.prototype.addOperation = function() {
            var self = this;
            self.$ops = self.operation;
            var opsData = [];
            $.each(self.$ops, function(index, val) {
                var opsStr = '<a href = "javascript:;" class = "operation-' + index + '">' + val.name + '</a>';
                opsData.push(opsStr);
                self.$container.on('click','.operation-' + index,function(){
                    // 这里如果直接向下面这样返回，第二次返回的时候就会覆盖第一次返回的内容;
                    // 循环绑定事件是没有问题的，出错是因为事件代理搞错了，没有绑定到相应的
                    // 元素上面
                	val.todo();
                })
            })
            self.tabData.opsData = opsData;

        }
        // 模板渲染
    TYtable.prototype.render = function() {
        var self = this;
        // 获取模板
        Utils.requireTmpl('table', function(tpl) {
            Utils.render({
                data: self.tabData,
                container_child: self.$input.find('.tableContainer'),
                tmpl: tpl
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
