/**
 * ydisplay 展现数据
 * ydisplay 包含的内容中可以写模板的语法
 * @module  yform
 * @author xjc
 */

/*
 * 以这个为突破口，主要目标是熟悉这种组件的架构
 * 1、提取了组件的公共方法，将组件的公共方法写入了单独的工具集，通过一种机制
 * 来进行引用，这就有一个要求，比如说initConfig，在调用工具集的时候，工具集里
 * 定义的配置项对象名要和引用组件的配置项对象名相同，也可以说所有的配置项
 * 对象名都相同，如此还牵扯另一个问题，命名规范和管理
 * 2、其实吧，单论单个页面写组件挺简单，如此复杂，是考虑了很多情况发生的可能性
 */
var util = require('../common/util');
var outUtil = require('@plug/util');  // 这两个组件是在@plug下面的
var Widget = require('@plug/widget');

function Display() {
    /**
     * 模板
     * @type {String}
     */
    this.template = '';
};
// 这个不太对，outUtil是作为一个存储值的变量，值是引入的文件，变量可以调用方法？
outUtil.inherits(Display, Widget);        // 不懂


Display.prototype.defaultOptions = {
    /**
     * 绑定的元素 container 指定 form
     * @type {String}
     */
    container: '',
    /**
     * 数据的地址
     * @type {String}
     */
    url: '',
    /**
     * 是否立即显示
     * @type {Boolean}
     */
    immediately: true,
    /**
     * 数据
     * @type {[type]}
     */
    data: null,
    /**
     * 数据的 url
     * @type {String}
     */
    url: '',
    /**
     * url 的参数
     * @type {String}
     */
    params: {
        page:undefined,
        size:undefined,
        status:undefined,
        id:undefined,
        productName:undefined,
        category:undefined,
        isZero:undefined,
        weChatStatus:undefined,
        orderId:undefined,
        phoneNumber:undefined,
        mallType:undefined
    },
    /**
     * 是否显示等待图标
     * @type {Boolean}
     */
    wait:false
};

/**
 * 初始化
 * @param  {Object} options  用户选项
 * @param  {}
 */
Display.prototype.init = function(options) {
    var self = this;
    // 添加用户选项
    // 是继承的widget.js方法
    self.initConfig(options, true);   // 太复杂，看不太明白

    // 获取模板
    self.getTemplate();

    // 对内容进行隐藏
    self.$container.contents().remove();

    // 获取数据并进行展示
    if(self.immediately){
        self.getData(function(data){
            self._display(data);
        });
    }

    // 初始化插件
    self.initEvent();
};

/**
 * 从元素中获取模板
 */
Display.prototype.getTemplate = function() {     // 获取模板，从dom中拿
    var self = this;
    // 可能是以为微信端的样式太多，不易统一，故将模板放在组件外边，
    // 这个就是所谓的细粒度吧，不知在数据渲染方面会不会增加难度，
    // 其实单个页面的模板渲染并不复杂，只差数据。写成组件可能主要是应对多页面时
    // 的情况，也确实可以将获取数据的方法提取出来用
    self.template = self.$container.html();
}

/**
 * 获取数据
 * @param  {Function} cb 接受数据的回调函数
 */
Display.prototype.getData = function(cb) {     // 获取数据
    var self = this;

    // 校验参数
    if (typeof cb !== 'function') {
        return;
    }

    // 有 data 则直接返回 data 
    // if (self.data !== null) {
    //     cb(self.data);
    //     return;
    // }
    // 显示 loading 图
    util.wait();
    // 这里有一个问题，一个函数的执行，如何控制它的执行时间呢
    // 除了用定时器
    // 没有 data 则从 url 获取数据
    util.getData(self.url, self.params, function(response) {
        // 隐藏 loading 图
        util.waitend();

        if (response.status != 0) {
            self.$container.trigger('ydisplay.error', response);
            return;
        }
        cb(response.data);
        
    }, function(response) {
        // 这个是错误时的回调
        // 隐藏 loading 图
        util.waitend();
        self.$container.trigger('ydisplay.error', response);
    });
}
/**
 * 对数据进行渲染
 * @return {[type]} [description]
 */
Display.prototype._display = function(data) {      // 渲染模板
    var self = this;
    // 获取模板函数
    var tplFn = $.dot.template(self.template);
    // 清空
    self.$container.empty();
    // 渲染
    self.$container.html(tplFn(data));
    // 显示
    self.$container.children().show();
    // 触发事件
    // 这里的trigger加载的事件是哪里来的啊
    self.$container.trigger('ydisplay.displayed', {data:data});
    // 显示 display 容器
    self.$container.css({
        'visibility':'visible'
    });
    // 懒加载图片
    self.lazyloadImg();
}

Display.prototype.initEvent = function(){     // 毛的事件啊，都哪里来的啊？
    var self = this;
    // 这个事件又是哪里来的啊
    self.$container.on('ydisplay.displayed', function(){
        // 在显示完成之后初始化其中的插件
        // 其中的插件？渲染出来的模板里的插件？
        Widget.initJQueryPlug(self.$container);
    });
}

/**
 * 设置参数
 */
Display.prototype.setParams = function(params) {    // 这个是毛的参数啊？
    var self = this;
    if(!params){
        return;
    }
    $.extend(self.params, params);
}

/**
 * 进行展示
 */
Display.prototype.display = function(param, cb){   // 这里到底展示的是个什么鬼啊？
    // 怎么还有展示？按我的理解模板已经渲染完了，dom层可以结束了
    var self = this;
    
    if(typeof param === 'object'){
        self._display(param);
    }else{
        self.getData(function(data){

            // 此处有坑
            if(typeof param === 'function'){
                data = param(data);
            }
            self._display(data);
            if(typeof cb === 'function'){
                cb();
            };

        });
    }

}

Display.prototype.lazyloadImg = function(){        // 这是个不重要的功能，可以先不看
    var self = this;
    self.$container.find('[data-src]').each(function(){
        // 这是个锦上添花的功能，与图片预加载有异曲同工之妙，先不看这个
        window.lzd(this);
    })
}

/**
 * 注册为 jquery 插件
 */
Widget.registerJQeuryPlug('ydisplay', Display);
