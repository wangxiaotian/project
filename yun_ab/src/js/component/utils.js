/*
 * 这里定义工具类，一些经常用到的公共方法，因为它是直接
 * 调用其单个方法的，每个方法之间没有什么联系，故，写成
 * 对象的形式，调用的时候直接以对象方法的形式进行调用
 */
(function() {
    window.Utils = {};
    // 方法相互之间没有联系，不需要公共配置项，不需要添加
    // 原型。

    // 通用获取数据的方法
    Utils.getData = function(url,data,callback) {
        // url 要进行编码，data要进行转化，为之字符串
        var encodeUrl = encodeURI(url);
        if (typeof data === 'object') {
            data = $.param(data);
        }
        data = encodeURI(data);
        $.ajax({
            type: 'GET',
            url: encodeUrl,
            data: data,
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function(response) {
                if (!response) {
                    return;
                }
                try {
                    $.isPlainObject
                } catch (e){
                    console.log('数据解析错误！');
                    if(typeof error === 'function'){
                        error.apply(this,arguments);
                    } else {
                        alert('数据解析错误')
                    }
                    return;
                }
                // 代理，当 status 为 2 的时候，跳转到登录页面，所有异步请求都
                // 如此,安邦有这样的需求，这里先不写
                callback(response);
            },
            error : function(){
                if(typeof error === 'function'){
                    error.apply(this,arguments)
                } else {
                    alert('操作失败，请稍后再试');
                }
            }
        })
    }
    // 获取模板
    Utils.requireTmpl = function(tmpl,cb){
        var url = 'templates/' + tmpl + '.html';
        $.ajax({
            type : 'GET',
            url : url,
            dataType : 'text',
            success : function(rep){
                console.log('已取得模板数据');
                return cb(doT.template(rep));
            }
        })
    }
    // 渲染模板
    Utils.render = function(cfg){
        var self = this,
            dom = '',
            _data = cfg.data,
            _container = cfg.container_child,
            callback = cfg.callback,
            _tmpl;
        var teststr = cfg.tmpl;
        _tmpl = doT.template(cfg.tmpl);
        // 过滤一下格式
        if(_tmpl){
            dom = self.renderHtml($.trim(_tmpl(_data)),_container);
        } else {
            console.log('对应的模块不存在');
        }
        // 根据情况执行callback方式(原文描述)
        /*callback && callback.call(this,{
            data : _data,
            dom : dom
        })*/
        console.log('render函数执行到底了');
    }
    // 这里是一个添加dom到容器的操作，单独抽出来了，也可以
    Utils.renderHtml = function(tmpl,context){
        var ele = $(context);
        return $(tmpl).appendTo(ele);
    }
})()
