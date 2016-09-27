/**
 * 待办事项列表
 * @module todo
 * @author xjc
 */

function Todo(){
    this.list = [];
}

/**
 * 添加一个待办事项
 * @param  {String} content 待办事项的内容
 */
Todo.prototype.todo = function(content){
     var self = this;
     self.list.push(content);
}

/**
 * 处理一个待办事项
 * @param  {String} content 待办事项的内容
 */
Todo.prototype.do = function(content){
     var self = this;
     self.list = self.list.filter(function(item, index){
        if(item === content){
            return false;
        }else{
            return true;
        }
     });
     if(self.list.length <= 0){
        if(typeof self.onfinishedHandle !== 'function'){
            return;
        }
        self.onfinishedHandle();
     }
}

/**
 * 在所有事项完成之后调用传入的回调函数
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
Todo.prototype.onfinished = function(cb){
    var self = this;
    self.onfinishedHandle = cb;
}

module.exports = new Todo();