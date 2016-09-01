(function() {
    var TYgallery = function() {

    }
    TYgallery.prototype.configuration = {
        container: ''
    }
    TYgallery.prototype.init = function(options) {
        var self = this;
        $.extend(true, this, self.configuration, options);
        self.initFrame();
        /*self.initPlug();*/
    }
    TYgallery.prototype.initFrame = function() {
        var self = this;
        self.$container = $(self.container);
        var image = self.$container.find('li').data('image');
        var thumb = self.$container.find('li').data('thumb');
        var dom = '<a href = "' + image + '" class = "cboxElement" data-rel = "colorbox">\
		               <img alt = "啥也木有" src = "' + thumb + '" height = "150" width = "150"\
		               <div class = "textGallery">\
                           <div class = "textGalleryInner">预览</div>\
		               </div>\
		            </a>';
        self.$dom = $(dom);
        self.$dom.appendTo(self.$container.find('li'));
    }
    TYgallery.prototype.initPlug = function() {
        var self = this;
        var $overflow = '';
        var colorbox_params = {
            photo: true,
            rel: 'colorbox',
            reposition: true,
            scalePhotos: true,
            scrolling: false,
            previous: '<i class="ace-icon fa fa-arrow-left"></i>',
            next: '<i class="ace-icon fa fa-arrow-right"></i>',
            close: '&times;',
            current: '{current} of {total}',
            maxWidth: '100%',
            maxHeight: '100%',
            onOpen: function() {
                $overflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
            },
            onClosed: function() {
                document.body.style.overflow = $overflow;
            },
            onComplete: function() {
                $.colorbox.resize();
            }
        };

        $('[data-rel="colorbox"]').colorbox(colorbox_params);
    }
    window.tygallery = {
    	init : function(options){
    		var tygallery = new TYgallery();
    		tygallery.init(options);
    		return tygallery;
    	}
    }
})()
