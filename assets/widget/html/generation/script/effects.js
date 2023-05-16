// JavaScript Document
$(document).ready(function() {
	//tab
	    $('.tab > ul > li').click(tab);
	function tab() {
		$(this).addClass('current').siblings().removeClass('current');
		var tab = $(this).attr('name');
		$('#' + tab).show().siblings().hide();
		};
	//search
	    $('.tab2 > ul > li').click(tab);
	function tab() {
		$(this).addClass('current').siblings().removeClass('current');
		var tab = $(this).attr('name');
		$('#' + tab).show().siblings().hide();
		};
	//address
	$('.address > dl > dt').click(function(event) {
		$(this).parents('dl').children('dd').slideToggle();
	});
	//new
	$('#level').click(function(event) {
		$('.poplevel').show();
	});
	$('.pop_level > ul > li').click(function(event) {
		$('.poplevel').hide();
	});
	//工单筛选
	$(".sc_member_recharge_form span").click(function(){
		 var select = $(this).text();
		$(".sc_member_recharge_form span").removeClass("current");
		$(this).addClass("current");
});

})
$(function(){
	"use strict";
	$(".select p").click(function(){
		$(this).parent().addClass('current').siblings().removeClass('current');
		$(this).next(".selectcnt").toggle();
	});
	$(".selectcnt>ul>li").click(function(){
		var V = $(this).text();
		var oNav_span=$(this).parent().parent().siblings("p").find("span").length;
		if(oNav_span==1){
			$(this).parent("ul").parent("div").siblings("p").children("span").html(V);
		}else{
			$(this).parent("ul").parent("div").siblings("p").children("input").val(V);
		}
		$(this).parent("ul").parent("div").hide();
		$(this).parent("ul").parent("div").siblings("p").children("a").removeClass("fa-angle-up").addClass("fa-angle-down");
	});
})
