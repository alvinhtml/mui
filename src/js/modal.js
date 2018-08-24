webpackJsonp([3],{

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 *	===========================================================
 *	== 作者：你爱谁如鲸向海(www.alvinhtml.com/me) - 2015-05-04 ==
 * 	===========================================================
 *
 * 	插件名称：popup v1.1
 * 	http:www.alvinhtml.com/plugins/popup
 *
 */

(function (factory) {
	if (true) {
		// 兼容 AMD 规范
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		// 全局模式
		factory(jQuery);
	}
})(function ($) {
	/*
  **	插件名称：Modal
  *
  *	语法一 - $(selector).modal();
  *
  **	参数配置：
  *		selector -	拟态窗口的DOM
  *
 */
	$.fn.extend({
		modal: function () {

			var jQbody = $("body"),
			    jQdimmer = $('<div class="dimmer"></div>');

			$(this).each(function () {

				var _elem = $(this),
				    _close = _elem.find(".close"),
				    _width = _elem.outerWidth(),
				    _height = _elem.outerHeight();

				//	添加拟态窗口背景层
				if (jQbody.find(".modal.visible").length < 1 && !_elem.hasClass("Infohint")) {
					jQdimmer.prependTo("body").addClass("animates").addClass("visible");
				}

				//	计算拟态窗口的位置，上下和左右都居中
				_elem.css({
					"margin-left": -_width / 2 + "px",
					"margin-top": -_height / 2 + "px",
					"display": "block"
				}).addClass("visible");

				//	关闭拟态窗口
				var closeModal = function () {
					_elem.removeClass("visible");
					jQdimmer.removeClass("visible");

					//	移除拟态窗口和背景层
					window.setTimeout(function () {
						_elem.css("display", "none");
						jQdimmer.remove();
					}, 300);
				};

				//	点击关闭按钮关闭拟态窗口
				_close.on("click", closeModal);

				//	点击背景层关闭拟态窗口
				jQdimmer.on("click", closeModal);
			});
		}
	});

	$.extend({
		/*
   *
   *  语法 - $.Alert(text);
   *
   ** 参数配置：
   *      text - {string} 要弹出的消息
   *
  */
		Alert: function (text) {
			$(".modal.Alert").empty().remove();
			// 向body添加弹框DOM，并显示
			$('<div class="modal animate Alert">' + '<span class="modal-close close">×</span>' + '<div class="modal-header">提示信息</div>' + '<div class="content">' + (text || "") + '</div>' + '<div class="actions"><span class="button green close">知道了</span></div>' + '</div>').appendTo("body").modal();

			// 关闭后移除DOM
			$(".Alert .close").click(function () {
				window.setTimeout(function () {
					$(".Alert").remove();
				}, 300);
			});
		},
		/*
   *
   *  语法 - $.Confirm(text,fn,[fn2]);
   *
   ** 参数配置：
   *      text - {string}     要弹出的消息
   *      fn   - {callback}   点击确认时的回调函数
   *      fn2  - {callback}   点击取消时的回调函数
   *
  */
		Confirm: function (text, fn, fn2) {
			$(".modal.Confirm").empty().remove();
			// 向body添加弹框DOM，并显示
			$('<div class="modal animate Confirm">' + '<span class="modal-close close">×</span>' + '<div class="modal-header">提示信息</div>' + '<div class="content">' + (text || "") + '</div>' + '<div class="actions"><span id="ConfirmNo" class="button close"> 取消 </span><span id="ConfirmOk" class="button green label close"><i class="fa fa-check"></i> 确认</span></div>' + '</div>').appendTo("body").modal();

			// 关闭后移除DOM
			$(".Confirm .close").click(function () {
				window.setTimeout(function () {
					$(".Confirm").remove();
				}, 300);
			});

			//	点击确认按钮
			$("#ConfirmOk").click(function () {
				if (typeof fn === "function") {
					fn();
				}
			});

			//	点击取消按钮
			$("#ConfirmNo").click(function () {
				if (typeof fn2 === "function") {
					fn2();
				}
			});
		},

		/*
   *
   *  语法 - $.Info(text,[status],[fn]);
   *
   ** 参数配置：
   *      text 	- {string}	要弹出的消息
   *      status  - {string}  消息框的状态，可选值为：success、warning、error
   *      fn  	- {callback}   消息框消失后的回调函数
   *
  */
		Info: function (text, status, fn) {
			var _infoDom = '';

			//	判断弹框的状态
			if (status === "warning") {
				_infoDom = 'warning"><i class="fa fa-exclamation-circle"></i> ';
			} else if (status === "success") {
				_infoDom = 'success"><i class="fa fa-check-circle"></i> ';
			} else if (status === "error") {
				_infoDom = 'error"><i class="fa fa-times-circle"></i> ';
			} else {
				_infoDom = '"><i class="fa fa-info-circle"></i> ';
			}

			// 向body添加弹框DOM，并显示
			$('<div class="modal animate Infohint ' + _infoDom + text + '</div>').appendTo("body").modal();

			//	2秒后自动移除弹出信息框
			window.setTimeout(function () {
				var _elem = $(".Infohint");
				_elem.removeClass("visible");

				//	执行回调函数
				if (typeof status === "function") {
					status();
				} else {
					if (typeof fn === "function") {
						fn();
					}
				}
				window.setTimeout(function () {
					$(".Infohint").remove();
				}, 300);
			}, 2000);
		}
	});
});

$(".btn1").click(function () {
	$.Alert("弹出一个消息对话框。");
});

$("#delbtn").click(function () {
	$.Confirm("您确定要执行删除操作吗？", function () {
		$.Info("删除成功！", "success", function () {
			//  --
		});
	}, function () {
		$.Info("删除操作被取消！", "warning", function () {
			//  --
		});
	});
});

$("#infobtn").click(function () {
	$.Info("两秒后隐藏", function () {
		$.Alert("这是两秒后的回调函数。");
	});
});

$("#successbtn").click(function () {
	$.Info("提交成功！", "success", function () {
		//  --
	});
});

$("#warnbtn").click(function () {
	$.Info("非法操作！", "warning");
});

$("#errorbtn").click(function () {
	$.Info("操作失败！", "error");
});

$("#loginbtn").click(function () {
	$("#LoginBox").modal();
});

/*

<div class="modal animate visible"><span class="modal-close close">×</span>
<div class="modal-header">提示信息</div>
<div class="content">请先勾选要执行操作的列!</div>
<div class="actions">
	<span class="button green close">知道了</span>
</div></div>

 */
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })

},[4]);