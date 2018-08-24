/*!
 *	===========================================================
 *	== 作者：你爱谁如鲸向海(www.alvinhtml.com/me) - 2015-05-04 ==
 * 	===========================================================
 *
 * 	插件名称：topology v1.1
 * 	http:www.alvinhtml.com/plugins/miuitopo
 *
 *  版本特性：
 */

(function(factory) {
	// if (typeof define === "function" && define.amd) {
	// 	//兼容 AMD 规范
	// 	define("topology", [], factory);
	// } else {
		//全局模式
		window.mTopo = factory();
	// }
}(function() {
	//画布更新
	window.RAF = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();


	//获取元素相对于窗口左边的距离
	function offsetTop(elements) {
		var top = elements.offsetTop;
		var parent = elements.offsetParent;
		while (parent != null) {
			top += parent.offsetTop;
			parent = parent.offsetParent;
		};
		return top;
	};

	//获取元素相对于窗口顶端边的距离
	function offsetLeft(elements) {
		var left = elements.offsetLeft;
		var parent = elements.offsetParent;
		while (parent != null) {
			left += parent.offsetLeft;
			parent = parent.offsetParent;
		};
		return left;
	};

	//JS合并对象
	var extend = function(o, n) {
		for (var p in n) {
			if (n.hasOwnProperty(p)) {
				o[p] = n[p];
			}
		}
		return o;
	};

	//计时器
	function timer() {
		this.stime = 0;
	}
	timer.prototype.start = function() {
		this.stime = new Date().getTime();
	}
	timer.prototype.run = function(callback, timediff) {
		if (new Date().getTime() - this.stime < timediff) {
			callback();
		}
	}
	var Timer = new timer();


	//资源加载器
	function Load() {
		var _this = this;

		//待加载的图片文件
		var imgs = [];

		//定义文件总个数
		this.totallength;

		//当前加载资源的ID
		var imageId = 0;

		//已经加载好的资源池
		this.resource = [];

		//加载完成后的回调函数
		this.callback;

		//装截要加载的对象
		this.addResource = function(src) {
			if (src instanceof Array) {
				imgs = src;
			}
		}

		//开始加载
		this.startLoad = function(callback) {

			this.callback = callback;

			//计算文件总个数
			this.totallength = imgs.length;

			if (this.totallength === 0) {
				this.callback(0);
			} else {
				this.loadImag(callback);
			}

		}

		//加载图片
		this.loadImag = function() {

			var _this = this;

			var imageObj = new Image();

			imageObj.src = imgs[imageId];

			imageObj.onload = function() {
				//如果加载成功
				if (imageObj.complete == true) {
					_this.resource.push(imageObj);
					imageId++;
					if (imageId < imgs.length) {
						_this.loadImag();
					} else {
						_this.callback(_this.resource);
					}
				}
			}
		}
	}

	//预设节点容器
	var brushPresets = [];

	//创建新的topo对象
	function mtopo(box) {
		var t = new topology(box);

		this.brushPresets = brushPresets;

		//添加节点
		this.addNode = function(id, name, type) {

			return t.addNode(id, name, type);

		}

		//添加连线
		this.addLink = function(node1, node2) {
			t.addLink(node1, node2);
		}

		//加载资源
		this.load = function(resource,callback){
			//定义一个加载实例
			var myLoad = new Load();

			//装载图片资源
			myLoad.addResource(resource);

			//加截图片并在完成后执行回调函数
			myLoad.startLoad(callback);
		}

		//初始化
		this.init = function(obj) {
			t.init(obj);
		}

		//清除数据
		this.clear = function(obj) {
			t.clear();
		}

		//设置根节点
		this.setRoot = function(node) {
			t.setRoot(node);
		}

		//开启与关闭连线
		this.startLink = function(callback) {
			t.linking = true;
			t.linkCallBack = callback;
		}
		this.stopLink = function(node) {
			t.linking = false;
			if (t.selectedMc) t.selectedMc.selected = 0;
			t.selectedMc = undefined;
			t.linkCallBack = undefined;
		}

		//设置节点是否可见
		this.setVisible = function(node, visible) {
			t.setVisible(node, visible);
		}

		//刷新画布
		this.refresh = function() {
			t.paint();
		}

		//添加事件
		this.on = function(event, fn) {
			if (typeof fn === "function") {
				if (event === "mousemove" || event === "click") {
					t.addEvent(event, fn);
				}
			}
		}

		//获取图片
		this.getImage = function(type) {
			return t.getImage(type);
		}

		//获取节点信息
		this.getJSON = function(type) {
			return t.getJSON();
		}
	}




	//添加节点类型
	mtopo.prototype.addBrush = function(width, height, fn) {
		return addBrush(width, height, fn);
	}

	//添加节点类型
	var addBrush = function(width, height, fn) {
		if (typeof fn === "function") {
			var cacheCanvas = document.createElement("canvas");
			var cacheCtx = cacheCanvas.getContext("2d");
			cacheCanvas.width = width;
			cacheCanvas.height = height;
			fn(cacheCtx);
			return cacheCanvas;
		}
	}

	//添加默认的预设节点
	//添加交换机节点画笔：向上的端口
	brushPresets.push(addBrush(32, 24, function(ctx) {
		ctx.strokeStyle = '#181e1f';
		ctx.lineWidth = 2;
		g = ctx.createLinearGradient(0, 0, 0, 24);
		g.addColorStop(0, "#2b2725");
		g.addColorStop(1, "#5d5852");
		ctx.fillStyle = g;
		ctx.beginPath();
		ctx.moveTo(9, 1);
		ctx.lineTo(9, 3);
		ctx.lineTo(7, 3);
		ctx.lineTo(7, 5);
		ctx.lineTo(1, 5);
		ctx.lineTo(1, 23);
		ctx.lineTo(31, 23);
		ctx.lineTo(31, 5);
		ctx.lineTo(25, 5);
		ctx.lineTo(25, 3);
		ctx.lineTo(23, 3);
		ctx.lineTo(23, 1);
		ctx.lineTo(9, 1);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}));


	//添加交换机节点画笔：向下的端口
	brushPresets.push(addBrush(32, 24, function(ctx) {
		ctx.strokeStyle = '#181e1f';
		ctx.lineWidth = 2;
		g = ctx.createLinearGradient(0, 0, 0, 24);
		g.addColorStop(0, "#2b2725");
		g.addColorStop(1, "#5d5852");
		ctx.fillStyle = g;
		ctx.beginPath();
		ctx.moveTo(1, 1);
		ctx.lineTo(1, 19);
		ctx.lineTo(7, 19);
		ctx.lineTo(7, 21);
		ctx.lineTo(9, 21);
		ctx.lineTo(9, 23);
		ctx.lineTo(23, 23);
		ctx.lineTo(23, 21);
		ctx.lineTo(25, 21);
		ctx.lineTo(25, 19);
		ctx.lineTo(31, 19);
		ctx.lineTo(31, 1);
		ctx.lineTo(1, 1);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}));

	//添加交换机节点画笔：终端
	brushPresets.push(addBrush(26, 24, function(ctx) {
		ctx.fillStyle = "#464b4c";
		ctx.fillRect(0, 0, 26, 20);
		ctx.fillRect(4, 22, 20, 2);
		ctx.fillRect(12, 20, 4, 2);
		g = ctx.createLinearGradient(2, 2, 23, 17);
		g.addColorStop(0, "#67809f");
		g.addColorStop(1, "#9fb0c2");
		ctx.fillStyle = g;
		ctx.fillRect(2, 2, 22, 16);
	}));


	//鼠标按下事件
	var EVENT_MOUSE_DOWN = "event_mouse_down";

	//鼠标移动事件
	var EVENT_MOUSE_MOVE = "event_mouse_move";

	//鼠标松开事件
	var EVENT_MOUSE_UP = "event_mouse_up";

	//鼠标松开事件
	var EVENT_MOUSE_SCROLL = "event_mouse_scroll";

	//鼠标X
	var mouseX = 0;

	//鼠标Y
	var mouseY = 0;

	//鼠标相对于页面X
	var pageX = 0;

	//鼠标相对于页面Y
	var pageY = 0;

	//事件对象
	function Event2D(event, callback) {
		//事件类型
		this.event = event;

		//事件回调函数
		this.callback = callback;
	}


	/*
	 *	topology(box)
	 * 	box - canvas容器
	 */
	var ratio;

	function topology(box) {
		if (!box) {
			return false;
		}



		//	获取容器的宽和高，实际也是canvas的宽和高
		this.width = box.clientWidth;
		this.height = box.clientHeight;

		//	创建 canvas 和图形上下文
		box.innerHTML = '<canvas width="' + this.width + '" height="' + this.height + '"></canvas>';

		this.canvas = box.getElementsByTagName('canvas')[0];
		this.context = this.canvas.getContext('2d');


		//	获取容器相对于当前视窗的偏移，实际上也是canvas相对于当前视窗的偏移
		this.offset = {
			top: offsetTop(box),
			left: offsetLeft(box)
		}

		this.eventlist = [];

		//	当前画布的缩放和位置
		this.scale = 1;
		this.translateX = 0;
		this.translateY = 0;

		this.linking = false;

		//创建场景管理器
		var coreStage2d = this;

		//前景对象容器
		this.nodeList = [];

		//背景对象容器
		this.bgList = [];

		//时间
		this.time = new Date();

		//属性
		this.textStyle = {
			align: "center",
			color: "#333",
			substr: 28,
			font: "14px Helvetica"
		}
		this.lineStyle = {
			type: "line",
			color: "#666666",
			width: 1
		}

		//侦听器容器
		this.eventList = [];

		//添加事件监听
		document.addEventListener("mouseup", function(e) {
			coreStage2d.stageMouseUp(e);
		}, false);
		this.canvas.addEventListener("mousedown", function(e) {
			coreStage2d.stageMouseDown(e);
		}, false);
		this.canvas.addEventListener("mousemove", function(e) {
			coreStage2d.stageMouseMove(e);
		}, false);

		this.canvas.addEventListener("DOMMouseScroll", function(e) {
			coreStage2d.stageScroll(e);
		}, false);

		this.canvas.onmousewheel = function(e) {
			coreStage2d.stageScroll(e);
		}

		//注册鼠标按下侦听器
		coreStage2d.addEventListener(new Event2D(EVENT_MOUSE_DOWN, downFun));

		//注册鼠标移动侦听器
		coreStage2d.addEventListener(new Event2D(EVENT_MOUSE_MOVE, moveFun));

		//注册鼠标松开侦听器
		coreStage2d.addEventListener(new Event2D(EVENT_MOUSE_UP, upFun));

		//定义当前响影事件的对象
		var targetMc;
		this.selectedMc;

		//记录场景变换前坐标
		var lastX, lastY, lastTarget;

		function upFun(e) {
			//时间差小于300ms，并且鼠标没有移动，触发点击事件
			if (lastX === mouseX, lastY === mouseY) {
				Timer.run(function() {
					for (var i = 0; i < coreStage2d.eventlist.length; i++) {
						if (coreStage2d.eventlist[i].event === "click") {
							coreStage2d.eventlist[i].callback({
								target: e,
								mouseX: mouseX,
								mouseY: mouseY,
								pageX: pageX,
								pageY: pageY
							});
						}
					}
				}, 300)
			}



			if (e && e !== "stage2d") {
				if (coreStage2d.selectedMc && e.id !== coreStage2d.selectedMc.id) {
					coreStage2d.linkCallBack(coreStage2d.selectedMc, e);
					coreStage2d.selectedMc.selected = 0;
					coreStage2d.selectedMc = undefined;
				}
			}
			if (targetMc && !coreStage2d.linking) {
				targetMc.selected = 0;
			}

			targetMc = null;
		}

		function moveFun(e) {

			//鼠标移动事件回调

			for (var i = 0; i < coreStage2d.eventlist.length; i++) {
				if (coreStage2d.eventlist[i].event === "mousemove") {
					//type == mouseover mouseout  stage2d
					coreStage2d.eventlist[i].callback({
						target: e,
						lasttarget: lastTarget || "",
						mouseX: mouseX,
						mouseY: mouseY,
						pageX: pageX,
						pageY: pageY
					});
				}
			}



			//如果移动鼠标时点击对象不为空,说明我们正在拖拽一个对象
			if (targetMc != null) {
				if (targetMc === "stage2d" || !targetMc.isDrag) {
					coreStage2d.translateX = coreStage2d.translateX + mouseX - lastX;
					coreStage2d.translateY = coreStage2d.translateY + mouseY - lastY;
					lastX = mouseX;
					lastY = mouseY;
				} else {
					targetMc.x = (mouseX - coreStage2d.translateX) / coreStage2d.scale
					targetMc.y = (mouseY - coreStage2d.translateY) / coreStage2d.scale
				}
			}

			lastTarget = e;
		}

		function downFun(e) {
			Timer.start();
			if (e != null) {
				e.selected = 1;
				if (!coreStage2d.linking) {
					lastX = mouseX;
					lastY = mouseY;
					targetMc = e;
				} else { //连线模式
					if (e !== "stage2d") {
						if (coreStage2d.selectedMc && e.id !== coreStage2d.selectedMc.id) {
							coreStage2d.linkCallBack(coreStage2d.selectedMc, e);
							coreStage2d.selectedMc.selected = 0;
							e.selected = 0;
							coreStage2d.selectedMc = undefined;
						} else {
							coreStage2d.selectedMc = e;
						}
					} else {
						coreStage2d.selectedMc = 0;
						coreStage2d.selectedMc = undefined;
					}
				}
			}
		}
	}

	/* 	@初始化函数
	 * 	attribute:{
			scale:1,
			translateX:0,
			translateY:0,
			type:"tree", //"tree"、"switch"
			tooltip:false,//function(e){}
			orient:"orient", //树的方向可选：'vertical' | 'horizontal' | 'radial'
			lineStyle:{
				type:"line", //线条类型，可选为：'curve'（曲线） | 'line'（直线）
				color:"#666666",
				width:1,
			},
			distanceX:100,
			distanceY:100,
			textStyle:{
				align:"center",
				color:"#333",
				font:"14px Helvetica",
			}
		}
	 *
	*/
	topology.prototype.init = function(obj) {
		//console.log("init");
		var _this = this;
		//合并参数到默认属性
		this.scale = obj.scale ? parseFloat(obj.scale) : 1;
		this.translateX = obj.translateX ? parseInt(obj.translateX) : 0;
		this.translateY = obj.translateY ? parseInt(obj.translateY) : 0;
		this.orient = obj.orient ? obj.orient : "vertical";
		this.distanceX = obj.distanceX ? parseInt(obj.distanceX) : 100;
		this.distanceY = obj.distanceY ? parseInt(obj.distanceY) : 100;

		this.textStyle = {
			align: "center",
			color: "#333",
			font: "14px Helvetica",
			substr: Math.floor(this.distanceX / 12)
		}
		this.lineStyle = {
			type: "line", //线条类型，可选为：'curve'（曲线） | 'line'（直线）
			color: "#666666",
			width: 1
		}

		if (obj.lineStyle) extend(this.lineStyle, obj.lineStyle);
		if (obj.textStyle) extend(this.textStyle, obj.textStyle);

		//工具提示
		if (obj.tooltip) {
			//创建提示框
			this.tooltipElem = document.createElement('div');

			this.tooltipElem.setAttribute("style", "position:fixed; z-index: 99;" + "white-space: nowrap;" + "display:none;" + "transition: left 0.4s ease-in-out, top 0.4s ease-in-out;" + "background-color: rgba(0, 0, 0, 0.7);" + "border-radius: 4px;" + "color: rgb(255, 255, 255);" + "font-size: 12px;" + "line-height: 18px;" + "font-style: normal;" + "font-weight: normal;" + "padding: 5px;" + "max-width: 420px;");

			document.body.appendChild(this.tooltipElem);

			var tooltipTimer;

			//绑定鼠标移动事件
			this.addEvent("mousemove", function(e) {
				if (e.target === "stage2d") {
					if (!tooltipTimer) {
						tooltipTimer = window.setTimeout(function() {
							_this.tooltipElem.style.display = "none";
						}, 800);
					}
				} else {
					if(e.target.name === ""){
						_this.tooltipElem.style.display = "none";
						return false;
					}

					window.clearTimeout(tooltipTimer);
					tooltipTimer = undefined;

					_this.tooltipElem.style.display = "block";
					_this.tooltipElem.style.left = pageX + 20 + 'px';
					_this.tooltipElem.style.top = pageY + 'px';

					if (typeof obj.tooltip === "function") {
						//自定义提标框内容
						if (e.target.id != e.lasttarget.id || "stage2d") _this.tooltipElem.innerHTML = obj.tooltip(e.target);

					} else {

						//默认只显示名称
						_this.tooltipElem.innerHTML = e.target.name;
					}
				}
			});
		}
		//rgba(0, 0, 0, 0) url("../images/logo_h3c.png") no-repeat scroll center top

		if (obj.hasOwnProperty("data")) {
			_this.data = obj.data;
		}



		//console.time("init");
		if (obj.type === "switch") {
			_this.drawSwitch();
		} else {
			_this.drawTree();
		}
		//console.timeEnd("init");
		_this.paint();
	}

	//树形图
	topology.prototype.drawTree = function(res) {

		//遍历结点，设置child
		var nodeTree = new Array();
		var item;
		while (this.nodeList.length) {

			item = this.nodeList.shift();

			if (item.rel && item.rel.length) {
				for (var k = 0; k < item.rel.length; k++) {
					if (typeof item.rel[k].layer === "undefined") {
						if (item.layer) {
							if (typeof item.child === "undefined") {
								item.child = new Array();
							}

							item.child.push(item.rel[k]);
							item.rel[k].layer = item.layer + 1;
						}
					} else {
						if (!item.layer) {
							if (typeof item.rel[k].child === "undefined") {
								item.rel[k].child = new Array();
							}
							item.rel[k].child.push(item);
							item.layer = item.rel[k].layer + 1;
						}
					}
				}
			}

			if (item.layer) {
				nodeTree.push(item);
			} else {
				if (item.viewcount) {
					item.layer = 1;
					item.viewcount = undefined;
					this.nodeList = this.nodeList.concat(item);
				} else {
					item.viewcount = 1;
					this.nodeList = this.nodeList.concat(item);
				}
			}
		}

		//console.log("tree",nodeTree);

		// 无连线node容器
		var unlinenode = new Array();


		this.nodeList = nodeTree.concat();

		nodeTree = new Array();


		for (var k = 0; k < this.nodeList.length; k++) {

			//console.log(this.nodeList[k].id,this.nodeList[k].layer,typeof this.nodeList[k].child);

			if (this.nodeList[k].layer === 1) {
				if (typeof this.nodeList[k].child === "undefined" && !this.nodeList[k].x && !this.nodeList[k].y) {
					unlinenode.push(this.nodeList[k]);
				} else {
					nodeTree.push(this.nodeList[k]);
				}
			}
		}
		//console.log("nodeTree",nodeTree.length);

		// 树形结构的层数，node 最大行高
		var nodeLayer = 0;

		//将每个节点 设置为包含它自身子节点的树形结构
		var whileTree = function(tree, row, col, parent) {
			var nodeAll = 0;
			var llen = col;
			for (var k = 0; k < tree.length; k++) {
				var nodeLen = 1;
				if (tree[k].child && tree[k].child.length) {
					col = llen + nodeAll;
					nodeLen = whileTree(tree[k].child, row + 1, col, tree[k]);
					nodeAll += nodeLen;
					tree[k].col = col + (nodeLen / 2) + 0.5;
				} else {
					nodeAll += 1;
					tree[k].col = llen + nodeAll;
				}
				tree[k].row = row;
				nodeLayer = nodeLayer > row ? nodeLayer : row;
				tree[k].nodeLen = nodeLen;
			}

			return nodeAll;
		}


		this.nodeLen = whileTree(nodeTree, 1, 0, null);
		this.nodeLayer = nodeLayer;

		//console.log("this.nodeLayer",this.nodeLayer);

		var colnum = Math.floor(this.width / this.distanceX),
			rowlarer = this.nodeLayer,
			remainder;

		// 计算无连线node的 row 和 col
		for (var u = 0; u < unlinenode.length; u++) {
			//console.log(unlinenode[u].name,unlinenode[u]);
			remainder = u % colnum;
			if (remainder == 0) {
				rowlarer++;
			}
			unlinenode[u].col = remainder + 1;
			unlinenode[u].row = rowlarer;
		}
		//console.log(this.nodeLen, colnum, unlinenode.length);

		// this.nodeLen - node最大列宽
		// colnum       - 画布最大node数
		// unlinenode   - 无连线node 宽度
		this.nodeLen = Math.max(Math.min(unlinenode.length, colnum), this.nodeLen);


		this.setOrient();
	}

	//交换机面板图
	topology.prototype.drawSwitch = function(res) {
		var _this = this;

		//定义端口容器、终端容器
		var port_obj = {},
			term_arr = [];

		//模块和插槽个数
		var moduleNum = 0,
			rabbetNum = 0;


		//分离出端口和终端
		for (var i = this.nodeList.length; i--;) {

			if (this.nodeList[i].type === "port") {

				if (!port_obj.hasOwnProperty(this.nodeList[i].module)) {
					port_obj[this.nodeList[i].module] = new Object;
					moduleNum++;
				}

				if (!port_obj[this.nodeList[i].module].hasOwnProperty(this.nodeList[i].rabbet)) {
					port_obj[this.nodeList[i].module][this.nodeList[i].rabbet] = new Array;
					rabbetNum++;
				}

				port_obj[this.nodeList[i].module][this.nodeList[i].rabbet].unshift(this.nodeList[i]);

				this.nodeList[i].isDrag = 0;

			}
		}



		//插槽容器
		var rabbet_arr = new Array;

		//最大插槽宽
		var maxRabberWidth_num = 0;

		//计算插槽和端口位置
		var im_num = 0,
			ir_num = 0,
			ip_num = 0;
		for (var im in port_obj) {
			for (var ir in port_obj[im]) {

				//计算端口位置
				var ports = port_obj[im][ir];
				for (var k = ports.length; k--;) {
					//console.log(ports[k].rel);
					if (!(k % 2)) {
						//上排
						ports[k].x = Math.floor(k / 2) * 31 + 39;
						ports[k].y = ir_num * 368 + 231;
						ports[k].textOffsetY = 10;
						ip_num = ir_num * 2;
						if(ports[k].rel)
			    		{
			    			ports[k].rel[0].x = ports[k].x;
				    		ports[k].rel[0].y = ports[k].y - (k%4>1?130:75);
			    		}
					} else {
						//下排
						ports[k].x = Math.floor(k / 2) * 31 + 39;
						ports[k].y = ir_num * 368 + 266;
						ports[k].textOffsetY = -1;
						ip_num = ir_num * 2 + 1;
						ports[k].gotoAndStop(ports[k].currentFrame + 6);

						if(ports[k].rel)
			    		{
			    			ports[k].rel[0].x = ports[k].x;
				    		ports[k].rel[0].y = ports[k].y + (k%4>1?117:62);
			    		}
					}
				}
				var rabber_width = Math.ceil(ports.length / 2) * 31 + 23;

				//计算插槽位置
				rabbet_arr.push({
					name: im + '/' + ir + '/*',
					x: 12,
					y: ir_num * 368 + 204,
					width: rabber_width,
					height: 89
				});
				maxRabberWidth_num = Math.max(maxRabberWidth_num, rabber_width);
				ir_num++;
			}
			im_num++;
		}

		// 交换机最小高
		rabbetNum = Math.max(1,rabbetNum);

		var switch_w = Math.max(maxRabberWidth_num + 266,980),
			switch_h = rabbetNum * 368 + 128,
			switch_x = switch_w / 2,
			switch_y = switch_h / 2;

		//创建CPU元素
		var cpuItem = new MovieClip2D();
			cpuItem.data = _this.data.cpu;
			//创建画图缓存
			cpuItem.createCache(154, 60, function(ctx,data) {
				var cpuInt = Math.max(Math.floor(parseInt(data) / 10 * 2),1);
				//画灰色格子
				ctx.fillStyle = '#bcbcbc';
				for (var i = 0; i < 20-cpuInt; i++){
					for(var o = 0; o < 40; o++){
						ctx.fillRect(o*3+34, i*3, 2, 2);
					}
				}
				//画绿色格子
				if(data!=-1){
					ctx.fillStyle = parseInt(data) > 80 ? '#fd0100' : '#32cd34';
					for (var i = 20-cpuInt; i < 20; i++){
						for(var o = 0; o < 40; o++){
							ctx.fillRect(o*3+34, i*3, 2, 2);
						}
					}
				}
				ctx.font="14px";
				if(data!=-1) ctx.fillText(data + "%",0,35);
				ctx.fillStyle = '#666666';
				ctx.fillText("CPU",0,10);
			});
			cpuItem.name = "";
			cpuItem.type = "cpu";
			cpuItem.id = "cpu";
			cpuItem.width = 154;
			cpuItem.height = 60;
			cpuItem.x = switch_w-122;
			cpuItem.y = 126;
			cpuItem.isDrag = false;
			this.nodeList.push(cpuItem);

		//创建内存元素
		var memItem = new MovieClip2D();
			memItem.data = _this.data.mem;
			//创建画图缓存
			memItem.createCache(154, 60, function(ctx,data) {
				var memInt = Math.max(Math.floor(parseInt(data) / 10 * 2),1);
				//画灰色格子
				ctx.fillStyle = '#bcbcbc';
				for (var i = 0; i < 20-memInt; i++){
					for(var o = 0; o < 40; o++){
						ctx.fillRect(o*3+34, i*3, 2, 2);
					}
				}
				//画绿色格子
				if(data!=-1){
					ctx.fillStyle = parseInt(data) > 80 ? '#fd0100' : '#f7a303';
					for (var i = 20-memInt; i < 20; i++){
						for(var o = 0; o < 40; o++){
							ctx.fillRect(o*3+34, i*3, 2, 2);
						}
					}
				}
				ctx.font="14px";
				if(data!=-1) ctx.fillText(data + "%",0,35);
				ctx.fillStyle = '#666666';
				ctx.fillText("内存",0,10);
			});
			memItem.name = "";
			memItem.type = "mem";
			memItem.id = "mem";
			memItem.width = 154;
			memItem.height = 60;
			memItem.x = switch_w-122;
			memItem.y = 226;
			memItem.isDrag = false;
			this.nodeList.push(memItem);

		//创建流量统计元素
		var flowItem = new MovieClip2D();
			flowItem.data = _this.data.flow;
			//创建画图缓存
			flowItem.createCache(154, 102, function(ctx,data) {

				var upArr = data.up, downArr = data.down;
				//计算出最大流量值
				var flowMax = 100; //Math.max(Math.max.apply(null, upArr),Math.max.apply(null, downArr));

				ctx.beginPath();
				ctx.strokeStyle = '#bcbcbc';
				ctx.lineWidth = 1;
				ctx.moveTo(33.5,0);
				ctx.lineTo(33.5,66.5);
				ctx.lineTo(154.5,66.5);
				ctx.stroke();


				ctx.beginPath();
				ctx.moveTo(150.5,64.5);
				ctx.lineTo(150.5,68.5);
				ctx.lineTo(154.5,66.5);
				ctx.lineTo(150.5,64.5);
				ctx.stroke();

				ctx.beginPath();
				ctx.strokeStyle = '#32cd34';
				ctx.moveTo(33.5,72);
				ctx.lineTo(33.5,85);
				ctx.stroke();


				//入流量折线
				if(upArr[0] != -1){
					ctx.beginPath();
					ctx.moveTo(33.5,Math.floor(upArr[0]/flowMax*66));
					for(var i=1;i<upArr.length;i++){
						ctx.lineTo(i*2+33.5,66-Math.floor(upArr[i]/flowMax*66));
					}
					ctx.stroke();
				}


				ctx.beginPath();
				ctx.strokeStyle = '#f7a303';
				ctx.moveTo(73.5,72);
				ctx.lineTo(73.5,85);
				ctx.stroke();

				//出流量折线
				if(downArr[0] != -1){
					ctx.beginPath();
					ctx.moveTo(33.5,Math.floor(downArr[0]/flowMax*66));
					for(var i=1;i<downArr.length;i++){
						ctx.lineTo(i*2+33.5,66-Math.floor(downArr[i]/flowMax*66));
					}
					ctx.stroke();
				}

				ctx.font="14px";
				//ctx.fillText(data + "%",0,59);
				ctx.fillStyle = '#666666';
				ctx.fillText(100,0,10);
				ctx.fillText(0,13,66);
				ctx.fillText("CPU", 40,82);
				ctx.fillText("内存", 80,82);
			});
			flowItem.name = "";
			flowItem.type = "flow";
			flowItem.id = "flow";
			flowItem.width = 154;
			flowItem.height = 102;
			flowItem.x = switch_w-122;
			flowItem.y = 348;
			flowItem.isDrag = false;
			this.nodeList.push(flowItem);

		//创建交换机头部元素
		var sheadItem = new MovieClip2D();
			sheadItem.data = _this.data.info;
			//创建画图缓存
			sheadItem.createCache(switch_w-260, 60, function(ctx,data) {
				ctx.font = "14px Tahoma, Geneva, sans-serif";
				ctx.fillStyle = '#666666';
				ctx.fillText(data.name + '  IP：' + data.ip + '  hostname：' + data.sysname,16,34);
			});

			sheadItem.name = "";
			sheadItem.type = "title";
			sheadItem.id = "title";
			sheadItem.width = switch_w - 260;
			sheadItem.height = 60;
			sheadItem.x = (switch_w - 260) / 2;
			sheadItem.y = 30;
			sheadItem.isDrag = false;
			this.nodeList.push(sheadItem);

		//创建交换机厂商元素
		var vendorItem = new MovieClip2D();
			vendorItem.data = _this.data.info;
			//创建画图缓存  -158
			vendorItem.createCache(260, 60, function(ctx,data) {
				ctx.font = "12px Tahoma, Geneva, sans-serif";
				var textWidth = Math.min(126,ctx.measureText(data.snmpmodule).width),
					imageWidth = data.snmpvendor.width;
				ctx.drawImage(data.snmpvendor,86 ,2);
				ctx.fillStyle ="#666666";
				ctx.textAlign = "center";
				ctx.fillText(data.snmpmodule,154,57);
			});

			vendorItem.name = "";
			vendorItem.type = "vendor";
			vendorItem.id = "vendor";
			vendorItem.width = 260;
			vendorItem.height = 60;
			vendorItem.x = switch_w-130;
			vendorItem.y = 30;
			vendorItem.isDrag = false;
			this.nodeList.push(vendorItem);


		//创建交换机背景元素
		var inode = new MovieClip2D();
			inode.data = _this.data.info;
			//创建画图缓存  -158

		inode.createCache(switch_w+4, switch_h, function(ctx,data) {
			ctx.save();
			ctx.fillStyle = '#999';
			ctx.fillRect(0, 0, switch_w+4, switch_h); //头部
			ctx.fillStyle = '#e0e0e0';
			ctx.fillRect(2, 2, switch_w, 60); //头部
			ctx.fillRect(2, 64, switch_w-218, switch_h-128); //中部
			ctx.fillRect(switch_w-214, 64, 216, switch_h-128); //右栏
			ctx.fillRect(2, switch_h-62, switch_w, 60); //尾部

			//白色分区面板
			ctx.fillStyle = "#cccccc";
			//ctx.beginPath();
			for (var i = 0; i < rabbet_arr.length; i++) {
				ctx.fillRect(rabbet_arr[i].x, rabbet_arr[i].y, rabbet_arr[i].width, rabbet_arr[i].height);
			}
			ctx.fill();

			ctx.fillRect(switch_w-200, 280, 185, 1);

			if(data.opstate == "1"){
				ctx.fillStyle = '#564F8A';
				ctx.fillRect(switch_w-488,switch_h-36,10,10);
			}
			ctx.fillStyle = '#aaa19c';
			ctx.fillRect(switch_w-402,switch_h-36,10,10);
			ctx.fillStyle = '#e4ff02';
			ctx.fillRect(switch_w-316,switch_h-36,10,10);
			ctx.fillStyle = '#f7a303';
			ctx.fillRect(switch_w-230,switch_h-36,10,10);
			ctx.fillStyle = '#fd0100';
			ctx.fillRect(switch_w-146,switch_h-36,10,10);
			ctx.fillStyle = '#14b823';
			ctx.fillRect(switch_w-62,switch_h-36,10,10);

			ctx.font = "12px Tahoma, Geneva, sans-serif";
			ctx.fillStyle = '#666666';
			if(data.opstate == "1"){
				ctx.fillText("离线告警", switch_w-488, switch_h-26);
			}
			ctx.fillText("离线端口", switch_w-389, switch_h-26);
			ctx.fillText("单个终端", switch_w-303, switch_h-26);
			ctx.fillText("多个终端", switch_w-217, switch_h-26);
			ctx.fillText("告警终端", switch_w-133, switch_h-26);
			ctx.fillText("级联", switch_w-49, switch_h-26);

			if(rabbet_arr.length < 1){
				ctx.fillText("设备暂无端口信息", 16, 100);
			}


			ctx.fillText("运行时间："+data.runtime, 14, switch_h-38);
			ctx.fillText("更新时间："+data.updatetime, 14, switch_h-14);
			ctx.fillText("状态：", 224, switch_h-38);

			if(data.status == "告警") ctx.fillStyle = '#fd0100';

			ctx.fillText(data.status, 258, switch_h-38);


			ctx.restore();
		});



		inode.name = "this is switch";
		inode.type = "switchui";
		inode.id = "switchui";
		inode.width = switch_w+4;
		inode.height = switch_h;
		inode.x = switch_x;
		inode.y = switch_y;
		inode.isDrag = false;
		this.bgList.push(inode);


		this.translateX = Math.floor(this.width / 2 - switch_x);
		this.translateY = Math.floor(this.height / 2 - switch_y);
	}



	//设置方向
	topology.prototype.setOrient = function() {
		if (this.orient == "horizontal") {
			for (var i = this.nodeList.length; i--;) {
				if (!this.nodeList[i].x) this.nodeList[i].x = this.nodeList[i].row * this.distanceX;
				if (!this.nodeList[i].y) this.nodeList[i].y = this.nodeList[i].col * this.distanceY;

				/*if(this.nodeList[i].layer === 1){
					console.log("nodeLen",this.nodeLen);
					//根节点居中

	            }*/
			}
			if (this.translateY === 0) this.translateY = -(this.nodeLen + 1) * this.distanceY / 2 + this.width / 2;
		} else {
			for (var i = this.nodeList.length; i--;) {
				if (!this.nodeList[i].x) this.nodeList[i].x = this.nodeList[i].col * this.distanceX;
				if (!this.nodeList[i].y) this.nodeList[i].y = this.nodeList[i].row * this.distanceY;
				/*if(this.nodeList[i].layer === 1){

					console.log("nodeLen",this.nodeLen);
					//根节点居中

	            }*/
			}
			if (this.translateX === 0) this.translateX = -(this.nodeLen + 1) * this.distanceX / 2 + this.width / 2;
		}
	}

	//自适应页面大小
	/*topology.prototype.transformCenter = function(){

	}*/

	//清除数据
	topology.prototype.clear = function() {
		this.nodeList = [];
	}


	//重绘核心
	topology.prototype.paint = function() {


		//清理画面
		this.context.clearRect(0, 0, this.width, this.height);

		//重置画布的透明度
		this.context.globalAlpha = 1;


		this.context.save();

		/* this.context.fillStyle = '#000';
		this.context.fillRect(-2000,-2000,4000,4000);*/


		//重新设定画布偏移和缩放
		this.context.translate(this.translateX, this.translateY);
		this.context.scale(this.scale, this.scale);

		/* this.context.fillStyle = '#eee';
		this.context.fillRect(0,0,1000,1000);
		this.context.fillStyle = '#e723e8';
		this.context.fillRect(-1000,-1000,1000,1000);*/

		var vnode = this.nodeList;

		//开始画背景动画
		for (var i = 0; i < this.bgList.length; i++) {
			this.bgList[i].paint(this.context);
		}

		//开始画线
		//if (consoles) console.time("paint link");
		this.context.beginPath();
		for (var i = 0; i < this.nodeList.length; i++) {
			//如果对象可见，并且有连线
			if (this.nodeList[i].rel) {
				//遍历多条连线
				for (var k = 0; k < this.nodeList[i].rel.length; k++) {
					if (this.nodeList[i].rel[k].visible) {
						//this.paintLink(this.nodeList[i].x, this.nodeList[i].y, this.nodeList[i].rel[k].x, this.nodeList[i].rel[k].y, this.lineStyle.type);
						this.paintLink(this.nodeList[i].x,this.nodeList[i].y+this.nodeList[i].rel[k].borderOffsetY,this.nodeList[i].rel[k].x+this.nodeList[i].rel[k].borderOffsetX,this.nodeList[i].rel[k].y+this.nodeList[i].rel[k].borderOffsetY,this.lineStyle.type);
					}
				}
			}
		}

		//this.context.closePath();

		this.context.lineWidth = this.lineStyle.width;
		this.context.strokeStyle = this.lineStyle.color;
		this.context.stroke();
		//if (consoles) console.timeEnd("paint link");


		//画线模式
		if (this.selectedMc) {
			this.context.beginPath();
			this.context.setLineDash([5]);
			this.context.moveTo(this.selectedMc.x, this.selectedMc.y);
			this.context.lineTo((mouseX - this.translateX) / this.scale, (mouseY - this.translateY) / this.scale);
			this.context.closePath();
			this.context.strokeStyle = "#bbb";
			this.context.stroke();
		}



		//开始画节点
		//if (consoles) console.time("paint node");
		this.context.fillStyle = "#e0e0e0";
		for (var i = 0; i < vnode.length; i++) {
			vnode[i].paint(this.context);

			//左上角 badge 背景
			if (vnode[i].termnum && vnode[i].termnum > 1) {
				this.context.fillRect(vnode[i].x-16 ,vnode[i].y-16,12,12);
			}
		}
		//if (consoles) console.timeEnd("paint node");



		//开始画名称
		//if (consoles) console.time("paint text");
		this.context.font = this.textStyle.font;
		this.context.textAlign = this.textStyle.align;
		for (var i = 0; i < vnode.length; i++) {



			//如果单独设置了文字的color
			if (vnode[i].color) {
				this.context.fillStyle = vnode[i].color;
			} else {
				this.context.fillStyle = this.textStyle.color;
			}
			if (vnode[i].font) {
				this.context.fillStyle = vnode[i].font;
			} else {
				this.context.fillStyle = this.textStyle.font;
			}

			//显示名称
			this.context.fillText(vnode[i].name.length > this.textStyle.substr ? vnode[i].name.substr(0, this.textStyle.substr) + '...' : vnode[i].name, vnode[i].x + vnode[i].textOffsetX, vnode[i].y + vnode[i].textOffsetY);

			//左上角 badge 文字
			if (vnode[i].termnum && vnode[i].termnum > 1) {
				this.context.fillStyle = "#f7a303";
				this.context.fillText(vnode[i].termnum,vnode[i].x-14 ,vnode[i].y-8);
			}
		}
		//if (consoles) console.timeEnd("paint text");



		//console.log("conut",this.nodeList.length,vnode.length);

		this.context.restore();



		var _this = this;

		window.RAF(function() {
			_this.paint();
		})


	}

	//添加侦听器
	topology.prototype.addEventListener = function(event2D) {
		this.eventList.push(event2D)
	}

	//删除侦听器
	topology.prototype.removeEventListener = function(event2D) {
			if (this.eventList.indexOf(event2D) != -1)
				this.eventList.splice(event2D, 1);
		}
		//鼠标检测函数
	topology.prototype.isMouseEvent = function(e, event) {
			pageX = e.pageX;
			pageY = e.pageY;
			mouseX = e.pageX - this.offset.left;
			mouseY = e.pageY - this.offset.top;

			for (var i = this.nodeList.length - 1; i >= 0; i--) {
				//因为最后添加的对象在最顶上,从画面理解,上层的内容会挡住下层的内容,所以我们的事件触发循序也应该是从显示列表的最后一位开始检测

				for (var j = 0; j < this.eventList.length; j++) {
					if (this.eventList[j].event == event) {
						if (Math.abs(this.nodeList[i].x * this.scale - (mouseX - this.translateX)) <= this.nodeList[i].width * this.scale / 2 && Math.abs(this.nodeList[i].y * this.scale - (mouseY - this.translateY)) <= this.nodeList[i].height * this.scale / 2) {
							this.eventList[j].callback(this.nodeList[i]);
							return;
						} else {
							if (i === 0) this.eventList[j].callback("stage2d");
						}
					}
				}

			}
		}
		//鼠标松开函数
	topology.prototype.stageMouseUp = function(e) {
		this.isMouseEvent(e, EVENT_MOUSE_UP);
	}

	//鼠标按下函数
	topology.prototype.stageMouseDown = function(e) {
		this.isMouseEvent(e, EVENT_MOUSE_DOWN);
	}

	//鼠标移动函数
	topology.prototype.stageMouseMove = function(e) {
		this.isMouseEvent(e, EVENT_MOUSE_MOVE);
	}

	//鼠标滚动函数
	topology.prototype.stageScroll = function(e) {
		if (Math.abs(e.pageX) > this.offset.left && Math.abs(e.pageX) < this.offset.left + this.width && Math.abs(e.pageY) > this.offset.top && Math.abs(e.pageY) < this.offset.top + this.height) {
			e.preventDefault();

			//计算出未缩放的鼠标在场景中的X、Y
			var dX = ((e.pageX - this.offset.left) - this.translateX) / this.scale,
				dY = ((e.pageY - this.offset.top) - this.translateY) / this.scale;

			if (e.detail > 0 || e.wheelDelta < 0) {
				if (this.scale > 0.2) this.scale -= .1;
			} else {
				if (this.scale < 4) this.scale += .1;
			}
			this.translateY = -dY * this.scale + (e.pageY - this.offset.top);
			this.translateX = -dX * this.scale + (e.pageX - this.offset.left);
		}
	}

	//绑定事件
	topology.prototype.addEvent = function(event, fn) {
		this.eventlist.push(new Event2D(event, fn));
	}

	//添加节点
	topology.prototype.addNode = function(id, name, img) {
		var node = new MovieClip2D(img);
		node.name = name;
		node.id = id;
		this.nodeList.push(node);
		return node;
	}

	//添加连线
	topology.prototype.addLink = function(node1, node2) {
			if (typeof node1.rel === "undefined") {
				node1.rel = new Array();
			}

			node1.rel.push(node2);
		}
		//画连线
	topology.prototype.paintLink = function(x1, y1, x2, y2, lineType) {
		if (lineType === "line") {
			this.context.moveTo(x1, y1);
			this.context.lineTo(x2, y2);
			/*if(this.context.isPointInPath(mouseX,mouseY))
			{
				this.context.strokeStyle = "#67809f";
			}else{
				this.context.strokeStyle = "#cccccc";
			}*/
		} else if (lineType === "broken") {
			if (this.orient == "horizontal") {
				this.context.moveTo(x1, y1);
				this.context.lineTo(x2 + (x1 - x2) / 2, y1);
				this.context.lineTo(x2 + (x1 - x2) / 2, y2);
				this.context.lineTo(x2, y2);
			} else {
				this.context.moveTo(x1, y1);
				this.context.lineTo(x1, y2 + (y1 - y2) / 2);
				this.context.lineTo(x2, y2 + (y1 - y2) / 2);
				this.context.lineTo(x2, y2);
			}

		} else {
			if (this.orient == "horizontal") {
				this.context.moveTo(x1, y1);
				this.context.bezierCurveTo(x1 - 80, y1, x2 + 80, y2, x2, y2);
			} else {
				this.context.moveTo(x1, y1);
				this.context.bezierCurveTo(x1, y1 - 80, x2, y2 + 80, x2, y2);
			}
		}
	}

	//设置ROOT
	topology.prototype.setRoot = function(node) {
		node.layer = 1;
	}

	//设置属性
	topology.prototype.setVisible = function(node, visible) {
		node.visible = visible ? 1 : 0;
	}



	//获取图片data
	topology.prototype.getImage = function(type) {
		return type ? this.canvas.toDataURL(type) : this.canvas.toDataURL("image/png");
	}

	//获取缩放位置与节点坐标JSON
	topology.prototype.getJSON = function() {
		var json = new Array();
		for (var k = 0; k < this.nodeList.length; k++) {
			json.push({
				id: this.nodeList[k].id,
				x: this.nodeList[k].x,
				y: this.nodeList[k].y
			});
		}
		return {
			scale: this.scale,
			translateX: this.translateX,
			translateY: this.translateY,
			node: json
		}
	}


	//	影片剪辑类
	function MovieClip2D(img) {
		this.id = "";

		//动画类名称
		this.name = "";

		//动画绘制资源
		this.resource = img;

		//动画类的X坐标
		this.x = 0;

		//动画类的Y坐标
		this.y = 0;

		//动画实际宽度
		this.width = 0;

		//动画实际高度
		this.height = 0;

		//动画名称的X偏移
		this.textOffsetX = 0;

		//动画名称的Y偏移
		this.textOffsetY = 0;

		//动画连线的X偏移
		this.borderOffsetX = 0;

		//动画连线的Y偏移
		this.borderOffsetY = 0;

		//动画类的透明度
		this.alpha = 1;

		//动画相对于原始图像的裁切X位置
		this.mcX = 0;

		//动画相对于原始图像的裁切Y位置
		this.mcY = 0;

		//当前动画播放的帧编号
		this.currentFrame = 0;

		//当前动画场景帧的总长度
		this.totalFrames = 1;

		//动画播放速度
		this.animationSpeed = 24;

		//用于计算过去的时间
		this.animationTime = 0;

		//逻辑更新开关
		this.logicUpDate = false;

		//混色参数
		this.blend = "source-over";

		//动画的选中状态
		this.selected = 0;

		//是否可拖动
		this.isDrag = 1;

		//是否可见
		this.visible = 1;

		//缓存
		this.cache = 0;

		//缓存更新开关
		//this.cacheUpDate = false;

		//缓存更新方法
		//this.cacheFunction = undefined;

		this.paint = function(context) {
			if (this.visible) {
				//更新动画
				this.upFrameData();

				//保存画布句柄状态
				context.save();

				//加入混色功能
				context.globalCompositeOperation = this.blend;

				//更改画布句柄的透明度,从这以后绘制的图像都会依据这个透明度
				context.globalAlpha = this.alpha;

				context.translate((this.x - this.width / 2), Math.floor(this.y - this.height / 2));

				//绘制图形
				context.drawImage(this.resource, this.mcX, this.mcY, this.width, this.height, 0, 0, this.width, this.height);

				//最后返回画布句柄的状态,因为画布句柄是唯一的,它的状态也是唯一的,当我们使用之后方便其他地方使用所以
				//需要返回上一次保存的状态,就好像什么事情都没有发生过
				context.restore();
			}
		}

	}

	MovieClip2D.prototype = {
		//跳转到某一帧并且播放
		gotoAndPlay: function(value) {
			this.currentFrame = value;
			this.logicUpDate = true;
		},

		//跳转到某一帧并且停止
		gotoAndStop: function(value) {
			this.currentFrame = value;
			this.logicUpDate = false;
		},

		//开始播放动画
		play: function() {
			this.logicUpDate = true;
		},

		//停止播放动画
		stop: function() {
			this.logicUpDate = false;
		},

		//动画更新逻辑
		upFrameData: function() {
			this.mcX = this.currentFrame * this.width;
			//缓存更新
			/*if (this.cacheUpDate) {

			}*/
			//动画更新
			if (this.logicUpDate) {
				var date = new Date();
				if ((date.getTime() - this.animationTime >= 1000 / this.animationSpeed)) {
					this.animationTime = date.getTime();
					this.currentFrame++;
				}
				if (this.currentFrame >= this.totalFrames) {
					this.currentFrame = 0;
				}
			}
		},

		//创建缓存
		createCache: function(width,height,fn) {
			this.cacheCanvas = document.createElement("canvas");
			this.cacheCtx = this.cacheCanvas.getContext("2d");
			this.cacheCanvas.width = width;
			this.cacheCanvas.height = height;
			fn(this.cacheCtx,this.data);
			this.resource = this.cacheCanvas;
		}
	}

	return mtopo;
}));
