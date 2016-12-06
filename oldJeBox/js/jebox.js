/**
 @Name : jeBox v1.0 弹层组件
 @Author: chen guojun
 @Date: 2016-4-2
 @QQ群：516754269
 @官网：http://www.jayui.com/jebox/ 或 https://github.com/singod/jeBox
 */
(function(window, undefined) {
    var document = window.document, toString = {}.toString;
    //基础库
    function selFind(selector, node) {
        var fors = function(arr, fun){
			for (var i = 0;i < arr.length; i++) {
				if (fun(i, arr[i]) === false) break;
			}	
		},
		getId = function(id) {
            return document.getElementById(id);
        }, //获取CLASS节点数组
        getClass = function(cls, isNode) {
            var node = isNode != undefined ? isNode :document, temps = [];
            var clsall = node.getElementsByTagName("*");
			fors(clsall,function(i,cell){
                //遍历所有节点，判断是否有包含className
                if (new RegExp("(\\s|^)" + cls + "(\\s|$)").test(cell.className)) temps.push(cell);
            })
            return temps;
        }, //获取TAG节点数组
        getTagName = function(tag, isNode) {
            var node = isNode != undefined ? isNode :document, temps = [], regCls = /\./.test(tag), regTag = /\=/.test(tag),  
			tagCls = regTag ? tag.match(/\w+\[([\w\-_][^=]+)=([\'\[\]\w\-_]+)\]/) :tag.split(".");
            var tags = node.getElementsByTagName(regCls ? tagCls[0] : tagCls[0].split("[")[0]);
            if ((regCls && tagCls[1] != undefined) || regTag) {
                var clsn = regCls ? tagCls[1] : tagCls, 
				clas = /MSIE (6|7)/i.test(navigator.userAgent) ? "className" :"class", 
				atts = regCls ? clas :clsn[1], clsof = regCls ? clsn :clsn[2];   
				fors(tags,function(i,cell){
                    if (new RegExp(clsof).test(cell.getAttribute(atts))) temps.push(cell);
                })
            } else {
				fors(tags,function(i,cell){ temps.push(cell); })
            }
            return temps;
        };
        //创建一个数组，用来保存获取的节点或节点数组
        var thatElem = this.elements = [];
        //当参数是一个字符串，说明是常规css选择器，不是this,或者function
        if (typeof selector == "string") {
            selector = selector.replace(/(^\s*)|(\s*$)/g, "");
            //css模拟，就是跟CSS后代选择器一样
            var sj = /\s+/g, args = /\>/.test(selector) ? selector.replace(/([ \t\r\n\v\f])*>([ \t\r\n\v\f])*/g, ">").replace(/\>/g, " ").replace(sj, " ") :selector.replace(sj, " "),
			    expId = /^\#/, expCls = /^\./;
            if (/\,/.test(args)) {
                var argspl = args.split(/,/g), len = argspl.length;
                for (var idx = 0; idx < len; ++idx) thatElem = thatElem.concat(selFind(argspl[idx]));
            }else if (/\s*/.test(args)) {
                //把节点拆分开并保存在数组里
                var elements = args.split(" ");
                //存放临时节点对象的数组，解决被覆盖问题
                var tempNode = [], node = [];
                //用来存放父节点用的
				fors(elements,function(i,elems){
                    //如果默认没有父节点，就指定document
                    if (node.length == 0) node.push(document);
					var elmSub = elems.substring(1)
					tempNode = [];
					if(expId.test(elems)){  //id
						tempNode.push(getId(elmSub));
					}else if(expCls.test(elems)){  //class
						fors(node,function(j,nd){
							fors(getClass(elmSub, nd),function(k,tp){ tempNode.push(tp); })
                        })
					}else{  //tag
						fors(node,function(j,nd){
                            fors(getTagName(elems, nd),function(k,tp){tempNode.push(tp); })
                        })
					}
					node = tempNode;
                })
                thatElem = tempNode;
            } else {
                //find模拟,就是说只是单一的选择器
				var argSub = args.substring(1);
				if(expId.test(args)){  //id
					thatElem.push(getId(argSub));
				}else if(expCls.test(args)){  //class
					thatElem = getClass(argSub);
				}else{  //tag
					thatElem = getTagName(args);
				}
            }
        } else if (typeof args == "Object") {
            if (args != undefined) {
                thatElem[0] = args;
            }
        }
        return thatElem;
    }
    var JED = function(args, node) {
        var newJED = new JED.fn.init(args, node);
        return newJED;
    };
    JED.extend = function() {
        var _extend = function me(dest, source) {
            for (var name in dest) {
                if (dest.hasOwnProperty(name)) {
                    //当前属性是否为对象,如果为对象，则进行递归
                    if (dest[name] instanceof Object && source[name] instanceof Object) {
                        me(dest[name], source[name]);
                    }
                    //检测该属性是否存在
                    if (source.hasOwnProperty(name)) {
                        continue;
                    } else {
                        source[name] = dest[name];
                    }
                }
            }
        };
        var _result = {}, arr = arguments;
        //遍历属性，至后向前
        if (!arr.length) return {};
        for (var i = arr.length - 1; i >= 0; i--) {
            _extend(arr[i], _result);
        }
        arr[0] = _result;
        return _result;
    };
    JED.each = function(arr, fun) {
        var i = 0, len = arr.length;
        for (;i < len; i++) {
            if (fun(i, arr[i]) === false) break;
        }
    };
    JED.isType = function(obj, type) {
        var types = type.replace(/\b(\w)|\s(\w)/g, function(m) {
            return m.toUpperCase();
        });
        return Object.prototype.toString.call(obj) === "[object " + types + "]";
    };
    JED.inArray = function(elem, arr, i) {
        var core_indexOf = Array.prototype.indexOf;
        if (arr) {
            if (core_indexOf) return core_indexOf.call(arr, elem, i);
            var len = arr.length;
            i = i ? i < 0 ? Math.max(0, len + i) :i :0;
            for (;i < len; i++) {
                if (i in arr && arr[i] === elem) return i;
            }
        }
        return -1;
    };
    // 清除数组中重复的数据
    JED.unique = function(arr) {
        var rets = [], i = 0, len = arr.length;
        if (JED.isType(arr, "array")) {
            for (;i < len; i++) {
                if (JED.inArray(arr[i], rets) === -1) rets.push(arr[i]);
            }
        }
        return rets;
    };
    JED.merge = function(first, second) {
        var sl = second.length, i = first.length, j = 0;
        if (JED.isType(sl, "number")) {
            for (;j < sl; j++) {
                first[i++] = second[j];
            }
        } else {
            while (second[j] !== undefined) {
                first[i++] = second[j++];
            }
        }
        first.length = i;
        return first;
    };
    JED.trim = function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    };
    JED.fn = JED.prototype = {
        init:function(selector, node) {
            if (!selector) return this;
            if (selector.nodeType) {
                this.node = this[0] = selector;
				this.length=1;
                return this;
            }
			if(selector != null && selector == selector.window){
				this.context = this[0] = window;
				this.length=1;
				return this;
			}
            if (selector === "body" && document.body) {
                this.node = document;
                this[0] = document.body;
                this.selector = selector;
				this.length=1;
                return this;
            }
            if (typeof selector === "string") {
                node = node || document;
                var selSize = selFind(selector, node), rets = [];
                for (var i = 0; i < selSize.length; i++) {
                    rets.push(selSize[i]);
                }
                return JED(this).pushStack(rets);
            }
            return this;
        },
        find:function(selector) {
            return JED(selector, this);
        },
        size:function() {
            return this.length;
        },
        each:function(callback) {
            JED.each(this, callback);
            return this;
        },
        pushStack:function(elems) {
            var obj = JED(), i = 0, len = elems.length;
            for (;i < len; i++) {
                obj[i] = elems[i];
            }
            obj.length = len;
            return obj;
        },
        css:function(name, value) {
            var that = this, obj = arguments[0];
            if (typeof name == "string" && typeof value == "string") {
                return that.each(function(i, elem) {  elem.style[name] = value; });
            } else if (typeof name == "string" && typeof value === "undefined") {
                if (that.size() == 0) return null;
                var ele = this[0], JeS = function() {
                    var def = document.defaultView;
                    return new Function("el", "style", [ "style.indexOf('-')>-1 && (style=style.replace(/-(\\w)/g,function(m,a){return a.toUpperCase()}));", "style=='float' && (style='", def ? "cssFloat" :"styleFloat", "');return el.style[style] || ", def ? "window.getComputedStyle(el, null)[style]" :"el.currentStyle[style]", " || null;" ].join(""));
                }();
                return JeS(ele, name);
            } else {
                return that.each(function(i, elem) {
                    for (var k in obj) elem.style[k] = obj[k];
                });
            }
        },
        hasClass:function(selector) {
			var className = " " + selector + " ", i = 0, len = this.length;
			for ( ; i < len; i++ ) {
				if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(/[\n\t\r]/g, " ").indexOf( className ) > -1 ) return true;
			}
		    return false;
        },
        // 添加样式类
        addClass:function(name) {
            if (!this.hasClass(name)) this[0].className = JED.trim(this[0].className + " " + name + " ");
            return this;
        },
        // 移除样式类
        removeClass:function(name) {
            var elem = this[0];
            if (!name) {
                elem.className = "";
            } else if (this.hasClass(name)) {
                elem.className = JED.trim((" " + elem.className + " ").replace(" " + name + " ", " "));
            }
            return this;
        },
        // 获取所有子节点
        contents:function() {
            var elems, i = 0, len = this.length, rets = [];
            for (;i < len; i++) {
                rets = JED.merge(rets, this[i].childNodes);
            }
            // 排重
            rets = JED.unique(rets);
            return this.pushStack(rets);
        },
        //获取当前元素的坐标
        position:function() {
            if (this.size() == 0) return null;
            var elem = this[0];
            return { left:elem.offsetLeft,  top:elem.offsetTop };
        },
        // 元素取宽度
        width:function(value) {
            if (value == undefined) {
                return getWidthOrHeight(this, "width");
            } else {
                this.css("width", typeof value === "number" ? value + "px" :value);
            }
            return this;
        },
        // 元素取高度
        height:function(value) {
            if (value == undefined) {
                return getWidthOrHeight(this, "height");
            } else {
                this.css("height", typeof value === "number" ? value + "px" :value);
            }
            return this;
        },
        //获取与设置，自定义属性
        attr:function(name, value) {
            var that = this[0], ret;
            if (typeof value === "undefined") {
                if (that && that.nodeType === 1) {
                    ret = that.getAttribute(name);
                }
                // 属性不存在，返回undefined
                return ret == null ? undefined :ret;
            }
            return this.each(function(i, elem) {
                if (elem.nodeType === 1) elem.setAttribute(name, value);
            });
        },
        // 读取设置节点内容
        html:function(value) {
            var that = this[0];
            return typeof value === "undefined" ? that && that.nodeType === 1 ? that.innerHTML :undefined :typeof value !== "undefined" && value == true ? that && that.nodeType === 1 ? that.outerHTML :undefined :this.each(function(i, elem) {
                elem.innerHTML = value;
            });
        },
        // 读取设置节点文本内容
        text:function(value) {
            var that = this[0];
            var innText = document.all ? "innerText" :"textContent";
            return typeof value === "undefined" ? that && that.nodeType === 1 ? that[innText] :undefined :this.each(function(i, elem) {
                elem[innText] = value;
            });
        },
        // 读取设置表单元素的值
        val:function(value) {
            var that = this[0];
            if (typeof value === "undefined") {
                return that && that.nodeType === 1 && typeof that.value !== "undefined" ? that.value :undefined;
            }
            // 将value转化为string
            value = value == null ? "" :value + "";
            return this.each(function(i, elem) {
                if (typeof elem.value !== "undefined") {
                    elem.value = value;
                }
            });
        },
        bind:function(type, fn) {
            return this.each(function(i, elem) {
                elem.attachEvent ? elem.attachEvent("on" + type, function() {
                    fn.call(elem, window.type);
                }) :elem.addEventListener(type, fn, false);
            });
        }
    };
    // 宽高属性单位auto转化
    function getWidthOrHeight(elem, name) {
        // 将样式属性转为驼峰式
        function camelCase(name) {
            return name.replace(/\-(\w)/g, function(all, letter) {
                return letter.toUpperCase();
            });
        }
        var padding = name === "width" ? [ "left", "right" ] :[ "top", "bottom" ], ret = elem[0][camelCase("offset-" + name)];
        if (ret <= 0 || ret == null) {
            ret = parseFloat(elem[0][camelCase("client-" + name)]) - parseFloat(elem.css("padding-" + padding[0]) || 0) - parseFloat(elem.css("padding-" + padding[1]) || 0);
        }
        return ret;
    }
    JED.fn.init.prototype = JED.fn;
    window.JED = $D = JED;
})(window);

//核心弹层代码
(function($D, win, undefined) {
    var doc = document, docBody = document.body, docEle = document.documentElement, jeBox = {}, jeyer = {}, 
	regPxe = /\px|em/g, isIE = !-[ 1 ], isIE6 = /msie 6/.test(navigator.userAgent.toLowerCase());
    jeBox.index = Math.floor(Math.random() * 9e3);
	//缓存常用字符
    var doms = ["jeBox",".jeBox-wrap",".jeBox-header",".jeBox-content",".jeBox-footer",".jeBox-close",".jeBox-maxbtn"];
    jeyer.endfun = {};
    var config = {
        cell:"",   // 独立ID,用于控制弹层唯一标识
        title:"提示信息",  // 标题,参数一：提示文字，参数二：提示条样式  ["提示信息",{color:"#ff0000"}]
        content:"暂无内容！",  // 内容
        boxStyle:{},  //设置弹层的样式
        closeBtn:true,   // 标题上的关闭按钮 
        maxBtn:false,  //是否开启最大化按钮
        area:"auto",  // 参数一：弹层宽度，参数二： 弹层高度
        padding:"5px",  // 自定义边距
        offset:[ "auto", "auto" ],  //坐标轴
        type:1,  // 显示基本层类型
        icon:0,  // 图标,信息框和加载层的私有参数
        button:[],  // 各按钮
        yesfun:null,  // 确定按钮回调方法
        nofun:null,  // 取消和关闭按钮触发的回调
        time:0,   // 自动关闭时间(秒),0表示不自动关闭
        masklock:true,  // 是否开启遮罩层
        maskClose:false,   // 点击遮罩层是否可以关闭
        maskColor:[ "#000", .5 ],  // 参数一：遮罩层颜色，参数二：遮罩层透明度
        isDrag:true,   // 是否可以拖拽	
        fixed:true,  // 是否静止定位
        zIndex:9999,  // 弹层层级关系	
        scrollbar:true,  // 是否允许浏览器出现滚动条
        shadow:true,  //拖拽风格
        success:null,  // 层弹出后的成功回调方法
        endfun:null
    };
    //核心方法
    var jeConCell, Dialog = function(options) {
        var that = this;
        that.config = $D.extend(config, options || {});
        that.index = that.config.cell != "" ? that.config.cell :++jeBox.index;
        jeConCell = that.config.content;
        that.initView();
    };
    Dialog.prototype = {
        //初始化弹层
        initView:function() {
            var that = this, opts = that.config;  jeyer.scrollbar = opts.scrollbar;
            //判断ID是否已经存在
            if (opts.cell != "" && $D("#"+ doms[0] + that.index)[0]) return;
            //创建按钮模板
            var btnHtml = function() {
                var btnStrA = opts.button ? function() {
                    var butArr = [];
                    typeof opts.button === "array" && (opts.button = [ opts.button ]);
                    for (var i = 0; i < opts.button.length; i++) {
                        var isDisabled = opts.button[i].hasOwnProperty("disabled") && opts.button[i].disabled == true ? "disabled" :"";
                        butArr.push('<button type="button" class="jeBox-btn' + i + '" jebtn="' + i + '" ' + isDisabled + ">" + opts.button[i].name + "</button>");
                    }
                    return butArr.reverse().join("");
                }() :"";
                return '<div class="jeBox-footer">' + btnStrA + "</div>";
            }();
            //创建默认的弹出层内容模板
            var templates = '<span class="jeBox-headbtn"><a href="javascript:;" class="jeBox-maxbtn"></a><a href="javascript:;" class="jeBox-close" title="&#20851;&#38381;">&times;</a></span>' + '<div class="jeBox-header"></div>' + '<div class="jeBox-content" style="padding:' + (opts.padding != "" ? opts.padding :0) + ';"></div>' + btnHtml;
            //创建弹窗外部DIV	
            var getZindex = function(elem) {
                var maxZindex = 0;
                for (z = 0; z < elem.length; z++) {
                    maxZindex = Math.max(maxZindex, elem[z].style.zIndex);
                }
                return maxZindex;
            }, WarpCls = $D(doms[1]);
            //计算层级并置顶
            var Zwarp = WarpCls[0] ? getZindex(WarpCls) + 5 :opts.zIndex + 5, Zmask = WarpCls[0] ? getZindex(WarpCls) + 2 :opts.zIndex,
                divBox = document.createElement("div"), maskBox = document.createElement("div");
            that.id = divBox.id = doms[0] + that.index;
            divBox.className = doms[1].replace(/\./g,"");
            divBox.style.position = opts.fixed ? "fixed" :"absolute";
            divBox.style.zIndex = Zwarp;
            divBox.innerHTML = templates;
            divBox.setAttribute("jeb", that.index);
            $D("body")[0].appendChild(divBox);
            //是否开启遮罩层
            if (opts.masklock) {
                that.mask = maskBox.id = "jemask" + that.index;
                maskBox.className = "jeBox-mask";
                maskBox.style.cssText = "left:0;top:0;background-color:" + opts.maskColor[0] + ";z-index:" + Zmask + ";opacity:" + opts.maskColor[1] + ";filter:alpha(opacity=" + opts.maskColor[1] * 100 + ");";
                $D("body")[0].appendChild(maskBox);
            }
            var thatID = "#" + that.id, isTitle = opts.title == false || opts.title == "false", 
			    titType = typeof opts.title === "object", msgTitle = titType ? opts.title :[ opts.title, {} ], 
				isBtn = opts.btn == "" && opts.btn == null;
            $D(thatID + " "+ doms[2]).html(isTitle ? "" :msgTitle[0]).css({ display:isTitle ? "none" :"",  height:isTitle ? "0px" :"" }).css(msgTitle[1]);
            $D(thatID + " "+ doms[4]).css({ display:isBtn ? "none" :"", height:isBtn ? "0px" :"" });
            $D(thatID + " "+ doms[5]).css("display", opts.closeBtn ? "" :"none");
			$D(thatID + " "+ doms[6]).css("display", opts.maxBtn ? "" :"none");  			
            !opts.scrollbar && $D("body").css("overflow", "hidden");  
            that.content(opts).layerSize(opts).position(opts).btnCallback(opts);
            if (opts.isDrag) {
                var wrapCell = $D(thatID), titCell = $D(thatID + " "+ doms[2]);
                that.dragLayer(wrapCell, titCell, .4, opts.shadow);
            }
            setTimeout(function() {
                opts.success && opts.success($D(thatID),that.index);
            }, 1);
        },
        //设置内容
        content:function(opts) {
            var that = this, conCell = $D("#" + that.id + " "+ doms[3]), msg = opts.content, conType = typeof msg === "object";
            iconMsg = '<div class="jeBox-iconbox jeicon' + opts.icon + '">' + msg + "</div>";
            switch (opts.type) {
              case 1:
                if (typeof msg === "string") {
                    conCell.html(opts.icon !== 0 ? iconMsg :msg);
                } else if (msg && msg.nodeType === 1) {
                    //查询传入的位置
                    jeyer.Dispy = msg.style.display;
                    jeyer.Prev = msg.previousSibling;
                    jeyer.Next = msg.nextSibling;
                    jeyer.Parent = msg.parentNode;
                    var tempWrap = document.createElement("div");
                    if (msg.style.display == "none") msg.style.display = "block";
                    //把已知的html片段包裹并插入到弹层中
                    conCell[0].appendChild(tempWrap.appendChild(msg));
                }
                break;

              case 2:
                var conMsg = conType ? msg :[ msg || "http://www.jayui.com/", "auto" ];
                conCell.html('<iframe scrolling="' + (conMsg[1] || "auto") + '" allowtransparency="true" id="jeboxiframe' + that.index + '" name="' + that.index + '" onload="this.className=\'\';" frameborder="0" width="100%" height="100%" src="' + conMsg[0] + '"></iframe>');
                break;

              case 3:
                conCell.html('<div class="jeBox-loadbox jeload' + opts.icon + '">' + msg + "</div>");
                break;
            }
            return that;
        },
        //设置弹层尺寸
        layerSize:function(opts) {
            var that = this, fixW = "", fixH = "", WarpID = "#" + that.id, wrapWidth, wrapHeight, conWidth, conHeight, conCell = $D(WarpID + " "+ doms[3]), 
			    docW = docEle.clientWidth, docH = docEle.clientHeight, conhead = jeyer.conhead = $D(WarpID + " "+ doms[2]).height(), confoot = jeyer.confoot = $D(WarpID + " "+ doms[4]).height(), 
			    Padtb = jeyer.getPads(conCell, "padding-top") + jeyer.getPads(conCell, "padding-bottom"), Padlr = jeyer.getPads(conCell, "padding-left") + jeyer.getPads(conCell, "padding-right");
			opts.area.length == 1 ? (fixW = opts.area, fixH = opts.area) : (fixW = opts.area[0], fixH = opts.area[1]);
            //设置层的宽度
            if ($D.isType(opts.area, "array")) {
                if ($D.isType(fixW, "number")) {
                    wrapWidth = fixW;
                } else if (fixW == "auto") {
                    wrapWidth = conWidth = "auto";
                } else {
                    var bfW = /^\d+%$/.test(fixW.toString()) ? parseInt(docW * (fixW.replace("%", "") / 100)) :parseInt(fixW.replace(regPxe, "")), nPerW = bfW >= docW ? docW :bfW;
                    wrapWidth = nPerW + "px";
                    conWidth = nPerW - Padlr + "px";
                }
            }
            //设置层的高度
            if ($D.isType(opts.area, "array")) {
                if ($D.isType(fixH, "number")) {
                    wrapHeight = fixH;
                } else if (fixH == "auto") {
                    wrapHeight = conHeight = "auto";
                } else {
                    var bfH = /^\d+%$/.test(fixH.toString()) ? parseInt(docH * (fixH.replace("%", "") / 100)) :parseInt(fixH.replace(regPxe, "")), nPerH = bfH >= docH ? docH :bfH;
                    wrapHeight = nPerH + "px";
                    conHeight = nPerH - Padtb - conhead - confoot + "px";
                }
            }
            opts.maxBtn && $D(WarpID).attr("area", [ wrapWidth, wrapHeight, conWidth, conHeight ].toString().replace(regPxe, ""));
            $D(WarpID).css({ width:wrapWidth, height:wrapHeight }).css(opts.boxStyle);
            $D(WarpID + " "+ doms[3]).css({ width:conWidth, height:conHeight });
            return that;
        },
        //定位层显示的位置
        position:function(opts) {
            var that = this, PosID = $D("#" + that.id), elemtr, elembl, isOffsetArr = $D.isType(opts.offset, "array"),
			    Postr = opts.offset[0], Posbl = opts.offset[1], dcWidth = docEle.clientWidth, dcHeight = docEle.clientHeight, 
				eleW = PosID.width(), eleH = PosID.height();    
            elemtr = (isOffsetArr && /^\@/.test(Postr)) ?
                Postr.replace(/\@/g, "") : ((Postr == "auto") ? (dcHeight - eleH) / 2  + "px" :  /^\d+%$/.test(Postr) ? Postr :Postr.replace(regPxe, "") + "px");
            elembl = (isOffsetArr && /^\@/.test(Posbl)) ?
                Posbl.replace(/\@/g, "") : ((Posbl == "auto") ? (dcWidth - eleW) / 2  + "px" : /^\d+%$/.test(Posbl) ? Posbl :Posbl.replace(regPxe, "") + "px");
				
            isOffsetArr && (/^\@/.test(Postr) || /^\@/.test(Posbl)) ? PosID.css({ right:elemtr, bottom:elembl }) : PosID.css({ top:elemtr, left:elembl });
            opts.maxBtn && PosID.attr("offset", [ PosID.position().top, PosID.position().left ]);
            return that;
        },
        //各关闭按钮的事件
        btnCallback:function(opts) {
            var that = this, CallID = "#" + that.id, maxBtn = $D(CallID + " "+ doms[6]);
            //自动关闭
            opts.time <= 0 || setTimeout(function() {
                jeBox.close(that.index);
            }, opts.time * 1e3);
            function cancel() {
                var close = opts.nofun && opts.nofun(that.index);
                close === false || jeBox.close(that.index);
            }
            //关闭按钮事件
            opts.closeBtn && $D(CallID + " "+ doms[5]).bind("click", cancel);
            //最大化按钮
            opts.maxBtn && maxBtn.bind("click", function() {
                if (maxBtn.hasClass("revert")) {
                    maxBtn.removeClass("revert");
                    jeBox.restore(that.index);
                } else {
                    maxBtn.addClass("revert");
                    jeBox.full(that.index);
                }
            });
            //更多按钮
            opts.button && $D(CallID + " "+ doms[4]).find("button").bind("click", function() {
                var index = parseInt($D(this).attr("jebtn"));
                if (index === 0) {
                    opts.yesfun ? opts.yesfun(that.index, $D(CallID)) :jeBox.close(that.index);
                }
                if (opts.button.length > 1) {
                    if (index === 1) {
                        cancel();
                    } else {
                        opts.button[index]["callback"] && opts.button[index]["callback"](that.index, $D(CallID));
                        opts.button[index]["callback"] || jeBox.close(that.index);
                    }
                }
            });
            //点遮罩关闭
            opts.maskClose && $D("#jemask" + that.index).bind("click", function() {
                jeBox.close(that.index);
            });
            //自适应
			$D(window).bind("resize",function() {
                if ($D.isType(opts.offset, "array") && (/^\@/.test(opts.offset[0]) || /^\@/.test(opts.offset[1]))) {
                    $D(CallID).css({ top:"", left:"" });
                }
                that.layerSize(opts).position(opts);
            });
            opts.endfun && (jeyer.endfun[that.index] = opts.endfun);
            return that;
        },
        //拖拽事件
        dragLayer:function(warpCell, titCell, opacityVal, isShadow) {
            var that = this, isIES = !-[ 1 ];
            titCell = titCell || warpCell;
            that.tmpX = that.tmpY = 0;
            that.isMoveable = false;
            titCell[0].style.cursor = "move";
            if (isShadow) {
                that.isShadow = isShadow ? isShadow == true || isShadow == false ? isShadow :false :false;
                if (that.isShadow) that.opacity = opacityVal;
            } else {
                that.opacity = 100, that.isShadow = false;
            }
            that.tempLayer = document.createElement("div");
            titCell[0].onmousedown = function(event) {
                var event = event || window.event;
                //只允许通过鼠标左键进行拖拽,IE鼠标左键为1 FireFox为0
                if (isIES && event.button != 1 || isIES && event.button == 0) return false;
				//创建临时拖动层
                if (that.isShadow) {
                    that.tempLayer.style.cssText = "width : " + (warpCell[0].offsetWidth - 4) + "px;height : " + (warpCell[0].offsetHeight - 4) + "px;left : " + warpCell[0].offsetLeft + "px;top : " + warpCell[0].offsetTop + "px;opacity:" + that.opacity + ";filter:alpha(opacity=" + that.opacity * 100 + ");z-Index : 29860813;";
                    that.tempLayer.className = "jeBox-moves";
                    warpCell[0].parentNode.appendChild(that.tempLayer);
                }
                that.isMoveable = true;
                that.tmpX = event.clientX - warpCell[0].offsetLeft;
                that.tmpY = event.clientY - warpCell[0].offsetTop;
                //FireFox 去除容器内拖拽图片问题
                if (event.preventDefault) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                document.onmousemove = function(event) {
                    if (!that.isMoveable) return;
                    window.getSelection ? window.getSelection().removeAllRanges() :document.selection.empty();
                    //控制元素不被拖出窗口外
                    var event = event || window.event, elemCopy = that.isShadow ? that.tempLayer :warpCell, 
					DmpX = event.clientX - that.tmpX, DmpY = event.clientY - that.tmpY, 
					maxW = docEle.clientWidth - warpCell[0].offsetWidth, maxH = docEle.clientHeight - warpCell[0].offsetHeight;
                    DmpX <= 0 && (DmpX = 0);
                    DmpY <= 0 && (DmpY = 0);
                    DmpX >= maxW && (DmpX = maxW);
                    DmpY >= maxH && (DmpY = maxH);
                    elemCopy.style.top = DmpY + "px";
                    elemCopy.style.left = DmpX + "px";
                };
                document.onmouseup = function() {
                    if (that.isMoveable) {
                        that.isMoveable = false;
                        that.tmpX = that.tmpY = 0;
                        warpCell.css({ right:"", bottom:"" });
                        if (that.isShadow) {
                            //判断并把虚框的位置信息传给弹层
                            warpCell.css({
                                top:that.tempLayer.offsetTop + "px",
                                left:that.tempLayer.offsetLeft + "px"
                            });
                            //判断并删除新创建的虚框
                            docBody.removeChild(that.tempLayer);
                        }
                        if (docEle.clientWidth != warpCell[0].offsetWidth) {
                            warpCell.attr("offset", [ warpCell[0].offsetTop, warpCell[0].offsetLeft ]);
                        }
                    }
                };
            };
            return that;
        }
    };
	//获取内边距
	jeyer.getPads = function(cell, name) {
		return parseInt(cell.css(name).replace(regPxe, ""));
	}
	//获取窗口大小
	jeyer.docSize = function(name) {
		var dowSize, inner = [ "inner" + name ], client = [ "client" + name ];
		if (window[inner]) {
			dowSize = window[inner];
		} else if (docBody && docBody[client]) {
			dowSize = docBody[client];
		}
		// 通过深入 Document 内部对 body 进行检测，获取窗口大小
		if (docEle && docEle[client]) {
			dowSize = docEle[client];
		}
		return dowSize;
	}
    //弹层核心
    jeBox.open = function(opts) {
		var jedia = new Dialog(opts || {})
        return jedia.index;
    };
    //关闭指定层
    jeBox.close = function(idx) {
        var boxCell = $D("#"+ doms[0] + idx)[0], maskCell = $D("#jemask" + idx)[0];
        if (!boxCell) return;
        if (jeConCell && jeConCell.nodeType === 1) backSitu(jeConCell, jeyer.Prev, jeyer.Next, jeyer.Parent, jeyer.Dispy);
        docBody.removeChild(boxCell);
        maskCell && docBody.removeChild(maskCell);
        $D("body").css("overflow") == "hidden" && $D("body").css("overflow", "");
		typeof jeyer.endfun[idx] === 'function' && jeyer.endfun[idx]();
        delete jeyer.endfun[idx]; 
    };
    //关闭所有层
    jeBox.closeAll = function() {
        $D(doms[1]).each(function(i, elem) {
            jeBox.close(elem.getAttribute("jeb"));
        });
    };
	//版本
	jeBox.version = "1.0";
    //改变当前弹层title
    jeBox.title = function(name, idx) {
        $D("#"+ doms[0] + idx + " "+ doms[2]).html(name);
    };
	//改变当前弹层内容
    jeBox.content = function(content, idx) {
        $D("#"+ doms[0] + idx + " "+ doms[3]).html(content);
    };
    //最常用提示层
    jeBox.msg = function(content, options, end) {
        var type = typeof options === "function";
        if (type) end = options;
        return jeBox.open($D.extend({
            title:false,
            content:content,
            padding:"10px",
            boxStyle:{  background:"#fff",  border:"1px solid #e3e3e3", "border-radius":"4px", color:"#333", opacity:"0.93", filter:"alpha(opacity=90)" },
            time:3,
            masklock:false,
            closeBtn:false,
            end:end
        }, !type && function() {
            options = options || {};
            return options;
        }()));
    };
    jeBox.alert = function(content, options, yes) {
        var type = typeof options === "function";
        if (type) yes = options;
        return jeBox.open($D.extend({
            content:content,
            yesfun:yes,
            button:[ { name:"确定"  } ]
        }, type ? {} :options));
    };
    jeBox.loading = function(icon, content, options) {
        return jeBox.open($D.extend({
            title:false,
            closeBtn:false,
            type:3,
            masklock:false,
            content:content == undefined ? "" : content,
            icon:icon || 1,
            boxStyle:{ background:"#fff",  border:"1px solid #fff", "border-radius":"4px", color:"#111",  opacity:"0.93", filter:"alpha(opacity=90)" }
        }, options));
    };
	//还原
	jeBox.restore = function(index){
		var CallID = $D("#"+ doms[0] + index), callCon = $D("#"+ doms[0] + index + " "+ doms[3]), 
		    revArea = CallID.attr("area").split(/,/g), revOffset = CallID.attr("offset").split(/,/g);
		$D("body").css('overflow',jeyer.scrollbar == false ? 'hidden' : '');
		CallID.css({
			width:revArea[0] + "px", height:revArea[1] + "px",
			top:revOffset[0] + "px", left:revOffset[1] + "px",
			right:"", bottom:""
		});
		callCon.css({  width:revArea[2] + "px", height:revArea[3] + "px" });
	}
	//全屏
    jeBox.full = function(index){
		var timer, CallID = $D("#"+ doms[0] + index), callCon = $D("#"+ doms[0] + index + " "+ doms[3]),
		    warpMagtb = jeyer.getPads(CallID, "borderTopWidth") + jeyer.getPads(CallID, "borderBottomWidth"), 
			warpMaglr = jeyer.getPads(CallID, "borderLeftWidth") + jeyer.getPads(CallID, "borderRightWidth"), 
			conPadtb = jeyer.getPads(callCon, "padding-top") + jeyer.getPads(callCon, "padding-bottom"), 
			conPadlr = jeyer.getPads(callCon, "padding-left") + jeyer.getPads(callCon, "padding-right");
		$D("body").css('overflow','hidden');
		clearTimeout(timer);
		timer = setTimeout(function(){
			$D(CallID + " "+ doms[6]).addClass("revert");
			var isfix = CallID.css('position') === 'fixed', offset = CallID.attr("offset").split(/,/g),
			    docWidth = jeyer.docSize("Width"), docHeight = jeyer.docSize("Height");
			CallID.css({
				width:docWidth - warpMagtb + "px",
				height:docHeight - warpMaglr + "px",
				top:isfix ? 0 : offset[0] + "px", left:isfix ? 0 : offset[1] + "px", right:"", bottom:""
			});
			callCon.css({
				width:docWidth - (conPadlr + warpMagtb) + "px",
				height:docHeight - (conPadtb + jeyer.conhead + jeyer.confoot + warpMaglr) + "px"
			});
		}, 1);
	}
    //获取子iframe的DOM
    jeBox.getChildFrame = function(selector, index) {
        index = index || $(".jeboxiframe").attr("jeb");
        return $D("#"+ doms[0] + index).find("iframe").contents().find(selector);
    };
    //得到当前iframe层的索引，子iframe时使用
    jeBox.getFrameIndex = function(name) {
        return $D("#"+ doms[0] + name).attr("jeb");
    };
    //重置iframe url
    jeBox.iframeUrl = function(idx, url) {
        $D("#"+ doms[0] + idx).find("iframe").attr("src", url);
    };
    // 让传入的元素在对话框关闭后可以返回到原来的地方
    function backSitu(elem, jePrev, jeNext, jeParent, jeDispy) {
        if (jePrev && jePrev.parentNode) {
            jePrev.parentNode.insertBefore(elem, jePrev.nextSibling);
        } else if (jeNext && jeNext.parentNode) {
            jeNext.parentNode.insertBefore(elem, jeNext);
        } else if (jeParent) {
            jeParent.appendChild(elem);
        }
        elem.style.display = jeDispy;
        this.backSitu = null;
    }
    // 多环境支持
    "function" === typeof define ? define(function() {
        return jeBox;
    }) :"object" === typeof module && "object" === typeof module.exports ? module.exports = jeBox :window.jeBox = jeDialog = jeBox;
})(window.$D, window);
