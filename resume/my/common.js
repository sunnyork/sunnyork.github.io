﻿$(function(){
	$("#lightbox").bgiframe();
	$("#lightbox_w").bgiframe();
	$(".submenu").bgiframe();
	
	//megamenu mouse effect
    $.fn.showmenu = function(){
        var drop = $(this);
        var sub = drop.find(".submenu");
        var dropa = drop.find("a:first");
        
        drop.hover(function(){dropa.addClass("on");
        	if($.browser.msie && ($.browser.version == "7.0" || $.browser.version == "6.0")){ //IE7 can't use slideDown
        		sub.show().css("display","inline");;
        	}else{
        		sub.slideDown(200);
        	}        	
        }
        	,function(){dropa.removeClass("on");sub.hide();});
    };

    //dropdown effect
    $("#navlist li.home").mouseover(function(){$(this).find("a.home").addClass("on");})
        .mouseout(function(){$(this).find("a.home").removeClass("on");});
    $("#nav_menu li.resume").showmenu();
    $("#nav_menu li.job").showmenu();
    $("#nav_menu li.tool").showmenu();
    $("#nav_menu li.account").showmenu();

	//找工作/公司 search bar
	var home_job_com = $("#home_job_com"),
		search_menu = $("#nav_search").find(".search_menu");
	var	kwDefaultVal = '請輸入關鍵字搜尋';

	search_menu.hover(function(){home_job_com.toggle();});

	home_job_com.click(function(){

		var menu_txt = search_menu.text(),
			hide_menu_text = $(this).find("a"),
			keyword_type = $("#keyword_type"),
			keyword_search = $("#keyword_search");
		var hide_text = hide_menu_text.text();
		if(hide_text == '找工作')
		{
			keyword_type.val("findJob");
		}
		else
		{
			keyword_type.val("findComp");
		}		
		search_menu.text(hide_menu_text.text());
		hide_menu_text.text(menu_txt);
		$(this).hide();
	});

	home_job_com.hover(function(){
		search_menu.addClass("search_menu_on");
		$(this).show();
	},function(){
		search_menu.removeClass("search_menu_on");
		$(this).hide();
	});

	// 開啟 h1 說明
	$("span.info").hover(function(){
		$("#h1_info").toggle();
	});

	// 開啟聯絡客服 (footer)
	$("#open_pop_tel").click(function(){$("#pop_tel").toggle();});
    $("#close_pop_tel").click(function(){$("#pop_tel").hide();});

	// Default Value
	try{
		$("#edit_resume_name").defaultValue("請輸入新的履歷名稱");				// 修改履歷名稱
		$("textarea.my_annotate").defaultValue("請輸入此工作相關的註記。");		// 工作註記輸入框
		$("textarea.my_annotate_com").defaultValue("請輸入此公司相關的註記。");	// 公司註記輸入框
		$("input.new_folder").defaultValue("建議最多5個字");					// 新資料夾輸入框
		//$("#keyword_search").defaultValue(kwDefaultVal);						// 關鍵字搜尋
		$("#keyword_search").attr("placeholder", kwDefaultVal);					// 關鍵字搜尋 使用placeholder method
		new SetPlaceHolder();

	}catch(e){}
});

/**
 *  Input Fields Cross-Browser with jQuery
 */
function SetPlaceHolder () {
    if (isIE(7) || isIE(8) || isIE(9)) {
        $('[placeholder]').focus(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function() {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
        $('[placeholder]').parents('form').on('submit', function() {
            $(this).find('[placeholder]').each(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            })
        });
    }
}

function isIE (ver){
    var b = document.createElement('b')
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
    return b.getElementsByTagName('i').length === 1
}


// disable button hover 顯示 info
function hoverDisableButton(selector){
	$(selector).css("cursor", "default").hover(function(){
		var $this = $(this),
			limitTxt = $("#limit_txt"),
			disableInfo = $("#disable_info"),
			limitStr;

		switch($this.attr("id")){
			case "edu_disable":
				limitStr = "學歷最多 3 筆";
				break;
			case "exper_disable":
				limitStr = "工作經驗最多 8 筆";
				break;
			case "seniority_disable":
				limitStr = "職務累計最多 4 筆";
				break;
			case "lang_disable":
				limitStr = "外文最多 4 筆";
				break;
			case "local_disable":
				limitStr = "方言最多 4 筆";
				break;
			case "attach_disable":
				limitStr = "附件最多 3 筆";
				break;
			case "recommend_disable":
				limitStr = "推薦人最多 2 筆";
				break;
			case "letter_disable":
				limitStr = "自我推薦信最多 3 筆";
				break;
			case "resume_disable":
				limitStr = "履歷最多 6 份";
				break;
			case "license_disable":
				limitStr = "駕駛執照最多 3 筆";
				break;
			case "transport_disable":
				limitStr = "交通工具最多 3 筆";
				break;
			case "disabled_disable":
				limitStr = "身心障礙最多 3 筆";
				break;
			case "mate_disable":
				limitStr = "配對條件最多 5 組";
				break;	
			case "floder_disable":
				limitStr = "資料夾最多 10 組";
				break;
			default:
				limitStr = "已達最大筆數";
				break;
		}
			
		limitTxt.text(limitStr);

		if ($.browser.version != "6.0" && $.browser.version != "7.0") {
			disableInfo.find(".arrow_top").css("right", ((disableInfo.width()/2)-20));
		} 

		disableInfo.css({
			"left": $this.offset().left,
			"top": $this.offset().top + $this.height() + 10
		}).toggle();
	});
}

// 計算字數
function textNoCount(txtObj, noObj, maxNum, alertObj) {
	var alertStr = "<span class='icon_attention'></span><span class='error'>填寫字數過長</span>",
		txtNum;

	txtObj.keyup(function(){
		txtNum = $(this).val().length;		// 計算字數
		noObj.text(txtNum);					// 顯示字數
		( txtNum > maxNum ) ? alertObj.html(alertStr) : alertObj.html("");		// 顯示字數超過 alert
	});
}

// 勾選 checkbox，enable/disable 相關的項目
function checkToEnable(trigger, checked, target) {		
	target.attr("disabled", !checked);		//開啟頁面時確定是否勾選
	
	trigger.change(function(){
		target.attr("disabled", !target.attr("disabled"));
	});
}

/**
 * 計算輸入字數 (Byte) 
 * 請暫時別刪它 by jack 
 */
String.prototype.Blength = function() {
	var a=encodeURI(this);
	if(a.indexOf("%") != -1){
		var count=a.split("%").length-1;
		if(count==0){count++;}
		var tmp=a.length-(count*3);
		count=count+tmp;
	} else {
		count=a.length;
	}
	return count;
};

// 檢查 input 中是否有輸入值，有的話則計算字數
function checkEmpty(txtObj, noObj){
	(txtObj.hasClass("empty")) ?  noObj.html(0) :  noObj.html(txtObj.val().length);
}

/* 市場薪資圖表 function - start */
$.fn.jqChart = function(settings) {

	var DEFAULT_SETTINGS = {
			chartType: "overview",
			salaryType: "year",
			chartId: undefined,
			seriesColor: [ "#ccc" ],
			xaxisMin: 0,
			xaxisMax: undefined,
			tick: undefined,
			label: undefined,
			dataList: undefined,

			avg: undefined,
			line1: undefined,
			line2: undefined,
			label1: undefined,
			label2: undefined
		},
		settings = $.extend(DEFAULT_SETTINGS, settings),
		plotObj;

	// 取 array 中的最大值
	Array.max = function( array ){
        return Math.max.apply( Math, array );
    };

	// 設定 x軸 的最大值，讓 bar 的 label 不會消失
	if(typeof(settings.xaxisMax) == 'undefined') {
		var tempMax = 0,
			tmptickInterval;
			
		if(typeof(settings.dataList) != 'undefined') {
			tempMax = Array.max(settings.dataList);
		}	

		if(tempMax != 0){
			if(tempMax > 10000){
				tempMax = (Math.floor(tempMax/10000) + 1) * 15000;							// 月薪，以 10000 為單位 * 1.5 (倍)
				tmptickInterval = 15000;
			} else {
				tempMax = (Math.floor(tempMax/10) + 4);										// 年薪，以 10 為單位
				tempMax = (tempMax % 2 == 0) ? tempMax * 10 : (tempMax + 1) * 10; 
				tmptickInterval = 20;
			}
			settings.xaxisMax = tempMax;
		} else {
			settings.xaxisMax = undefined;
		}
	}
	if(settings.chartType == "overview"){
		// 總覽 - 年薪
		if(settings.salaryType == "year"){
			plotObj = $.jqplot(settings.chartId, [settings.avg, settings.line1, settings.line2], {
				seriesColors: settings.seriesColor,
				series:[
					{	
						shadow: false,
						lineWidth: 2,
						pointLabels:{
							show: true, 
							ypadding: 3, 
							location: "ne"
						}
					},
					{
						renderer:$.jqplot.BarRenderer,
						rendererOptions:{barWidth: 13,barDirection:"horizontal", barPadding:6, barMargin:10},
						shadow: false,
						pointLabels:{show: true, location:"e", labels:settings.label1}
					},
					{
						renderer:$.jqplot.BarRenderer,
						rendererOptions:{barWidth: 13,barDirection:"horizontal", barPadding:6, barMargin:10},
						shadow: false,
						pointLabels:{show: true, location: "e", labels:settings.label2}
					}
				],
				axesDefaults:{tickOptions:{formatString:"%i"}, autoscale:false, useSeriesColor:true},
				axes:{
					xaxis:{tickInterval:tmptickInterval,min:settings.xaxisMin, max:settings.xaxisMax}, 
					yaxis:{renderer:$.jqplot.CategoryAxisRenderer, ticks:settings.tick}
				}
			});
		
		// 總覽 - 月薪
		} else {
			plotObj = $.jqplot(settings.chartId, [settings.avg, settings.line1, settings.line2], {
				seriesColors: settings.seriesColor, 				// 線的顏色
				series:[											// 基準線的設定
					{   		
						shadow: false,			// 是否顯示陰影
						lineWidth: 2, 			// 線的寬度
						pointLabels:{			
							show: true, 		// 是否顯示基準線的 label
							ypadding: 3, 		// label 顯示的 y padding
							xpadding: 20,		// label 顯示的 x padding
							location: "ne"		// label 顯示的和 bar 的相對位置: nw, n, ne, e, se, s, sw, w.
						}
					},
					{}, 
					{
						renderer:$.jqplot.BarRenderer, 
						rendererOptions:{
							barWidth: 13,					// bar 的寬度
							barDirection: "horizontal", 	// bar 的方向: vertical or horizontal
							barPadding: 3, 
							barMargin: 28
						}, 
						shadow: false,
						pointLabels:{ show: true, location: "e"}
					}
				], 
				axesDefaults:{tickOptions:{formatter:$.jqplot.sprintf, formatString:"%d"}, autoscale:false, useSeriesColor:true},
				axes:{
					xaxis:{ min:settings.xaxisMin, max:settings.xaxisMax}, 
					yaxis:{renderer:$.jqplot.CategoryAxisRenderer, ticks:settings.tick }
				}
			});
		}
		

	// 依工作所在地、工作年資 或 學歷
	} else {
		plotObj = $.jqplot(settings.chartId, [settings.dataList], {
			seriesColors: settings.seriesColor,
			seriesDefaults: {
	            renderer:$.jqplot.BarRenderer,
	            pointLabels: { show: true, location: "e", labels:settings.label },
	            shadow: false,
	            rendererOptions: { barWidth: 13, barDirection: "horizontal" }
	        },
	        axesDefaults:{tickOptions:{formatString:"%d"}, autoscale:false, useSeriesColor:true},
			axes:{
				xaxis:{tickInterval:tmptickInterval,min:settings.xaxisMin, max:settings.xaxisMax}, 
				yaxis:{renderer:$.jqplot.CategoryAxisRenderer, ticks:settings.tick}
			}
		});
	}

	return plotObj;
};
/* 市場薪資圖表 function - end */