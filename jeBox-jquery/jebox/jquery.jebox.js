/**
 @Name : jeBox v1.2 弹层组件
 @Author: chen guojun
 @Date: 2016-10-12
 @QQ群：516754269
 @官网：http://www.jayui.com/jebox/ 或 https://github.com/singod/jeBox
 */
;(function(root, factory) {
    if (typeof define === 'function' && define.amd) { //amd
        define(['$'], factory);
    } else if (typeof exports === 'object') { //umd
        module.exports = factory();
    } else {
        root.jeBox = factory(window.jQuery || $);
    }
})(this, function($) {
    var jeBox = {}, Jeb = {}, regPxe = /\px|em/g, ieBrowser = !-[1,] ? parseInt(navigator.appVersion .split(";")[1].replace(/MSIE|[ ]/g,"")) : 9;
    jeBox.index = Math.floor(Math.random() * 9e3);
    Jeb.isBool = function(obj){  return (obj == undefined || obj == true ?  true : false); };
    Jeb.endfun = {};
    //缓存常用字符
    var doms = ["jeBox", ".jeBox-wrap", ".jeBox-header", ".jeBox-content", ".jeBox-footer", ".jeBox-close", ".jeBox-maxbtn"];
    var config = {
        cell: "",   // 独立ID,用于控制弹层唯一标识
        title: "提示信息"  // 标题,参数一：提示文字，参数二：提示条样式  ["提示信息",{color:"#ff0000"}]
        //content: "暂无内容！",  // 内容
        //boxStyle: {},  //设置弹层的样式
        //closeBtn: true,   // 标题上的关闭按钮
        //maxBtn: false,  //是否开启最大化按钮
        //area: "auto",  // 参数一：弹层宽度，参数二： 弹层高度
        //padding: "5px",  // 自定义边距
        //offset: ["auto", "auto"],  //坐标轴
        //type: 1,  // 显示基本层类型
        //icon: 0,  // 图标,信息框和加载层的私有参数
        //button: [],  // 各按钮
        //btnAlign:"right",  //btnAlign 按钮对齐方式  left center right
        //yesBtn:"确定",
        //noBtn:"取消",
        //yesfun: null,  // 确定按钮回调方法
        //nofun: null,  // 取消和关闭按钮触发的回调
        //time: 0,   // 自动关闭时间(秒),0表示不自动关闭
        //masklock: true,  // 是否开启遮罩层
        //maskClose: true,   // 点击遮罩层是否可以关闭
        //maskColor: ["#000", .5],  // 参数一：遮罩层颜色，参数二：遮罩层透明度
        //isDrag: true,   // 是否可以拖拽
        //fixed: true,  // 是否静止定位
        //zIndex: 9999,  // 弹层层级关系
        //scrollbar: true,  // 是否允许浏览器出现滚动条
        //shadow: true,  //拖拽风格
        //success: null,  // 层弹出后的成功回调方法
        //endfun: null
    };
    function jeDialog(options){
        var that = this;
        that.config = options;
        that.index = (that.config.cell == "" || that.config.cell == undefined) ? ++jeBox.index : that.config.cell ;
        that.initView();
    }
    var jefn = jeDialog.prototype;
    jefn.initView = function(){
        var that = this, opts = that.config;
        Jeb.scrollbar = opts.scrollbar || false;
        //判断ID是否已经存在
        if (opts.cell != "" && $("#" + doms[0] + that.index).size()>0) return;
        //创建按钮模板
        var btnHtml = function () {
            var i = 0, arrButton = opts.button || [], btnLen = arrButton.length,
                unyesBtn = (opts.yesBtn != undefined && opts.yesBtn != ""),
                unnoBtn = (opts.noBtn != undefined && opts.noBtn != ""),
                yesArr = {name:opts.yesBtn}, noArr = {name:opts.noBtn};
            var butArr = [],comBtnArr;
            if(unyesBtn && unnoBtn) {
                comBtnArr = btnLen != 0 ? [yesArr,noArr,arrButton] : [yesArr,noArr];
            }else if(unyesBtn){
                comBtnArr = btnLen != 0 ? [yesArr,arrButton] : [yesArr];
            }else if(unnoBtn){
                i = 1; comBtnArr = btnLen != 0 ? [noArr,arrButton] : [noArr];
            }
            that.button = comBtnArr;
            var btnStrA = comBtnArr ? function () {
                for (;i < comBtnArr.length; i++) {
                    var isDisabled = comBtnArr[i].disabled == true ? "disabled" : "";
                    butArr.push('<button type="button" class="jeBox-btn' + i + '" jebtn="' + i + '" ' + isDisabled + ">" + comBtnArr[i].name + "</button>");
                }
                return butArr.reverse().join("");
            }() : "";
            return '<div class="jeBox-footer" style="text-align:'+(opts.btnAlign||"right")+'">' + btnStrA + "</div>";
        }();
        var paddings = opts.padding || "5px", skinCell = opts.skinCell || "jeBox-anim";
        //创建默认的弹出层内容模板
        var templates = '<span class="jeBox-headbtn"><a href="javascript:;" class="jeBox-maxbtn" title="最大化"></a><a href="javascript:;" class="jeBox-close" title="&#20851;&#38381;"></a></span>' + '<div class="jeBox-header"></div>' + '<div class="jeBox-content" style="padding:' + (paddings != "" ? paddings : 0) + ';"></div>' + btnHtml;
        //创建弹窗外部DIV
        var getZindex = function (elem) {
            var maxZindex = 0;
            elem.each(function(){
                maxZindex = Math.max(maxZindex, $(this).css("z-index"));
            });
            return maxZindex;
        }, zIndexs = opts.zIndex || 9999;
        //计算层级并置顶
        var Zwarp = $(doms[1]).size() > 0 ? getZindex($(doms[1])) + 5 : zIndexs + 5, Zmask = $(doms[1]).size() > 0 ? getZindex($(doms[1])) + 2 : zIndexs,
            divBoxs = $("<div/>",{"id":doms[0] + that.index,"class":doms[1].replace(/\./g, "")});
        $("body").append(divBoxs.append(templates));
        divBoxs.attr("jeitem", that.index);
        divBoxs.css({position: Jeb.isBool(opts.fixed) ? "fixed" : "absolute","z-index":Zwarp});
        (parseInt(ieBrowser) < 9) ? divBoxs.addClass("jeBox-ies") : divBoxs.addClass(skinCell);
        //是否开启遮罩层
        if (Jeb.isBool(opts.masklock)) {
            var maskBox = $("<div/>",{"id":"jemask" + that.index,"class":"jeBox-mask"}), maskColor = opts.maskColor || ["#333", 0.5];
            $("body").append(maskBox);
            maskBox.css({left:0,top:0,"background-color":maskColor[0] ,"z-index":Zmask,opacity:maskColor[1],filter:"alpha(opacity="+maskColor[1] * 100+")"})
        };
        var thatID = $("#" + doms[0] + that.index),titles = opts.title == false ? "" : (opts.title || config.title),
            titType = typeof titles === "object", isTitle =  titles ? (titType ? titles[0] : titles) : "",
            isBtn = (opts.yesBtn === undefined && opts.noBtn === undefined && opts.button === undefined) ? true : false;
        thatID.find(doms[2]).html(isTitle).css({ "display": isTitle != "" ? "" : "none", "height":  isTitle != "" ? "" : "0px" }).css(titType ? titles[1] : {});
        thatID.find(doms[4]).css({"display": isBtn ? "none" : "", "height": isBtn ? "0px" : ""});
        thatID.find(doms[5]).css("display", Jeb.isBool(opts.closeBtn) ? "" : "none");
        thatID.find(doms[6]).css("display", opts.maxBtn ? "" : "none");
        !Jeb.scrollbar && $("body").css("overflow", "hidden");
        that.setContent(opts); that.setSize(opts, thatID);
        that.setPosition(opts, thatID);
        that.btnCallback(opts, thatID);
        //是否可拖动
        if (Jeb.isBool(opts.isDrag) && isTitle != "") {
            var wrapCell = thatID, titCell = thatID.find(doms[2]);
            that.dragLayer(wrapCell, titCell, 0.4, Jeb.isBool(opts.shadow));
        };
        setTimeout(function () {
            opts.success && opts.success(thatID, that.index);
        }, 5);
    };
    //设置内容
    jefn.setContent = function(opts){
        var that = this, conCell = $("#" + doms[0] + that.index).find(doms[3]), msg = opts.content, isType = opts.type || 1, icons = opts.icon || 0,
            conType = typeof msg === "object", iconMsg = '<div class="jeBox-iconbox jeicon' + opts.icon + '">' + msg + "</div>";
        switch (isType) {
            case 1:
                if (typeof msg === "string") {
                    conCell.html(opts.icon !== 0 ? iconMsg : msg);
                } else if (msg[0] && msg[0].nodeType === 1) {
                    $("#" + doms[0] + that.index).attr("jenode",msg.selector.toString());
                    //查询传入的位置
                    Jeb.Dispy = msg.css("display");
                    Jeb.Prev = msg.prev();
                    Jeb.Next = msg.next();
                    Jeb.Parent = msg.parent();
                    if (msg.css("display") == "none") msg.css("display","block");
                    //把已知的html片段包裹并插入到弹层中
                    conCell.append(msg);
                }
                break;
            case 2:
                var conMsg = conType ? msg : [msg || "http://www.jayui.com/", "auto"] ;
                conCell.html('<iframe scrolling="' + (conMsg[1] || "auto") + '" allowtransparency="true" id="jeboxiframe' + that.index + '" name="' + that.index + '" onload="this.className=\'\';" frameborder="0" width="100%" height="100%" src="' + conMsg[0] + '"></iframe>');
                break;
            case 3:
                conCell.html('<div class="jeBox-loadbox jeload' + icons + '">' + msg + "</div>");
                break;
        }
        return that;
    };
    //设置弹层尺寸
    jefn.setSize = function(opts, cell){
        var that = this, fixW, fixH,  wrapWidth, wrapHeight, conWidth, conHeight, conCell = cell.find(doms[3]), areas = opts.areaSize || ["auto","auto"],
            conPad = function(prop){ return parseInt(conCell.css(prop).replace(regPxe, ""))}, winW = $(window).width(), winH = $(window).height(),
            conhead = Jeb.conhead = cell.find(doms[2]).height(), confoot = Jeb.confoot = cell.find(doms[4]).height(),
            Padtb = conPad("padding-top") + conPad("padding-bottom"), Padlr = conPad("padding-left") + conPad("padding-right"),
            Martb = conPad("margin-top") + conPad("margin-bottom"), Marlr = conPad("margin-left") + conPad("margin-right");

        if ($.isArray(areas)) {
            fixW = areas[0]; fixH = areas[1];
            var bfW = /^\d+%$/.test(fixW.toString()) ? parseInt(winW * (fixW.toString().replace("%", "") / 100)) : parseInt(fixW.toString().replace(regPxe, "")),
                nPerW = bfW >= winW ? winW : bfW;
            var bfH = /^\d+%$/.test(fixH.toString()) ? parseInt(winH * (fixH.toString().replace("%", "") / 100)) : parseInt(fixH.toString().replace(regPxe, "")),
                nPerH = bfH >= winH ? winH : bfH;
            //设置层的宽度
            if ($.type(fixW) === "number") {
                wrapWidth = bfW;
                conWidth = bfW - Padlr - Marlr;
            } else if (fixW == "auto") {
                wrapWidth = cell.outerWidth();
                conWidth = cell.outerWidth() - Padlr - Marlr;
            } else {
                wrapWidth = nPerW;
                conWidth = nPerW - Padlr - Marlr;
            }

            //设置层的高度
            if ($.type(fixH) === "number") {
                wrapHeight = bfH;
                conHeight = bfH - Padtb - Martb - conhead - confoot;
            } else if (fixH == "auto") {
                wrapHeight = cell.outerHeight();
                conHeight = cell.outerHeight() - Padtb - Martb - conhead - confoot;
            } else {
                wrapHeight = nPerH;
                conHeight = nPerH - Padtb - Martb - conhead - confoot;
            }
        };

        opts.maxBtn && cell.attr("area", [wrapWidth, wrapHeight, conWidth, conHeight]);
        cell.css({"width": wrapWidth, height: wrapHeight}).css(opts.boxStyle||{});
        cell.find(doms[3]).css({"width": conWidth, "height": conHeight});
        return that;
    };
    //定位层显示的位置
    jefn.setPosition = function(opts, cell){
        var that = this, Postr, elemtr, elembl, offsets = opts.offset || ["auto", "auto"],
            isOffsetArr = $.isArray(offsets), eleW = cell.width(), eleH = cell.height(),
            Postr = offsets[0], Posbl = offsets[1], winWidth =  $(window).width(), winHeight = $(window).height();
        //设置位置
        elemtr = (isOffsetArr && /^\@/.test(Postr)) ? Postr.replace(/\@/g, "") :
            ((Postr == "auto") ? (winHeight - eleH) / 2 : /^\d+%$/.test(Postr) ? Postr : Postr.replace(regPxe, ""));
        elembl = (isOffsetArr && /^\@/.test(Posbl)) ? Posbl.replace(/\@/g, "") :
            ((Posbl == "auto") ? (winWidth - eleW) / 2 : /^\d+%$/.test(Posbl) ? Posbl : Posbl.replace(regPxe, ""));
        //判断设置位置类型
        var cellOffset = (isOffsetArr && (/^\@/.test(Postr) || /^\@/.test(Posbl)) ) ?
            { "right": elemtr, "bottom": elembl  } :{"top": elemtr, "left": elembl};
        cell.css(cellOffset);
        opts.maxBtn && cell.attr("offset", [elemtr, elembl]);
        return that;
    };
    //各关闭按钮的事件
    jefn.btnCallback = function (opts, cell) {
        var that = this, maxBtn = cell.find(doms[6]), times = opts.time || 0, offsets = opts.offset || ["auto", "auto"];
        //自动关闭
        times <= 0 || setTimeout(function () {
            jeBox.close(that.index);
        }, times * 1e3);
        function cancel() {
            var close = opts.nofun && opts.nofun(that.index);
            close === false || jeBox.close(that.index);
        }

        //关闭按钮事件
        Jeb.isBool(opts.closeBtn) && cell.find(doms[5]).on("click", cancel);
        //最大化按钮
        opts.maxBtn && maxBtn.bind("click", function () {
            if (maxBtn.hasClass("revert")) {
                maxBtn.removeClass("revert");
                jeBox.restore(that.index);
                $(this).attr("title","最大化");
            } else {
                maxBtn.addClass("revert");
                jeBox.full(that.index);
                $(this).attr("title","还原");
            }
        });
        //更多按钮
        that.button && cell.find(doms[4]+" button").on("click", function () {
            var index = parseInt($(this).attr("jebtn"));
            if (index === 0) {
                opts.yesfun ? opts.yesfun(that.index, cell) : jeBox.close(that.index);
            }
            if (that.button.length > 1) {
                if (index === 1) {
                    cancel();
                }else if(index > 1) {
                    that.button[index]["callback"] && that.button[index]["callback"](that.index, cell);
                    that.button[index]["callback"] || jeBox.close(that.index);
                }
            }
        });
        //点遮罩关闭
        Jeb.isBool(opts.maskClose) && $("#jemask" + that.index).on("click", function () {
            jeBox.close(that.index);
        });
        //自适应
        $(window).resize(function () {
            if ($.isArray(offsets) && (/^\@/.test(offsets[0]) || /^\@/.test(offsets[1]))) {
                cell.css({"top": "", "left": ""});
            }
            //that.setSize(opts, cell);
            that.setPosition(opts, cell);
        });
        opts.endfun && (Jeb.endfun[that.index] = opts.endfun);
        return that;
    };
    //拖拽事件
    jefn.dragLayer = function (warpCell, titCell, opacityVal, isShadow) {
        var that = this, isIES = !-[1];
        titCell = titCell || warpCell;
        var tmpX = tmpY = 0;
        that.isMoveable = false;
        titCell.css("cursor", "move");
        if (isShadow) {
            that.isShadow = isShadow ? isShadow == true || isShadow == false ? isShadow : false : false;
            if (that.isShadow) that.opacity = opacityVal;
        } else {
            that.opacity = 100, that.isShadow = false;
        }
        titCell.on("mousedown", function(event) {
            var event = event || window.event;
            var tempLayer = $("<div/>",{"id":"jeBox-moves","class":"jeBox-moves"}),
                warpLeft = warpCell.css("left"), warpTop = warpCell.css("top");
            var tempLayerCon = $("<div/>",{class:"movescon"});
            //只允许通过鼠标左键进行拖拽,IE鼠标左键为1 FireFox为0
            if (isIES && event.button != 1 || isIES && event.button == 0) return false;
            //创建临时拖动层
            if (that.isShadow) {
                tempLayer.css({
                    width :(warpCell.outerWidth() - 4), height : (warpCell.outerHeight() - 4),
                    left : warpLeft, top : warpTop, "z-index" : parseInt(warpCell.css("z-index")) + 10
                });
                $("body").append(tempLayer.append(tempLayerCon));
            }
            that.isMoveable = true;
            tmpX = event.pageX - warpLeft.replace(regPxe, "");
            tmpY = event.pageY - warpTop.replace(regPxe, "");
            //FireFox 去除容器内拖拽图片问题
            if (event.preventDefault) {
                event.preventDefault();  event.stopPropagation();
            }
            $(document).on("mousemove", function (event) {
                if (!that.isMoveable) return;
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                //控制元素不被拖出窗口外
                var event = event || window.event, elemCopy = that.isShadow ? tempLayer : warpCell,
                    DmpX = event.pageX - tmpX, DmpY = event.pageY - tmpY,
                    maxW = $(window).width() - warpCell.outerWidth(), maxH = $(window).height() - warpCell.outerHeight();
                DmpX <= 0 && (DmpX = 0);   DmpY <= 0 && (DmpY = 0);
                DmpX >= maxW && (DmpX = maxW);  DmpY >= maxH && (DmpY = maxH);
                elemCopy.css({"top": DmpY, "left": DmpX});
            }).on("mouseup", function () {
                if (that.isMoveable) {
                    that.isMoveable = false;
                    tmpX = tmpY = 0;
                    warpCell.css({"right": "", "bottom": ""});
                    if (that.isShadow) {
                        //判断并把虚框的位置信息传给弹层
                        warpCell.css({ "top": tempLayer.css("top"), "left": tempLayer.css("left") });
                        //判断并删除新创建的虚框
                        $("#jeBox-moves").remove();
                    }
                    if ($(window).width() != warpCell.outerWidth()) {
                        warpCell.attr("offset", [warpCell.css("top").replace(regPxe, ""), warpCell.css("left").replace(regPxe, "")]);
                    }
                }
            });
        });
        return that;
    };
    // 让传入的元素在对话框关闭后可以返回到原来的地方
    function backInSitu(elem, jePrev, jeNext, jeParent, jeDispy) {
        if (jePrev.length > 0 && jePrev.parent()) {
            jePrev.after(elem);
        } else if (jeNext.length > 0 && jeNext.parent()) {
            jeNext.before(elem);
        } else if (jeParent.length > 0) {
            jeParent.append(elem);
        }
        elem.css("display", jeDispy);
        this.backSitu = null;
    };
    //弹层核心
    jeBox.open = function (opts) {
        var jeShow = new jeDialog(opts || {});
        return jeShow.index;
    };
    //关闭指定层
    jeBox.close = function (idx) {
        var boxCell = $("#" + doms[0] + idx), maskCell = $("#jemask" + idx);
        var nodeCell = boxCell.attr("jenode");
        if(!boxCell) return;
        if ($(nodeCell).size() > 0 && $(nodeCell)[0].nodeType === 1) {
            backInSitu($(nodeCell), Jeb.Prev, Jeb.Next, Jeb.Parent, Jeb.Dispy);
        };
        boxCell && boxCell.remove();
        maskCell && maskCell.remove();
        $("body").css("overflow") == "hidden" && $("body").css("overflow", "");
        typeof Jeb.endfun[idx] === 'function' && Jeb.endfun[idx]();
        delete Jeb.endfun[idx];
    };
    //关闭所有层
    jeBox.closeAll = function () {
        $(doms[1]).each(function (i, elem) {
            jeBox.close(elem.attr("jeitem"));
        });
    };
    //版本
    jeBox.version = "1.2";
    //改变当前弹层title
    jeBox.title = function (name, idx) {
        $("#" + doms[0] + idx).find(doms[2]).html(name);
    };
    //改变当前弹层内容
    jeBox.content = function (content, idx) {
        $("#" + doms[0] + idx).find(doms[3]).html(content);
    };
    //最常用提示层
    jeBox.msg = function (content, options, end) {
        var type = $.isFunction(options);
        if (type) end = options;
        return jeBox.open($.extend({
            title: false,
            content: content,
            padding: "10px",
            skinCell: "jeBox-animMsg",
            time: 3,
            masklock: false,
            closeBtn: false,
            end: end
        }, !type && function () {
            options = options || {};
            return options;
        }()));
    };
    jeBox.alert = function (content, options, yes) {
        var type = $.isFunction(options);
        if (type) yes = options;
        return jeBox.open($.extend({
            content: content,
            yesfun: yes,
            yesBtn: "确定",
        }, type ? {} : options));
    };
    jeBox.loading = function (icon, content, options) {
        return jeBox.open($.extend({
            title: false,
            closeBtn: false,
            type: 3,
            skinCell: "jeBox-animLoad",
            masklock: false,
            content: content == undefined ? "" : content,
            icon: icon || 1
        }, options));
    };
    //还原
    jeBox.restore = function (index) {
        var boxCell = $("#" + doms[0] + index), conCell = boxCell.find(doms[3]),
            revArea = boxCell.attr("area").split(/,/g), revOffset = boxCell.attr("offset").split(/,/g);
        $("body").css('overflow', Jeb.scrollbar == false ? 'hidden' : '');
        boxCell.css({
            width: revArea[0], height: revArea[1], top: revOffset[0] + "px", left: revOffset[1] + "px", right: "", bottom: ""
        });
        conCell.css({width: revArea[2], height: revArea[3]});
    };
    //全屏
    jeBox.full = function (index) {
        var timer, boxCell = $("#" + doms[0] + index), conCell = boxCell.find(doms[3]);
        $("body").css('overflow', 'hidden');
        clearTimeout(timer);
        timer = setTimeout(function () {
            boxCell.find(doms[6]).addClass("revert");
            var isfix = boxCell.css('position') === 'fixed', offset = boxCell.attr("offset").split(","),
                docWidth = $(window).width(), docHeight = $(window).height(),
                conW = conCell.outerWidth(true) - conCell.width(), conH = conCell.outerHeight(true) - conCell.height(),
                headHeight = boxCell.find(doms[2]).outerHeight(true), footHeight = boxCell.find(doms[4]).outerHeight(true);
            boxCell.css({
                width: docWidth, height: docHeight,
                top: isfix ? 0 : offset[0], left: isfix ? 0 : offset[1], right: "", bottom: ""
            });
            conCell.css({
                width: docWidth - conW,
                height: docHeight - conH - headHeight - footHeight
            });
        }, 5);
    };
    //获取子iframe的DOM
    jeBox.getChildFrame = function (selector, index) {
        index = index || $(".jeboxiframe").attr("jeitem");
        return $("#" + doms[0] + index).find("iframe").contents().find(selector);
    };
    //得到当前iframe层的索引，子iframe时使用
    jeBox.getFrameIndex = function (name) {
        return $("#" + doms[0] + name).attr("jeitem");
    };
    //重置iframe url
    jeBox.iframeUrl = function (idx, url) {
        $("#" + doms[0] + idx).find("iframe").attr("src", url);
    };
    return jeBox;
});