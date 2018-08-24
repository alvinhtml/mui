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
 	/*!
 	 ** 方法名称：toLead
 	 *
 	 ** 配置参数
 	 *		len -	必须，整数，规定前置零的位数。
 	 */
 	Number.prototype.toLead = function(len){
 		return new Array(Math.abs(this.toString().length-(len+1))).join("0")+this;
 	};

 	/*!
 	 ** 方法名称：Format
 	 *
 	 ** 配置参数
 	 *		format -	必须，规定时间的格式。
 	 *
 	 * 		Y - 年，四位数字; 如: "1999"
 	 * 		m - 月份，二位数字，若不足二位则在前面补零; 如: "01" 至 "12"
 	 * 		n - 月份，二位数字，若不足二位则不补零; 如: "1" 至 "12"
 	 * 		d - 几日，二位数字，若不足二位则前面补零; 如: "01" 至 "31"
 	 * 		j - 几日，二位数字，若不足二位不补零; 如: "1" 至 "31"
 	 *
 	 * 		h - 12 小时制的小时; 如: "01" 至 "12"
 	 *		H - 24 小时制的小时; 如: "00" 至 "23"
 	 * 		g - 12 小时制的小时，不足二位不补零; 如: "1" 至 12"
 	 * 		G - 24 小时制的小时，不足二位不补零; 如: "0" 至 "23"
 	 * 		i - 分钟; 如: "00" 至 "59"
 	 * 		s - 秒; 如: "00" 至 "59"
 	 *
 	 */
 	Date.prototype.Format = function(format){
 	    if(!/^[\\\/:YHGmndhgijs-\s\u5e74\u6708\u65e5\u65f6\u5206\u79d2]+$/.test(format)){
 	    	return this;
 	    }else{
 		    var matchs = format.match(/[YHGmndhgijs]/g);
 		    for (var i=0; i < matchs.length; i++) {
 		    	format = format.replace(matchs[i],
 		    	matchs[i] === "Y" ? this.getFullYear() :
 		    	matchs[i] === "m" ? (this.getMonth() + 1).toLead(2) :
 		    	matchs[i] === "d" ? this.getDate().toLead(2):
 		    	matchs[i] === "n" ? this.getMonth() + 1:
 		    	matchs[i] === "j" ? this.getDate():
 		    	matchs[i] === "h" ? this.getHours().toLead(2):
 		    	matchs[i] === "H" ? this.getHours().toLead(2):
 		    	matchs[i] === "g" ? this.getHours()%12||12:
 		    	matchs[i] === "G" ? this.getHours():
 		    	matchs[i] === "i" ? this.getMinutes().toLead(2) : this.getSeconds().toLead(2));
 		    }
 		    return 	format;
 	    }
 	}
 	/*!
 	 ** 类名称：datepicker
 	 *
 	 **	参数配置
 	 *		today -	传入格式化时间字符串，初始化当前时间
 	 *		lang -	可选参数，定义模板语言，默认为中文
 	 *				zh-cn -	中文
 	 *				en-us -	英文
 	 */
 	var datepicker = function(today,selectHis,lang){
 		//默认不选择时分秒
 		this.selectHis = selectHis||false;

 		// 初始化日期时间
 		var m = today.match(/(\d{4})-(\d{1,2})-(\d{1,2})( (\d{1,2}):(\d{2}):(\d{2}))?/);
 		if(m){

 			if(m[4]){
 				this.today = new Date(m[1],parseInt(m[2])-1,m[3],m[5],m[6],m[7]);
 				this.selectHis = true;
 			}else{
 				this.today = new Date(m[1],parseInt(m[2])-1,m[3]);
 			}
 		}else{
 			this.today = new Date();
 		}

 		//	定义模板语言
 		if(lang === "en-us"){
 			this.style = {
 				title: '<span class="date-head-year" id="datePickerMonth"></span> &nbsp; <span id="datePickerYears"></span>',
 				week : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
 				months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
 			}
 		}else{
 			this.style = {
 				title: '<span class="date-head-year" id="datePickerYears"></span> 年 <span id="datePickerMonth"></span> 月',
 				week : ["日", "一", "二", "三", "四", "五", "六"],
 				months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
 			}
 		}

 		//设置选中的日期为当前日期
 		this.selectDay = this.today;

 		// 拼接星期HTML串
 		var weekStr = '';
 		for(var i=0; i < 7; i++){
 			weekStr += '<li>'+this.style.week[i]+'</li>';
 		}

 		// 拼接日期面板HTML串
 		var htmls ='<div id="datepicker" class="date-picker-box right dropmain animates">'
 				+'<div class="date-picker-top">'
 				+'<div class="date-button-prev" id="date_year_prev"><i class="dicon-prev"></i><i class="dicon-prev"></i></div>'
 				+'<div class="date-button-prev" id="date_month_prev"><i class="dicon-prev"></i></div>'
 				+'<div class="date-picker-head">'+this.style.title+'</div>'
 				+'<div class="date-button-next" id="date_month_next"><i class="dicon-next"></i></div>'
 				+'<div class="date-button-next" id="date_year_next"><i class="dicon-next"></i><i class="dicon-next"></i></div>'
 				+'</div>'
 				+'<ul class="date-picker-list" id="date_picker_week">'+ weekStr +'</ul>'
 				+'<ul class="date-picker-list" id="date_picker_day"></ul>'
 				+'<ul class="date-picker-list date-picker-years" id="date_picker_years"></ul>'
 				+'<div class="date-picker-today" id="date_today">Today</div>'
 				+'</div>';

 		$("body").append(htmls);

 		if(this.selectHis){
 			this.hisInit(this.selectDay.getHours(),this.selectDay.getMinutes(),this.selectDay.getSeconds());
 		}

 		// 绑定事件
 		this._event();

 		//初始化
 		this.init(this.today);

 		return this;
 	}

 	datepicker.prototype = {
 		init:function(time){
 			var   _this  =  this,
 				   year  =  time.getFullYear(),
 				  month  =  time.getMonth(),
 				   date  =  time.getDate(),
 				  hours  =  time.getHours(),
 				minutes  =  time.getMinutes(),
 				seconds  =  time.getSeconds(),
 					 ms  =  time.getMilliseconds(),
 			   datesStr  =  "",

 			//	当前月总天数
 			toMonthDates = _this.allDates(time);


 			//	创建一个新的时间，作为上月时间
 			var prevDate = new Date(time);

 			//	上一月最后一天是周几
 				prevDate.setDate(1);
 			var prevWeekDay = prevDate.getDay()-1;

 			// 当上一月最后一天为周六时，显示上月最后7天
 			if(prevWeekDay < 0) prevWeekDay = 6;

 			// 上一月总天数
 				prevDate.setMonth(month-1);
 			var prevMothAll =  _this.allDates(prevDate);

 			//	拼接上月天数 HTML串
 			for (var i = prevWeekDay; i >= 0; i--){
 				datesStr += '<li class="old-days">' + ( prevMothAll - i ) + '</li>';
 			}

 			//	拼接本月天数 HTML串
 			for (var i = 1; i <= toMonthDates; i++){
 				datesStr += '<li class="this-days ' + (date == i ? "today" : "") + '">' + i + '</li>';
 			}

 			//下一月第一天是周几
 			var nextWeekDay = 7 - (parseInt(prevWeekDay) + 1 + toMonthDates) % 7;
 			//	拼接下月天数 HTML串
 			for (var i = 1; i <= nextWeekDay; i++){
 				datesStr += '<li class="new-days">' + i + '</li>';
 			}

 			$("#datePickerMonth").text(_this.style.months[month]);
 			$("#datePickerYears").text(year);
 			$("#date_picker_day").html(datesStr);
 			datesStr = "";
 		},

 		/*
 		 * 	方法名称：allDates - 返回月份的总天数
 		 * 	参数配置：time - 当前日期时间
 		 			  n - 为 -1 返回上一月天数，为 1 返回下一月天数
 		*/
 		allDates:function(time,n){
 			var year = time.getFullYear(),month = time.getMonth();
 			var alldate = [31,year%4?28:29,31,30,31,30,31,31,30,31,30,31];
 			if (n) {
 				month = (month + n + 12) % 12;
 			}
 			return alldate[month];
 		},
 		//开启选择时分秒
 		hisInit:function(hour,minute,second){
 			/*var minute_str = '<li>00</li><li>01</li><li>02</li><li>03</li><li>04</li><li>05</li><li>06</li><li>07</li><li>08</li><li>09</li><li>10</li><li>11</li><li>12</li><li>13</li><li>14</li><li>15</li><li>16</li><li>17</li><li>18</li><li>19</li><li>20</li><li>21</li><li>22</li><li>23</li><li>24</li><li>25</li><li>26</li><li>27</li><li>28</li><li>29</li><li>30</li><li>31</li><li>32</li><li>33</li><li>34</li><li>35</li><li>36</li><li>37</li><li>38</li><li>39</li><li>40</li><li>41</li><li>42</li><li>43</li><li>44</li><li>45</li><li>46</li><li>47</li><li>48</li><li>49</li><li>50</li><li>51</li><li>52</li><li>53</li><li>54</li><li>55</li><li>56</li><li>57</li><li>58</li><li>59</li>';*/

 			var hour_str = '';
 			for(var i=0; i<24; i++) {
 				hour_str += '<li' + (i===hour ? ' class="today"':'') + '>' + i.toLead(2) + '</li>';
 			}

 			var minute_str = '';
 			for(var i=0; i<60; i++) {
 				minute_str += '<li' + (i===minute ? ' class="today"':'') + '>' + i.toLead(2) + '</li>';
 			}

 			var second_str = '';
 			for(var i=0; i<60; i++) {
 				second_str += '<li' + (i===second ? ' class="today"':'') + '>' + i.toLead(2) + '</li>';
 			}

 			var his_str ='<ul class="date-picker-list date-picker-hour" id="date_picker_hour">' + hour_str + '</ul>'
 						+'<ul class="date-picker-list date-picker-minute" id="date_picker_minute">' + minute_str + '</ul>'
 						+'<ul class="date-picker-list date-picker-second" id="date_picker_second">' + second_str + '</ul>'

 			$("#date_picker_years").after(his_str);

 		},

 		_event:function(){
 			var _this = this;

 			//	上一月
 			$("#date_month_prev").click(function(){
 				// 	设置天数为当前天数与上一月总天数中较小的那个
 				_this.selectDay.setDate(Math.min(_this.selectDay.getDate(),_this.allDates(_this.selectDay,-1)));
 				_this.selectDay.setMonth(_this.selectDay.getMonth() - 1);
 				_this.init(_this.selectDay);
 			})

 			//	下一月
 			$("#date_month_next").click(function(){
 				// 	设置天数为当前天数与下一月总天数中较小的那个
 				_this.selectDay.setDate(Math.min(_this.selectDay.getDate(),_this.allDates(_this.selectDay,1)));
 				_this.selectDay.setMonth(_this.selectDay.getMonth() + 1);
 				_this.init(_this.selectDay);
 			})

 			//	上一年
 			$("#date_year_prev").click(function(){
 				//	日期为2月29日时，设置天数为 28，避免跳转到 3月1日
 				if(_this.selectDay.getMonth()===1 && _this.selectDay.getDate()===29){
 					_this.selectDay.setDate(28);
 				}
 				_this.selectDay.setFullYear(_this.selectDay.getFullYear() - 1);
 				_this.init(_this.selectDay);
 			})

 			//	下一年
 			$("#date_year_next").click(function(){
 				//	日期为2月29日时，设置天数为 28，避免跳转到 3月1日
 				if(_this.selectDay.getMonth()===1 && _this.selectDay.getDate()===29){
 					_this.selectDay.setDate(28);
 				}
 				_this.selectDay.setFullYear(_this.selectDay.getFullYear() + 1);
 				_this.init(_this.selectDay);
 			})

 			var _ele_year = $("#date_picker_years"),
 				_ele_week = $("#date_picker_week"),
 				_ele_day  = $("#date_picker_day"),
 				_ele_hour = $("#date_picker_hour"),
 				_ele_minute = $("#date_picker_minute"),
 				_ele_second = $("#date_picker_second");

 			//	弹出年份开列表
 			$("#datePickerYears").click(function(){
 				var _year 		= parseInt($("#datePickerYears").text()),
 					_yearhtml 	= "";
 				for(var i = 2050; i > 1900; i--){
 					_yearhtml += '<li '+(i===_year?'class="today"':'')+'>'+i+'</li>';
 				}
 				_ele_year.html(_yearhtml);
 				_ele_year.show();
 				_ele_week.hide();
 				_ele_day.hide();
 			})

 			// 	选择年份
 			_ele_year.click(function(e){
 				var target 	= $(e.target),
 					newYear = new Date(_this.selectDay);
 				//	日期为2月29日时，设置天数为 28，避免跳转到 3月1日
 				if(newYear.getMonth()===1 && newYear.getDate()===29){
 					newYear.setDate(28);
 				}
 				newYear.setFullYear(parseInt(target.text()));
 				_this.selectDay = newYear;
 				_this.init(_this.selectDay);
 				_ele_year.hide();
 				_ele_week.show();
 				_ele_day.show();
 			});

 			// 选择小时
 			_ele_hour.click(function(e){
 				var target 	= $(e.target),
 					newDate = new Date(_this.selectDay);
 				newDate.setHours(parseInt(target.text()));
 				_this.selectDay = newDate;
 				_ele_hour.hide();
 				_ele_minute.show();
 			});

 			// 选择分钟
 			_ele_minute.click(function(e){
 				var target 	= $(e.target),
 					newDate = new Date(_this.selectDay);
 				newDate.setMinutes(parseInt(target.text()));
 				_this.selectDay = newDate;
 				_ele_minute.hide();
 				_ele_second.show();
 			});

 			// 选择秒
 			_ele_second.click(function(e){
 				var target 	= $(e.target),
 					newDate = new Date(_this.selectDay);
 				newDate.setSeconds(parseInt(target.text()));
 				_this.selectDay = newDate;
 				_this.callback(newDate);
 			});

 			// 	选择天
 			_ele_day.click(function(e){
 				var target = $(e.target);
 				var month  =  _this.selectDay.getMonth(),newDate = new Date(_this.selectDay);
 				if(target.hasClass("old-days")){
 					newDate.setMonth(month - 1);
 				}

 				if(target.hasClass("new-days")){
 					newDate.setMonth(month + 1);
 				}
 				newDate.setDate(parseInt(target.text()));
 				_this.selectDay = newDate;
 				if(_this.selectHis){
 					_ele_week.hide();
 					_ele_day.hide();
 					_ele_hour.show();
 				}else{
 					_this.callback(newDate);
 				}
 			})

 			$("#date_today").click(function(){
 				_this.selectDay = new Date();
 				if(_this.selectHis){
 					_ele_week.hide();
 					_ele_day.hide();
 					_ele_hour.show();
 				}else{
 					_this.callback(_this.selectDay);
 				}
 			})
 		}
 	};

 	//	方法名称：onSelect - 选择日期后，回调函数
 	datepicker.prototype.onSelect = function(callback){
 		if(typeof(callback) == "function"){
 			this.callback = callback;
 		}
 	};


 	//	兼容 AMD 规范
 	if ( typeof define === "function" && define.amd ) {
 		define( "datepicker", ['jquery'], function($) {
 			return datepicker;
 		});
 	}

 	/*
 	 **	插件名称：datepicker
 	 *
 	 *	语法 - $(inputSelector).datepicker(time,callback);
 	 *
 	 **	参数配置：
 	 *		time -	日期和时间格式，默认为Y-m-d;
 	 *		callback -	选择时期时间后的回调函数
 	 *
 	 **	属性配置
 	 *		Input data-lang 属性， 可选，定义模板语言，默认为中文
 	 *			data-lang = "zh-cn" -	中文
 	 *			data-lang = "en-us" -	英文
 	 *
 	*/
 	$.fn.extend({
 	    datepicker:function(format,callback){
 	    	if(format){
 	    		if(format === true){
 	    			var _format = 'Y-m-d H:i:s';
 	    		}else{
 	    			var _format = format;
 	    		}
 	    	}else{
 	    		var _format = 'Y-m-d';
 	    	}

 	    	var selectHis = /[HhGgis]/.test(_format) ? true : false;

 			$(this).each(function(){
 				var _input = $(this),
 					lang   = _input.attr("data-lang");
 				if(lang !== 'en-us' && lang !== 'zh-cn'){
 		    		lang = 'zh-cn';
 		    	}
 				_input.focus(function(){
 					var date_picker_box = $("#datepicker");
 					// 移除其它日期面板
 					if(date_picker_box.length > 0){
 						date_picker_box.remove();
 					}

 					var _val   = $(this).val();

 					new datepicker(_val,selectHis,lang).onSelect(function(date){
 						//	将选定日期赋给 input
 						_input.val(date.Format(_format));

 						if(typeof(callback) == "function") callback(date);

 						// 清除日期时间面板
 						date_picker_box.removeClass("visible");
 						window.setTimeout(function(){
 							date_picker_box.remove();
 						},300)
 					});

 					date_picker_box = $("#datepicker");
 					// 计算 input 位置
 					var _inputPos = {
 						width   : _input.outerWidth(),
 						height  : _input.outerHeight(),
 						position: _input.offset()
 					}

 					// 计算日期时间面板位置
 					date_picker_box.css({
 						"left"    : _inputPos.position.left + _inputPos.width - date_picker_box.outerWidth() + "px",
 						"top"   : _inputPos.position.top + _inputPos.height + 8 + "px"
 					})
 					date_picker_box.addClass("visible");
 				});
 				$(this).on("mouseup",function(e){
 					e.stopPropagation();
 				});
 			});
 			$(document).on("mouseup",function(e){
 				if(!$(e.target).parents("#datepicker").length > 0 ){
 					var datepickerbox = $("#datepicker");
 					datepickerbox.removeClass("visible");
 					window.setTimeout(function(){
 						datepickerbox.remove();
 					},300)
 				}
 			});
 	    }
 	})
 }));




 $("#dateYear").datepicker();
 $("#date").datepicker(true, function(date){
     alert("选定时间是：" + date);
 });
 $(".mydate").datepicker(true);
