(function() {
    /*这是另外一种写法，技术实现上很简单。操作实现上为先定义一个对象，
    然后为这个对象扩展方法，每一个扩展的方法都是一个构造函数。此方法的好处就是
    可以将组件的调用汇集到一个入口上，用一个入口来调用很多扩展的功能，类似于命名空间的
    那种东西吧*/
    /*
     * 1、在生成dom后，最好是通过什么样的方式来获取生成的dom中的元素？才不至于与后来的存在命名冲突
     * 2、获取组件内的dom时，不能通过获取类名或者id名来获取，这样会造成在实例化多个组件时，获取的元素会相关联，不能达到
     * 单独组件初始化的效果。解决方法：将字符串包装成jQuery对象，用这个包装后的对象调用find（）方法获取后代对象，真的可以啊。
     * 用$转换成jQuery对象时，有执行创建元素节点的过程;可以用class类名，重复也没问题
     * 3、即样式问题，该怎么写，是写入dom中，还是写类名，在外部文件中引入样式。
     * 这个问题写到顶级作用域里
     * 4、为什么要采用replaceWith的方法？这种方法可以使得在dom里边配置参数，并且替换之后不留痕迹
     */
    // 文本输入组件
    var TYinput = {};
    (function() {
        /*
         * 此组件即是简单的操作dom，没有涉及逻辑，没有涉及与服务器交互，很简单
         * 只封装了dom，配置选项来改变内容和基本的样式
         */
        // 带lable标签的文本输入框
        var Text = TYinput.Text = function() {

        }
        Text.prototype.configuration = {
            // 容器
            container: '',
            // 默认值
            placeholder: '',
            // 文本框长度值
            length: 9,
            // lable长度值
            labelLength: 3,
            // 要有一个name属性，在调用jQuery插件进行验证时会用到
            name : ''
        }
        Text.prototype.init = function(options) {
            var self = this;
            $.extend(true, this, self.configuration, options);
            self.getValue();
            self.createDom();
            self.placeDom();
        }
        Text.prototype.getValue = function() {
                var self = this;
                self.container = $(self.container);
                self.label_value = self.container.data('alias');
                self.placeholder_value = self.placeholder;
            }
            // 简单的组件就不需要dom外架了
        Text.prototype.createDom = function() {
                var self = this;
                // 水平表单
                self.str = '<div class = "form-group">\
                            <label class = "control-label col-xs-' + self.labelLength + '">' + self.label_value + '</label>\
                            <div class = "col-xs-' + self.length + '">\
                                <input class = "form-control" type = "text" placeholder = "' + self.placeholder_value + '" name = "' + self.name + '">\
                            </div>\
                       </div>'

            }
            // 之前的方式大多是在容器内插入dom元素append()方法，此处是用内容代替容器元素replaceWidth()方法
        Text.prototype.placeDom = function() {
            var self = this;
            self.container.replaceWith(self.str);
        }
    })();
    // 文本域输入组件
    (function() {
        /*
         * 此组件与input组件相同，主要的部分还是生成dom,根据配置项来改变dom的一些样式或者结构，
         * 将css样式值作为入口来进行配置操作样式的。另外，附加了一点小逻辑，即验证字符数的输入。
         * 此处牵扯到一个问题，即样式问题，该怎么写，是写入dom中，还是写类名，在外部文件中引入样式。
         * 这个问题写到顶级作用域里
         */
        var Textarea = TYinput.Textarea = function() {

        }
        Textarea.prototype.configuration = {
            container: '',
            height: 100,
            alias: '',
            labelLength: 3,
            length: 9,
            maxlength: 500,
            name: ''
        }
        Textarea.prototype.init = function(options) {
            var self = this;

            $.extend(true, this, self.configuration, options);
            self.getValue();
            self.createDom();
            self.initStatus();
            self.computeNumber();
        }
        Textarea.prototype.getValue = function() {
            var self = this;
            self.container = $(self.container);
        }
        Textarea.prototype.createDom = function() {
            var self = this;
            var str = '<div class = "form-group" style = "">\
                            <label style = "" class = "control-label col-xs-' + self.labelLength + '">' + self.alias + '</label>\
                            <div class = "col-xs-' + self.length + '">\
                                <textarea id = "inp" class = "form-control" style = "height:' + self.height + 'px" name = "' + self.name + '"></textarea>\
                                <p id = "war1" style = "color:red">还剩<span class = "num1"></span>个字符，最多只能输入<span class = "num2"></span>个字符</p>\
                                <p id = "war1_space" style = "height:20px;"></p>\
                            </div>\
                        </div>'
                // 这个地方的获取元素，安邦里边是把字符串变为了dom对象，然后在获取
            var $input = $(str);
            self.$input = $input;
            self.container.replaceWith($input);
            self.warP = $input.find('#war1');
            self.war1Space = $input.find('#war1_space');
            self.num1 = $input.find('span.num1');
            self.num2 = $input.find('span.num2');
            self.textarea = $input.find('textarea');
        }
        Textarea.prototype.initStatus = function() {
            var self = this;

            self.warP.hide();
        }
        Textarea.prototype.computeNumber = function() {
            var self = this;
            // 执行进不到事件里边，很奇怪。靠，id名拼错
            self.textarea.on('input', function() {
                var num = $(this).val().length;
                var Tnum = self.maxlength;
                if (num <= 0) {
                    self.war1Space.show();
                    self.warP.hide();
                } else {
                    self.war1Space.hide();
                    self.warP.show();
                    self.num1.text(self.maxlength - num);
                    self.num2.text(self.maxlength);
                }
            })
        }
    })();
    // 地区选择框组件
    /*(function(){
        var AreaSelector = TYinput.AreaSelector = function() {

        }
        AreaSelector.prototype.configuration = {
            container: ''
        }
        AreaSelector.prototype.init = function(options) {
            var self = this;
            $.extend(true, this, this.configuration, options);
        }
        AreaSelector.prototype.createDom = function(){
            var self = this;
            var str = ""
        }
    })()*/
    // 下拉选择组件
    (function(){
        
        /*
         * 这是第一个应用到数据请求模板和数据来完成dom的组件，遇到的问题如下：
         * 1、定义数据获取函数，由于要定义回调以及复用性问题，需要在公共工具集里定义
         * 公共方法。
         * 2、数据获取转化问题，可能不具有普遍性；这里遇到的问题就是dot模板在外部引用时，
         * 它返回的是一个匿名函数，不是html。解决办法：看调试器信息，这个匿名函数返回了一个
         * 加载数据后的字符串，如果没有数据，它返回的是一个空字符串，即给它传递一个数据并让
         * 它执行，就能得到想要的dom
         */

        var Selector = TYinput.Selector = function(){

        }
        Selector.prototype.configuration = {
            container : '',
            alias : '',
            length : 10,
            labelLength : 2,
            dataSource : '',       /*安邦里边这里定义了两种形式，一种是数组，另一种是url，这里先写一种*/
            defaultOption : '',
            name : ''
        }
        Selector.prototype.init = function(options){
            var self = this;
            $.extend(true,this,self.configuration,options);
            self.initConfig();
            self.createDom();
        }
        Selector.prototype.initConfig = function(){
            var self = this;
            self.$container = $(self.container);

        }
        Selector.prototype.createDom = function(){
            var self = this;
            var str = '<div class = "form-group">\
                            <label class = "control-label col-xs-' + self.labelLength + '">' + self.alias + '</label>\
                            <div class = "col-xs-' + self.length + '">\
                                <select class = "form-control">\
                                <option selected>' + self.defaultOption + '</option>\
                                </select>\
                            </div>\
                        </div>'
            self.$input = $(str);
            self.$container.replaceWith(self.$input);
            // 获取模板并渲染数据
            Utils.requireTmpl('selector',function(tpl){
                // 模板地址
                console.log(tpl);
                var url = self.dataSource;
                var optiondata;
                var data,error;
                // 已经得到了模板，接下来获取数据
                Utils.getData(url,'',function(response){
                    console.log('已得到json数据');
                    if(response.status !== 0) {
                        console.log('获取下拉框数据失败');
                        return;
                    };
                    optiondata = response.data;
                    // 已经得到了数据，渲染数据到模板
                    Utils.render({
                        tmpl : tpl,
                        data : optiondata,
                        container_child : self.$input.find('select')
                    });
                })
            })
        }
    })();
    // 日期选择组件
    (function(){
        var TYdatePicker = TYinput.TYdatePicker = function(){

        }
        TYdatePicker.prototype.configuration = {
            container : '',
            alias : '',
            length : ''
        }
        TYdatePicker.prototype.init = function(options){
            var self = this;
            $.extend(true,this,self.configuration,options);
            self.initFrame();
            self.initPlug();
        }
        TYdatePicker.prototype.initFrame = function(){
            var self = this;
            self.$container = $(self.container);
            var dom = '<div class = "form-group">\
                        <label class = "">' + self.alias + '</label>\
                        <div class = "input-group">\
                            <input class = "form-control date-picker" name = "dateStart" \
                            type = "text" placeholder = "请选择开始日期">\
                            <span class = "input-group-addon">天</span>\
                        </div>\
                        <div class = "input-group">\
                            <input class = "form-control date-picker" name = "dateStart" \
                            type = "text" placeholder = "请选择开始日期">\
                            <span class = "input-group-addon">云</span>\
                        </div>\
                    </div>';
            self.$domhtml = $(dom);
            self.$container.replaceWith(self.$domhtml);
        }
        TYdatePicker.prototype.initPlug = function(){
            var self = this;
            var picker = $(self.container).find('.date-picker').datepicker({
                autoclose : true,
                todayHightlight:true,
                language : 'zh-cn'
            })
            // 添加value 什么鬼
            if(!!self.value){
                picker.datepicker('setData',self.value);
            }
            self.picker = picker;
        }
        /*
         * 设置value 值，是个什么鬼
         */
        TYdatePicker.prototype.setValue = function(value){
            var self = this;
            self.picker.datepicker('setDate',value);
        }
        /*
         * 获取value值，又是个什么鬼
         */
        TYdatePicker.prototype.getValue = function(value){
            var self = this;
            return self.picker.datepicker('getDate');
        }
        TYdatePicker.prototype.on = function(eventName,handler){
            var self = this;
            self.picker.datepicker().on(eventName,handler);
        }
        /*
         * 设置起始日期
         */
        TYdatePicker.prototype.setStartDate = function(value){
            var self = this;
            self.picker.datepicker('setStartDate',value);
        }
        /*
         * 设置结束日期
         */
        TYdatePicker.prototype.setEndDate = function(value){
            var self = this;
            self.picker.datepicker('setEndDate',value);
        }
    })();
    // 暴露到全局
    window.tyinput = {
        initText: function(options) {
            var tyinput = new TYinput.Text();
            tyinput.init(options);
            return tyinput;
        },
        initTextarea: function(options) {
            var tytextarea = new TYinput.Textarea();
            tytextarea.init(options);
            return tytextarea;
        },
        initSelector: function(options){
            var tyselector = new TYinput.Selector();
            tyselector.init(options);
            return tyselector;
        },
        initDatePicker: function(options){
            var tydatepicker = new TYinput.TYdatePicker();
            tydatepicker.init(options);
            return tydatepicker;
        }
    };
})()
