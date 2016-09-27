 /**
 * tab 切换控件
 * @module  Tab
 * @author xjc
 */

// 选择页面添加搜索功能

var util = require('../common/util');
var outUtil = require('@plug/util');
var Widget = require('@plug/widget');
// 获取汉字首字母

function Tab() {

};

outUtil.inherits(Tab, Widget);

// 从表面看来，次组件，不能称之为组件。是用来切换状态的，简单点就是导航栏
// 切换嘛，点击切换菜单，来进行显示和隐藏

Tab.prototype.defaultOptions = {
    /**
     * 绑定的元素，任何包含 tab-content 的父元素，但是该容器下只能有一组 tab-content
     * @type {String}
     */
    container: '',
    /**
     * 切换的开关
     * @type {String}
     */
    tabs:'',
    /**
     * 切换的内容
     * @type {String}
     */
    tabContents:''
};

/**
 * 初始化
 * @param  {Object} options  用户选项
 * @param  {}
 */
Tab.prototype.init = function(options) {
    var self = this;
    // 添加用户选项
    self.initConfig(options, true);    // 这个就不用管了，东西太多也看不懂，反正就是为对象添加配置

    // 渲染模板
    if ($(self.container).length > 0) {
        self.render(true);             // 哪里来的渲染啊，这里感觉不需要渲染
    // 这里也没有取得模板，也没有获取数据，渲染什么啊
    }

    // 启动
    self.enableTab();
};

/**
 * 让 tab 开关起作用
 */
Tab.prototype.enableTab = function(){
    var self =  this;
    var $tabs = self.$container.find(self.tabs);
    var $content = self.$container.find(self.tabContents);

    $tabs.on('touchend', function(e) {
        e.preventDefault();
        $tabs.removeClass('active');
        $(this).addClass('active');
        $content.css('display', 'none');
        $content.eq($(this).index()).css('display', 'block');
    });
}

/**
 * 注册为 jquery 插件
 */
Widget.registerJQeuryPlug('ytabs', Tab);
