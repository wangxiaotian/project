var util = exports;

// 是否处于等待之中
var waiting = false;

// 这里也是一个工具集，还不知此工具集与@plug下面的工具集有何不同之处

/**
 * @func getData
 * @desc 异步获取数据
 * @param {string} url 异步请求的地址
 * @param {object} data 请求的参数
 * @param {function} callback 回调函数
 * @returns {boolean}
 * @example
 * Common.getData("/test",“{}”,function(data){})
 */
util.getData = function(url, data, callback, error) {
    // 这个基本上和PC端的是一样的，这里更加完善了
    var encodeUrl = encodeURI(url);
    // 如果data 是对象 则序列化之
    if (typeof data === 'object') {
        data = $.param(data);
    }
    // 对 data 在进行一次编码
    data = encodeURI(data);
    $.ajax({
        type: "GET",
        data: data,
        url: encodeUrl,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function(rep) {
            // debug 模式开启
            if (window.debug) {
                var message = '';
                message += 'getData, ';
                message += 'url:' + url + ', ';
                message += 'params:' + JSON.stringify(data);
                message += 'response:' + JSON.stringify(rep);
                alert(message);
            }
            /*这里的ajaxLog又是个什么鬼？为什么要搞这么多的引用*/
            util.ajaxLog({
                request: 'getData',
                url: url,
                params: JSON.stringify(data),
                response: JSON.stringify(rep)
            });
            if (!rep) {
                return;
            }
            try {
                $.isPlainObject(rep);
            } catch (e) {
                console.log("数据解析错误!");
                if (typeof error === 'function') {
                    error.apply(this, arguments);
                }
                return;
            }
            // 这里apply是调用自身的意思，具体的细节不清楚
            callback.apply(this, arguments);
        },
        error: function(rep) {
            // debug 模式开启
            if (window.debug) {
                var message = '';
                message += 'getData, ';
                message += 'url:' + url + ', ';
                message += 'params:' + JSON.stringify(data);
                message += 'response:' + JSON.stringify(rep);
                alert(message);
            }
            util.ajaxLog({
                request: 'getData',
                url: url,
                params: JSON.stringify(data),
                response: JSON.stringify(rep)
            });
            if (typeof error === 'function') {
                error.apply(this, arguments);
            }
        }
    });
};
/**
 * @desc 异步获取数据
 * @param {string} url 异步请求的地址
 * @param {object} data 请求的参数
 * @param {function} callback 回调函数
 * @returns {boolean}
 * @example
 * Common.posttData("/test",“{}”,function(data){})
 */
util.postData = function(url, data, callback, error) {
    /**
     * 手动调用 ajax 请求，加上 token 验证
     * 手动发送的时候必须传入 data 为对象
     */
    if ((typeof data === 'object') && !data.csrfToken) {
        data.csrfToken = $("[name=csrfToken]").val();
    }
    var encodeUrl = encodeURI(url);
    $.ajax({
        type: "POST",
        data: data,
        url: encodeUrl,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function(rep) {
            // debug 模式开启
            if (window.debug) {
                var message = '';
                message += 'postData, ';
                message += 'url:' + url + ', ';
                message += 'params:' + JSON.stringify(data);
                message += 'response:' + JSON.stringify(rep);
                alert(message);
            }
            if (!rep) {
                return;
            }
            try {
                $.isPlainObject(rep);
            } catch (e) {
                console.log("数据解析错误!");
                if (typeof error === 'function') {
                    error.apply(this, arguments);
                }
                return;
            }
            callback.apply(this, arguments);
        },
        error: function(rep) {
            // debug 模式开启
            if (window.debug) {
                var message = '';
                message += 'postData, ';
                message += 'url:' + url + ', ';
                message += 'params:' + JSON.stringify(data);
                message += 'response:' + JSON.stringify(rep);
                alert(message);
            }
            if (typeof error === 'function') {
                error.apply(this, arguments);
            }
        }
    });
};

/**
 * 设置本地数据
 * @param {String} key    数据名
 * @param {Object} value  数据值
 * @param {Object} expiry 过期时间,以毫秒为单位
 */
util.setLocalData = function(key, value, expiry) {
    // 判断 value 是否为 plain object
    if (!$.isPlainObject(value)) {
        alert('参数错误， 传入的 value 不是 plain object');
        return;
    };

    // 包装数据
    // 创建包装，并加入过期时间的信息
    var wrap = {};
    // 存储时间
    wrap.saveTime = Date.now();
    wrap.expiry = expiry;
    wrap.value = value;

    // 将数据值序列化
    wrap = JSON.stringify(wrap);

    // 将序列化的值存入本地
    localStorage.setItem(key, wrap);
};
/**
 * 获取本地数据
 * @param  {String} key  数据名
 */
util.getLocalData = function(key) {
    // 获取本地的值
    var wrap = localStorage.getItem(key);
    // 判断是否存在
    if (!wrap) {
        return null;
    }

    // 解包数据
    wrap = JSON.parse(wrap);
    // 判断是否有保质期
    if (!!wrap.expiry) {
        // 判断是否过期,如果过期，返回 null
        if (wrap.saveTime + wrap.expiry < Date.now()) {
            return null;
        }
    }

    // 转化为 json 对象
    return wrap.value;
};

/**
 * 设置本地数据
 * @param {String} key    数据名
 * @param {Object} value  数据值
 */
util.setSessionData = function(key, value) {
    // 将数据值序列化
    var valueSer = JSON.stringify(value);
    // 将序列化的值存入本地
    sessionStorage.setItem(key, valueSer);
};

/**
 * 获取本地数据
 * @param  {String} key  数据名
 */
util.getSessionData = function(key) {
    // 获取本地的值
    var valueSer = sessionStorage.getItem(key);
    // 判断是否存在
    if (!valueSer) {
        return null;
    }
    // 转化为 json 对象
    return JSON.parse(valueSer);
};

/**
 * @func alert
 * @desc 弹窗
 * @param cfg.title {string} 弹窗标题
 * @param cfg.content {string} 弹窗内容
 * @param cfg.callback {function} 回调函数，可以为空
 * @example
 * util.alert({
 *     title:"标题",
 *     content:"内容",
 *     callback:function(){
 *         alert("确定");
 *     }
 * });
 */
util.alert = function(cfg) {
    if (!cfg.title) {
        cfg.title = '消息';

    }
    if (!cfg.btn) {
        cfg.btn='确定';
    };
    var callback = cfg.callback || function() {};

    $('body').append('<div class="weui_dialog_alert"><div class="weui_mask"></div></div>');
    var dialog = '' +
        '<div class="weui_dialog">' +
        '<div class="weui_dialog_hd">' +
        '<strong class="weui_dialog_title">' + cfg.title + '</strong>' +
        '</div> ' +
        '<div class="weui_dialog_bd">' + cfg.content + '</div> ' +
        '<div class="weui_dialog_ft"> ' +
        '<a href="javascript:;" class="weui_btn_dialog primary">' + cfg.btn + '</a> ' +
        '</div> ' +
        '</div>';
    $('.weui_dialog_alert').append(dialog);
    $('.weui_btn_dialog').on('touchend', function(e) {
        $('.weui_dialog_alert').remove();
        callback();
        e.stopPropagation();
        e.preventDefault();
        return false;
    })
};

/**
 * 关闭弹窗
 */
util.closeAlert = function(){
    $('.weui_dialog_alert').remove();
}


/**
 * @func dialog
 * @desc 对话框
 * @param cfg.title {string} 弹窗标题
 * @param cfg.content {string} 弹窗内容
 * @param cfg.confirm {function} 点击确认的回调函数，可以为空
 * @param cfg.cancel {function} 点击取消的回调函数，可以为空
 * @example
 * util.dialog({
 *     title:"标题",
 *     content:"内容",
 *     confirm:function(){
 *         alert("确认");
 *     },
 *     cancel:function(){
 *         alert("取消");
 *     }
 * });
 */
util.dialog = function(cfg) {
    var confirm = cfg.confirm || function() {};
    var cancel = cfg.cancel || function() {};
    var confirmText = cfg.confirmText || '确定';
    var cancelText = cfg.cancelText || '取消';

    $('body').append('<div class="weui_dialog_confirm"><div class="weui_mask"></div></div>');
    var dialog = '' +
        '<div class="weui_dialog"> ' +
        '<div class="weui_dialog_hd"><strong class="weui_dialog_title">' + (cfg.title || '消息') + '</strong></div> ' +
        '<div class="weui_dialog_bd">' + cfg.content + '</div> ' +
        '<div class="weui_dialog_ft"> ' +
        '<a href="javascript:;" class="weui_btn_dialog default" id="weCancel">' + cancelText + '</a> ' +
        '<a href="javascript:;" class="weui_btn_dialog primary" id="weConfirm">' + confirmText + '</a> ' +
        '</div> ' +
        '</div>';

    $('.weui_dialog_confirm').append(dialog);

    $('#weCancel').on('touchend', function(e) {
        $('.weui_dialog_confirm').remove();
        cancel();
        e.stopPropagation();
        e.preventDefault();
        return false;
    });

    $('#weConfirm').on('touchend', function(e) {
        $('.weui_dialog_confirm').remove();
        confirm();
        e.stopPropagation();
        e.preventDefault();
        return false;
    })
};

/**
 * 关闭弹窗
 */
util.closeDialog = function(){
    $('.weui_dialog_confirm').remove();
}

/**
 * @func render
 * @desc 页面渲染
 * @param {object} cfg
 * @param {object} cfg.tmpl dotjs的模板对象
 * @param {object} cfg.data 渲染模板所需要数据
 * @param {string} cfg.context 渲染的模板将被插入的容器选择器
 * @param {function} cfg.callback 渲染完成的回调方法
 * @param {boolean} [cfg.overwrite] 是否清空容器原有内容 默认不清空
 * @example
 * util.render(cfg);
 */
util.render = function(cfg) {
    var self = this,
        _data = cfg.data,
        dom = '',
        context = cfg.context,
        callback = cfg.callback,
        _tmpl;
    if (typeof cfg.tmpl === 'function') {
        _tmpl = cfg.tmpl;
    } else {
        _tmpl = doT.template($(cfg.tmpl).html());
    }

    if (cfg.overwrite) {
        $(context).empty();
    }
    if (_tmpl) {
        dom = self.renderHtml($.trim(_tmpl(_data)), context);
    } else {
        console.log("对应的模块不存在!");
    }
    callback && callback.call(this, {
        data: _data,
        dom: dom
    });

};


/**
 * @func toast
 * @desc toast弹框，1.5秒后消失
 * @param content {string} 弹窗内容，默认为“已完成”
 */
util.toast = function(content) {
    // 清除原有的土司
    if ($('.toast').length > 0) {
        $('.toast').hide();
    }
    var toastCon = content || "已完成";
    var con = '<div id="toast" class="toast">' +
        '<div class="weui_mask_transparent"></div>' +
        '<div class="weui_toast">' +
        '<i class="weui_icon_toast"></i>' +
        '<p class="weui_toast_content">' + toastCon + '</p>' +
        '</div>' +
        '</div>';
    $('body').append(con);
    setTimeout(function() {
        $('#toast').remove();
    }, 1500);
};

/**
 * @func loadingToast
 * @desc 加载中弹框，关闭需要调用util.closeToast()
 * @param content {string} 弹框内容，默认为数据加载中
 */
util.loadingToast = function(content) {
    // 清除原有的土司
    if ($('.toast').length > 0) {
        $('.toast').hide();
    }
    var toastCon = content || "数据加载中";
    var con = '<div id="loadingToast" class="weui_loading_toast">' +
        '<div class="weui_mask_transparent"></div>' +
        '<div class="weui_toast">' +
        '<div class="weui_loading">' +
        '<div class="weui_loading_leaf weui_loading_leaf_0"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_1"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_2"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_3"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_4"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_5"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_6"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_7"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_8"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_9"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_10"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_11"></div>' +
        '</div>' +
        '<p class="weui_toast_content">' + toastCon + '</p>' +
        '</div>' +
        '</div>';
    $('body').append(con);
};

/**
 * @func closeToast
 * @desc 关闭弹窗
 */
util.closeToast = function() {
    $("#loadingToast").remove();
};

/**
 * 显示成功土司
 * @param  {String} content 显示的内容
 */
util.success = function(content) {
    // 清除原有的土司
    if ($('.toast').length > 0) {
        $('.toast').hide();
    }
    var toastTpl = require('../../tpl/toast');

    var toast = toastTpl({
        icon: 'weui_icon_toast',
        content: content
    });

    var $toast = $(toast);

    $('body').prepend($toast);

    $toast.show();

    setTimeout(function() {
        $toast.hide();
        $toast.remove();
    }, 2000);
}

/**
 * 显示失败土司
 * @param  {String} content 显示的内容
 */
util.fail = function(content) {
    // 清除原有的土司
    if ($('.toast').length > 0) {
        $('.toast').hide();
    }
    var toastTpl = require('../../tpl/toast');

    var toast = toastTpl({
        icon: 'weui_icon_cancel',
        content: content
    });

    var $toast = $(toast);

    $('body').prepend($toast);

    $toast.show();

    setTimeout(function() {
        $toast.hide();
        $toast.remove();
    }, 2000);

}


/**
 * 显示 loading 图案
 * @params  {Number} timeToActive 激活等待的时间
 * @return {[type]} [description]
 */
util.wait = function(timeToActive) {
    // 判断当前页面中是否存在 loading dom
    if (timeToActive === undefined) {
        timeToActive = 0;
    }
    waiting = true;
    setTimeout(function() {
        if (!waiting) {
            return;
        }
        // 如果没有则添加
        if ($('.loading-toast').length <= 0) {
            var loadingToast = require('../../tpl/loading-toast')({});
            $('body').prepend(loadingToast);
        }
        // 显示 loading
        $('.loading-toast').show();
    }, timeToActive)

}

/**
 * 隐藏 loading 图案
 * @return {[type]} [description]
 */
util.waitend = function() {
    // 将 loading 图案隐藏
    waiting = false;
    $('.loading-toast').hide();
}

/**
 * 修复滚动的时候误触点击事件的 bug
 */
util.fixScrolltoTouch = function() {
    var flag = false;
    window.addEventListener('touchmove', function(ev) {
        flag || (flag = true, window.addEventListener('touchend', stopTouchendPropagation, true));
    }, false);

    function stopTouchendPropagation(ev) {
        ev.stopPropagation();
        setTimeout(function() {
            window.removeEventListener('touchend', stopTouchendPropagation, true);
            flag = false;
        }, 50);
    }
}


util.renderHtml = function(tmpl, context) {
    var contentEl = $(context);
    return $(tmpl).appendTo(contentEl);
};

/**
 * 优化 select 标签
 *     让 value 属性起作用
 *     让 placeholder 属性起作用
 * @return {[type]} [description]
 */
util.optimizeSelect = function() {
    // 添加元素
    $("select[placeholder]").each(function() {
        var placeholder = $(this).attr('placeholder');
        $(this).prepend('<option value="" selected disabled>' + placeholder + '</option>');
    });
    // 获取 value 属性
    $("select").each(function() {
        $(this).val($(this).attr('value'));
    });
    $("select[placeholder]").on('change', function() {
        $(this).toggleClass("empty", $.inArray($(this).val(), ['', null]) >= 0);
    }).trigger('change');
}

/**
 * @func getPageParams
 * @desc 获取当前页面的参数
 * returns {object} 当前页面中url的参数
 */
util.getPageParams = function() {
    var params = {};
    var search = location.search;
    if (!search) return null;
    search = search.substring(1, search.length);
    var paramsArray = search.split("&");
    for (var index in paramsArray) {
        var ps = paramsArray[index];
        var psa = ps.split("=");
        params[psa[0]] = psa[1];
    }
    return params;
};

/**
 * 调用微信支付
 * @param  {Object} payCfg 支付信息
 * @param {Function} cb  支付结果的回调函数
 * @return {[type]}         [description]
 */
util.invokeWeixinPay = function(payCfg, cb, debug) {
    if (typeof WeixinJSBridge == "undefined") {
        if (debug) {
            alert('invokeWeixinPay ' + 'WeixinJSBridge is not ready');
        }
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', function() {
                if (debug) {
                    alert('invokeWeixinPay ' + 'WeixinJSBridge is ready');
                }
                onBridgeReady(payCfg, cb);
            }, false);
        }
    } else {
        if (debug) {
            alert('invokeWeixinPay ' + 'WeixinJSBridge is ready');
        }
        onBridgeReady(payCfg, cb);
    }
}

function onBridgeReady(payCfg, cb) {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId": payCfg.appId, //公众号名称，由商户传入
            "timeStamp": payCfg.timeStamp, //时间戳，自1970年以来的秒数
            "nonceStr": payCfg.nonceStr, //随机串
            "package": payCfg.package,
            "signType": payCfg.signType, //微信签名方式：
            "paySign": payCfg.paySign //微信签名
        },
        function(res) {
            // alert('rawresult '+res.err_msg);
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                // 支付成功
                if (typeof cb === 'function') {
                    cb(true);
                }
            } else {
                // 支付失败
                if (typeof cb === 'function') {
                    cb(false);
                }
            }
        });
}


util.ajaxLog = function(message) {
    $.ajax({
        type: "GET",
        data: message,
        url: 'http://120.27.192.43:1233',
        dataType: "jsonp",
    });
}

/**
 * 处理断网的时候的情况
 * @return {[type]} [description]
 */
util.dealOffline = function(option) {
    if (option === undefined) {
        option = {};
    }
    var defaultOption = {
        onoffline: function() {
            alert("请检查网络");
        },
        ononline: function() {
            history.go(0);
        }
    };
    $.extend(option, defaultOption);

    // 如果没有网络则提示没有网络
    if (!navigator.onLine) {
        setTimeout(function() {
            option.onoffline();

        },6000)

    }
    // 当网络连接的时候刷新页面
    $(window).on('online', function() {
        option.ononline();
    });
    // 当网络断开的
    $(window).on('offline', function() {
        setTimeout(function() {
            option.onoffline();

        }, 6000)

    });
}

/**
 * 自动处理当用户因为没有注册而进入没有权限的页面的情况, 判断冻结的情况
 * @param  {[type]} option [description]
 * @return {[type]}        [description]
 */
util.dealNotRegist = function(getRegistUrl) {
    var url = getRegistUrl;
    util.getData(url, {}, function(res) {
        if (res.status === 0) {
            if (res.data.length > 0) {
                // 判断冻结的情况
                if (util.isFreeze(res.data)) {
                    util.alert({
                        content: '该小区已经被停用,此功能不可用',
                        callback: function() {
                            window.location = '/weixin/index';
                        }
                    })
                }
                return;
            }
        }
        util.alert({
            content: '您还没有认证，无权进入',
            callback: function() {
                window.location = '/weixin/index';
            }
        })
    }, function(res) {
        util.alert({
            content: '您还没有认证，无权进入',
            callback: function() {
                window.location = '/weixin/index';
            }
        })
    });
};

/**
 * 判断房屋信息是否为冻结状态
 * @param  {[type]}  data [description]
 * @return {Boolean}      [description]
 */
util.isFreeze = function(data) {
    var result = false;
    data.forEach(function(item, index) {
        if (item.isDefault === true && item.frozenStatus === 'FROZEN') {
            result = true;
        }
    });
    return result;
}

/**
 * 对图片进行预览
 * @param  {String} src 图片路径
 */
util.previewImg = function(src) {
    var $previewWrap = $('<div class="preview-wrap"><div class="preview-inner"><img class="preview-img"/></div></div>');
    $('body').append($previewWrap);
    $previewWrap.find('.preview-img')
        .on('touchend', function() {
            $previewWrap.remove();
        })
        .prop('src', src);
}

util.parseAndDecode = function(data){
    data = decodeURI(data);
    return JSON.parse(data);
}

util.deparam = function(params, coerce) {
    var decode = decodeURIComponent;
    var obj = {},
        coerce_types = { 'true': !0, 'false': !1, 'null': null };

    // Iterate over all name=value pairs.
    $.each(params.replace(/\+/g, ' ').split('&'), function(j, v) {
        var param = v.split('='),
            key = decode(param[0]),
            val,
            cur = obj,
            i = 0,

            // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
            // into its component parts.
            keys = key.split(']['),
            keys_last = keys.length - 1;

        // If the first keys part contains [ and the last ends with ], then []
        // are correctly balanced.
        if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
            // Remove the trailing ] from the last keys part.
            keys[keys_last] = keys[keys_last].replace(/\]$/, '');

            // Split first keys part into two parts on the [ and add them back onto
            // the beginning of the keys array.
            keys = keys.shift().split('[').concat(keys);

            keys_last = keys.length - 1;
        } else {
            // Basic 'foo' style key.
            keys_last = 0;
        }

        // Are we dealing with a name=value pair, or just a name?
        if (param.length === 2) {
            val = decode(param[1]);

            // Coerce values.
            if (coerce) {
                val = val && !isNaN(val) ? +val // number
                    : val === 'undefined' ? undefined // undefined
                    : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
                    : val; // string
            }

            if (keys_last) {
                // Complex key, build deep object structure based on a few rules:
                // * The 'cur' pointer starts at the object top-level.
                // * [] = array push (n is set to array length), [n] = array if n is
                //   numeric, otherwise object.
                // * If at the last keys part, set the value.
                // * For each keys part, if the current level is undefined create an
                //   object or array based on the type of the next keys part.
                // * Move the 'cur' pointer to the next level.
                // * Rinse & repeat.
                for (; i <= keys_last; i++) {
                    key = keys[i] === '' ? cur.length : keys[i];
                    cur = cur[key] = i < keys_last ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val;
                }

            } else {
                // Simple key, even simpler rules, since only scalars and shallow
                // arrays are allowed.

                if ($.isArray(obj[key])) {
                    // val is already an array, so push on the next value.
                    obj[key].push(val);

                } else if (obj[key] !== undefined) {
                    // val isn't an array, but since a second value has been specified,
                    // convert val into an array.
                    obj[key] = [obj[key], val];

                } else {
                    // val is a scalar.
                    obj[key] = val;
                }
            }

        } else if (key) {
            // No value was defined, so set something meaningful.
            obj[key] = coerce ? undefined : '';
        }
    });

    return obj;
};


util.formatMoney = function(value) {
        if(value === null||value === '') {
            return '0.00';
        }
        var value = value.toString();

        value = value.split('.');
        if (value[1]) {
            if (value[1].length !== 2) {
                value[1] = (value[1] + '00').substr(0, 2);
            }
        } else {
            value.push('00');
        }
        return value.join('.');
    }
