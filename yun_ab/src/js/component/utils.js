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
                callback(response);
            },
            error : function(){
                if(typeof error === 'function'){
                    error.apply(this,arguments)
                } else {
                    alert('获取数据失败，请调试');
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
            _data = cfg.data,
            _container = cfg.container_child,
            _tmpl;
        // 渲染一次只渲染一个数据，所以之前的dom要清空
        _container.html('');
        _tmpl = (cfg.tmpl)(_data);
        self.renderHtml(_tmpl,_container);
    }
    // 这里是一个添加dom到容器的操作，单独抽出来了，也可以
    Utils.renderHtml = function(tmpl,context){
        var ele = $(context);
        return $(tmpl).appendTo(ele);
    }
})()
