$(function(){
	"use strict";
	$('.tabp > .taban').click(function () {
		$(this).parents(".tabp").children(".taban").removeClass('tabcur');
		$(this).addClass('tabcur');
	
	});
});
