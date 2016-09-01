(function() {
    var TYpopupWindow = function() {

    }
    TYpopupWindow.prototype.configuration = {
        headerMessage: '',
        bodyMessage: '',
        sureMessage: '',
        cancelMessage: '',
        doSure: function() {},
        doCancel: function() {}
    }
    TYpopupWindow.prototype.init = function(options) {
        var self = this;
        $.extend(true, this, self.configuration, options);
        self.initFrame();
        self.handle();
    }
    TYpopupWindow.prototype.initFrame = function() {
        var self = this;
        var domstr = '<div class = "popupContainer">\
                        <div class = "popupHeader">\
                            <!-- 弹出框头部消息 -->提示\
                        </div>\
                        <div class = "popupBody">\
                            <!-- 弹出框内容 -->\
                        </div>\
                        <div class = "popupFooter">\
                            <!-- 弹出框底部按钮 -->\
                            <div class = "sureMessage">\
                                <!-- 确认消息 -->\
                            </div>\
                            <div class = "cancelMessage">\
                                <!-- 取消 -->\
                            </div>\
                        </div>\
                    </div>\
                    <div class = "popupMask">\
                    </div>';
        self.$domhtml = $(domstr);
        self.$domhtml.find('.popupHeader').html(self.headerMessage);
        self.$domhtml.find('.popupBody').html(self.bodyMessage);
        self.$domhtml.find('.sureMessage').html(self.sureMessage);
        self.$domhtml.find('.cancelMessage').html(self.cancelMessage);
        /*$domhtml.appendTo($body);*/
    }
    TYpopupWindow.prototype.handle = function() {
        var self = this;
        // 这里有一个问题，即给元素绑定事件，是在将元素插入到文档前还是文档后，
        // 可能会有获取不到的情况出现，插入文档前是肯定可以获取的，先这样做
        self.$domhtml.find('.popupFooter').on('click', '.sureMessage', function() {
            self.doSure();
        })
        self.$domhtml.find('.popupFooter').on('click', '.cancelMessage', function() {
            self.doCancel();
            self.$domhtml.hide();
            $('.popupMask').removeClass('popupbg');
        })
        // 点击删除时弹出弹框，即
        $('.popupMask').addClass('popupbg');
        if($('.popupContainer').length >=1){
        	// 第一次之后调用这里
        	$('.popupContainer').show();
        	// 这里不太明白为什么遮罩层在第二次的时候有个内联属性display：none，代码里面并没有设置
        	$('.popupMask').show();
        	$('.popupMask').addClass('popupbg');
        	return;
        } else {
        	// 第一次调用这里
        	self.$domhtml.appendTo($('body'));
        	$('.popupMask').addClass('popupbg');
        }
        
    }
    window.typopupWindow = {
        init: function(options) {
            var typopupWindow = new TYpopupWindow();
            typopupWindow.init(options);
            return typopupWindow;
        }
    }
})()
