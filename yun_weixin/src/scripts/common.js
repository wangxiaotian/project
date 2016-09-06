$(function(){
	// 菜单栏
	$('#menu').on('click','.menuFirst li',function(){
		if($(this).children().hasClass('.menuSecond')){
            $(this).find('.menuSecond').show();
		}
		console.log('菜单栏点击')
	})
})