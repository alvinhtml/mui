/*!
 *	===========================================================
 *	== 作者：你爱谁如鲸向海(www.alvinhtml.com/me) - 2015-05-04 ==
 * 	===========================================================
 *
 * 	插件名称：popup v1.1
 * 	http:www.alvinhtml.com/plugins/popup
 *
 */

 (function (factory) {
     if ( typeof define === "function" && define.amd ) {
         // 兼容 AMD 规范
         define([ "jquery" ], factory);
     } else {
         // 全局模式
         factory(jQuery);
     }
 }(function ($) {
 	/*
 	 **	插件名称：popup
 	 *
 	 *	语法一 - $(selector).popup([position]);
 	 *
 	 **	参数配置：
 	 *		position -	弹出消息框的位置，默认为自动计算，可选值为：left,right,top,bottom;
 	 *
 	 *	语法二 - $(selector).popup([fn]);
 	 *
 	 **	参数配置：
 	 *		fn - fn(title,content),接收title和content参数，return一个DOM字符串。
 	 *
 	 *	语法三 - $(selector).popup([position],[fn]);
 	 *
 	 **	属性配置：
 	 *		element data-title 	 属性 -	消息标题,非必写，可以省略
 	 *		element data-content 属性 -	消息内容
 	 *		element data-style   属性 -	消息框自定义样式名称,非必写，可以省略
 	 *
 	*/
     $.fn.extend({
         popup:function(position,fn){
         	var jQwindow = $(window);

 			$(this).each(function() {

 				//	element 对象
                 var _elem = $(this);


 				var Timeout,

 					getClass,

 					popupDom,

 					//	消息内容
 					_content  =  _elem.attr("data-content"),

 					//	消息标题
 					_title    =  _elem.attr("data-title"),

 					//	消息框自定义样式名称
 					_style    =  _elem.attr("data-style");

 					//	自定义消息框DOM
 					if ( typeof position === "function" ) {
 						popupDom = position(_title,_content);
 					} else {
 						if ( typeof fn === "function" ) {
 							popupDom = fn(_title,_content);
 						}
 					}
 					console.log(_content,position);
 					console.log(_content,popupDom);

 					//	如果未使用自定义方法，则使用默认
 					if ( popupDom === undefined ) {
 						popupDom = (_title ? '<div class="header">'+ _title +'</div>' : '') + (_content || '');
 					}

 				//	消息框 DOM
 				var	jQpopup =  $('<div class="popup center animate ' + (_style || '') + '" >' + popupDom + '</div>');



 				//	用 jQuery hover 方法给 element 对象添加 mouseover、mouseout 事件
 				_elem.hover(function(){
 					//	mouseover

 					window.clearTimeout(Timeout);
 					//	将消息框 DOM 添加到 body 中
 					jQpopup.appendTo("body");


 					var positionClass = "",
 						positioning,

 						//	计算 element 对象的宽高和位置
 						elemOffs = {
 							width   : _elem.outerWidth(),
 							height  : _elem.outerHeight(),
 							position: _elem.offset()
 						},

 						//	计算消息框的宽高和位置
 						popup = {
 							width   : jQpopup.outerWidth(),
 							height  : jQpopup.outerHeight(),
 							position: jQpopup.offset()
 						};

 						elemOffs.position.top -= jQwindow.scrollTop();


 					var boundary  = {
 							scrollTop	: jQwindow.scrollTop(),
 							height 		: jQwindow.height(),
 							width  		: jQwindow.width()
 						},

 						//	计算当前视窗的边界能否容下弹出框的大小
 						offstage = {
 							left   :  ( elemOffs.position.left > popup.width ),
 							top    :  ( elemOffs.position.top > popup.height ),
 							right  :  ( boundary.width - elemOffs.position.left - elemOffs.width >  popup.width ),
 							bottom :  ( boundary.height - elemOffs.position.top - elemOffs.height >  popup.height )
 						}


 					if(position === "left" || position === "right" || position === "top" || position === "bottom"){
 						//	如果参数设置了位置，直接使用参数
 						getClass = position;
 					}else{
 						//	如果参数没有设置位置，则自动计算

 						if(offstage.left && offstage.top && offstage.right){
 							getClass = "top";
 						}else{
 							if(offstage.left && offstage.bottom && offstage.right){
 								getClass = "bottom";
 							}else{
 								if(offstage.right){
 									getClass = "right";
 								}else{
 									getClass = "left";
 								}
 							}
 						}
 					}
 					switch (getClass){
 						case "top":
 							positioning = {
 							  top    : elemOffs.position.top - popup.height - 8,
 							  left   : elemOffs.position.left + elemOffs.width / 2 - popup.width / 2
 							};
 							break;
 						case "bottom":
 							positioning = {
 							  top    : elemOffs.position.top + elemOffs.height + 8,
 							  left   : elemOffs.position.left + elemOffs.width / 2 - popup.width / 2
 							};
 							break;
 					 	case "right":
 							positioning = {
 							  top    : elemOffs.position.top + elemOffs.height / 2 - popup.height / 2,
 							  left   : elemOffs.position.left + elemOffs.width + 8
 							};
 							break;
 						case "left":
 							positioning = {
 							  top    : elemOffs.position.top + elemOffs.height / 2 - popup.height / 2 - 2,
 							  left   : elemOffs.position.left - popup.width - 8
 							};
 							break;
 					}
 					jQpopup.addClass(getClass);
 					jQpopup.css({
 						left:positioning.left + 'px',
 						top:positioning.top + boundary.scrollTop + 'px',
 						right  : 'auto',
 						bottom : 'auto',
 						display: 'table',
 					});
 					jQpopup.addClass("visible");

 				},function(){
 					jQpopup.removeClass("visible");
 					Timeout = window.setTimeout(function(){
 						jQpopup.removeClass(getClass).remove();
 					},300);
 				})
             });
         }
 	})
 }));

 $(".ititle").popup();
 $(".ititle-top").popup("top");
 $(".ititle-right").popup("right");
 $(".ititle-bottom").popup("bottom");
 $(".ititle-left").popup("left");
 $("#warning").popup(function(title,content){
     return '<div class="header"><i class="icon-info"></i>&nbsp; '+ title +'</div><div style="padding-left:1.5em;">' + content + '</div>';
 });
 $("#error").popup(function(title,content){
     return '<div class="header"><i class="icon-info"></i>&nbsp; '+ title +'</div><div style="padding-left:1.5em;">' + content + '</div>';
 });
