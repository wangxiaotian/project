/**
 * [description]
 * @module util
 * @author xjc
 */

/*
 * 这是一个工具集，不需要每个都去看，用到的先看
 */

/* 引入依赖 */
var extend = require('extend');  // 我去，又有引入
var sutil = require('util');

var util = exports;
var decode = decodeURIComponent;
/**
 * 遍历 js 对象中的叶子节点
 *     叶子节点是指所有非 plain object 的元素
 *     在遍历过程中可以获取元素，也可以对遍历到的元素进行操作
 *     遍历的时候是不分顺序的
 * @param  {Object} obj 被遍历的元素
 * @param  {Function} cb 在回调函数中获取元素的节点，和对节点进行操作
 *                       @property {!Object} property 叶子节点元素
 *                       @property {Object} parent    叶子节点的父节点元素
 *                       @property {String} key       叶子节点的 key 值 
 */
util.traverseLeaf = function(obj, cb) {
    var self = this;
    var key;
    var i;



    // 如果是叶子节点，则调用回调函数
    if (self.isLeaf(obj)) {     // 它返回布尔值
        cb(obj, self.traverseLeaf.parent, self.traverseLeaf.key);
        return;
    }

    // 如果不是叶子节点，则继续深入遍历

    // 如果是数组
    if (util.isArray(obj)) {

        // 记录元素的父级
        self.traverseLeaf.parent = obj;

        for (i = 0; i < obj.length; i++) {

            // 记录元素的key 值
            self.traverseLeaf.key = i;
            // 遍历
            self.traverseLeaf(obj[i], cb);
        }
        return;
    }

    // 如果是普通对象

    for (key in obj) {

        // 记录元素的 key 值
        self.traverseLeaf.key = key;

        // 记录元素的父级
        self.traverseLeaf.parent = obj;
        // 继续遍历
        self.traverseLeaf(obj[key], cb);
    }
};

/**
 * 遍历一个对象的叶子节点，并且记录每个叶子节点的访问路径
 * @param  {Object}   obj  被访问的对象
 * @param  {Function} cb   回调函数
 *                         @param  目标对象
 *                         @param  目标对象的访问路径
 * @param  {String}   path 访问的路径
 */
util.traverseLeafWithPath = function(obj, cb, path) {
    // 它的作用就是执行回调函数，但是不明白为什么要对传入的参数对象进行
    // 分类，看来还是要对传入的具体对象进行分析
    var self = this;
    var key;
    var i;

    // path 默认为空字符串
    // 确实空的，就没传递进来
    if (typeof path === 'undefined') {
        path = '';
    }

    // 如果是叶子节点，则调用回调函数
    // 又是引用
    if (self.isLeaf(obj)) {
        if (path.length >= 0) {
            path = path.substring(1);
        }
        cb(obj, path);
        return;
    }

    // 如果不是叶子节点，则继续深入遍历

    // 如果是数组
    if (util.isArray(obj)) {
        for (i = 0; i < obj.length; i++) {
            // 计算路径
            var newPath = path;
            newPath = newPath + '.' + i;
            // 遍历                  
            self.traverseLeafWithPath(obj[i], cb, newPath);
        }
        return;
    }

    // 如果是普通对象
    for (key in obj) {
        // 计算路径
        var newPath = path;
        newPath = newPath + '.' + key;
        // 继续遍历
        self.traverseLeafWithPath(obj[key], cb, newPath);
    }
};

/**
 * 用路径访问一个对象，也可以给这个对象赋值，也可以返回这个对象的值
 *     如果需要给一个对象赋值，传入参数 value，返回的是旧值
 *     如果只需要获取值，则不传入 value，返回路径下的值
 * @param  {Object} obj    目标对象
 * @param  {String} path   访问的路径
 * @param  {Any} value     赋予的值
 * @return {Any}           该路径下的值
 */
util.visit = function(obj, path, value) {
    if (!util.isString(path)) {
        return null;
    }
    var pathArray = path.split('.');
    var lastIndex = (pathArray.length - 1);
    var currentValue = obj;
    var oldValue;
    for(var i = 0; i < pathArray.length; i++){
        var item = pathArray[i];
        // 如果需要赋值则进行赋值
        if (i === lastIndex) {
            oldValue = currentValue[item];
            if (!util.isUndefined(value)) {
                currentValue[item] = value;
            }
            if (util.isUndefined(oldValue)) {
                return null;
            }else{
                return oldValue;
            }
        }
        // 更新当前值
        currentValue = currentValue[item];
        if(util.isUndefined(currentValue)){
            return null;
        }
    }
}

/**
 * 判断当前对象是否是叶子节点
 *      如果对象不是 Array 也不是 普通 object 那么它就是叶子
 * @param  {Object}  obj  被判断的对象
 * @return {Boolean}     判断的结果
 */
util.isLeaf = function(obj) {
    if (this.isPlainObject(obj)) {
        return false;
    }

    if (util.isArray(obj)) {
        return false;
    }

    return true;
};

/**
 * 判断对象是否为普通对象
 *      普通对象是以 Object 为原型的对象
 * @param  {Object}  obj 被判断的对象
 * @return {Boolean}     判断的结果
 */
// 为什么要判断对象呢？
util.isPlainObject = function(obj) {

    if (typeof obj !== 'object') {   // 判断本身是否为对象
        return false;
    }
    if(obj === null) {    // 这个判断null,
        return false;
    }
    if (obj.constructor !== Object) {    // 这个有用吗？它的原型肯定是对象啊
        return false;
    }

    return true;
};

/**
 * 判断一个值是否为空
 *      null是空值，undefined 是空值，''（空字符串） 是空值
 * @param  {[type]}  value [description]
 * @return {Boolean}       [description]
 */
util.isEmpty = function(value) {
    if (value === null) {
        return true;
    }
    if (value === undefined) {
        return true;
    }
    if (value === '') {
        return true;
    }
    return false;
};

/**
 * 从一个对象中提取元素形成另一个对象
 *     在进行深度克隆的时候，如果遇到自定义对象则对自定义对象不做深度克隆
 * @param  {Object} target  被提取的对象, 不能是数组,但是可以是自定义对象
 * @param  {Array} tpl      需要提取的属性列表
 * @param  {Boolean} deep   option|default false 是否深度提取
 * @return {Object}         获得的新对象
 */
util.extract = function(target, tpl, deep) {
    var self = this;

    if (!self.isObject(target)) {
        return {};
    }
    if (!self.isArray(tpl)) {
        return {};
    }
    // 新建一个对象
    var newObj = {};
    var i;
    for (i = 0; i < tpl.length; i++) {
        var key = tpl[i];
        if (!deep) {
            newObj[key] = target[key];
        } else {
            if (self.isPlainObject(target[key])) {
                // 如果是一般对象则进行深度克隆                    
                newObj[key] = self.extend(true, {}, target[key]);
            } else if (self.isArray(target[key])) {
                // 如果是数组则进行深度克隆
                newObj[key] = self.extend(true, [], target[key]);
            } else {
                // 如果是基本数据类型或者是自定义对象，则直接赋值
                newObj[key] = target[key];
            }
        }
    }
    return newObj;
}

/**
 * 将表单序列化字符串转化为 json 对象
 * @param  {[type]} params [description]
 * @param  {[type]} coerce [description]
 * @return {[type]}        [description]
 */
util.deparam = function(params, coerce) {
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
}

/**
 * 添加第三方 extend 方法
 */
util.extend = extend;

extend(util, sutil);

// 对传统模块化方法的支持
/* @support tradition plugname(util) */