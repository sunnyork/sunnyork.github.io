var boxShow = 0;
$.fn.lightBox = function(settings) {

	// default value
	var DEFAULT_SETTINGS = {
			boxName:           "#box",
			lightBoxName:      "#lightbox",
			btnName:           "#closeBtn",
			btnOkName:         undefined,
			backgroundOpacity: 0.8,
			fixed:             true,//對話窗是否要fix在畫面中間

			// Callback function
			maskClickClose:    true,
			onOpen:            undefined,
			onClose:           undefined,
			onOk:              undefined
		},
		_settings = $.extend(DEFAULT_SETTINGS, settings),
		html = $("html") , 
		body = $("body") , 
		box = $(_settings.boxName) , 
		lightBox = $(_settings.lightBoxName) , 
		lightBoxZ = lightBox.css("z-index") , 
		flatBrowser = thinBrowser = boxX = boxY = browserW = browserH = bodyW = bodyH = boxH = scrollTop = lockCheck = scrollbarWidth = 0 , 
		scrollPosition = [],
		lightBoxCID, lightBoxCIDiv;
	// when open lightbox or change browser size
	var checkSize = function(){

		// record scroll position
		scrollPosition = [self.pageXOffset || document.documentElement.scrollLeft, self.pageYOffset || document.documentElement.scrollTop ];
		scrollTop = $(window).scrollTop();		// scrollbar top

		// hide XY scroll for analysis browser width & height correctly
		if(boxShow==0){html.css({"overflow-y": "hidden","overflow-x": "hidden"});}

		browserW = $(window).width();		// browser weight
		browserH = $(window).height();		// browser height
		bodyW = $(document).width();		// body width
		bodyH = $("body").height();			// body height
		boxW = box.outerWidth(true);		// box width
		boxH = box.outerHeight(true);		// box height

		if($.browser.version == "8.0" || $.browser.version == "6.0"){bodyW-=4}	// bodyW more 4px when useIE6, IE8
		if(boxShow==1){lightBox.width(browserW);}						// lightbox width = browserW ,avoid wrong bodyW when narrow browser

		// recovery XY scroll & analysis scrollbar width
		if(boxShow==0){
			html.css({"overflow-y": "scroll","overflow-x": "auto"});
			scrollbarWidth = browserW - $(window).width();
		}
		whenUseFF();

		// z-index value
		if(parseInt(lightBoxZ) >= parseInt(box.css("z-index"))){
			box.css("z-index", parseInt(lightBoxZ)+1);
		}
		
		// change lightbox gray bg height
		var boxHY = boxH+boxY,height,width;
		if( browserH > bodyH ){height = ( browserH > boxHY ) ? browserH : boxHY;}
		else{height = ( boxHY > bodyH ) ? boxHY : bodyH;}

		// change lightbox gray bg width
		if( browserW < bodyW ){width = ( bodyW > boxW ) ? bodyW : boxW;}
		else{width = ( boxW > browserW ) ? boxW : browserW;}

		lightBox.height(height).width(width);

		// change box position
		browserW < boxW ? boxX = 20 : boxX = (browserW-boxW)/2;
		browserH < boxH ? boxY = scrollTop+40 : boxY = (browserH-boxH)/2 + scrollTop;
		box.css("left",boxX);
		box.css("top",boxY);

		// analysis browser's shape
		flatBrowser = 0; thinBrowser = 0;
		browserW < (boxW+20) ? flatBrowser=1 : flatBrowser=0 ;
		browserH < (boxH+20) ? thinBrowser=1 : thinBrowser=0 ;
	};
	box.data("checkSize",checkSize);

	// CSS
	if($.browser.version != "6.0"){
		lightBox.css("position","fixed");	// IE6 can't read fixed
	}
	$("html").css({"overflow-y": "scroll","overflow-x": "auto"});

	// lock scroll
	var lockScroll = function(){
		if (_settings.fixed==false){return;}//fixed狀態下。不鎖定圖層
		lockCheck = 1;
		html.data({"scroll-position": scrollPosition,"previous-overflow": html.css("overflow")}).css({"overflow-y": "hidden","overflow-x": "hidden"});
		whenUseFF();
		body.css("margin-right",scrollbarWidth);
		box.css("left",boxX);
		lightBox.css("overflow-y","scroll");
	};

	// un-lock scroll
	var unlockScroll = function(){
		if (_settings.fixed==false){return;}//fixed狀態下。不鎖定圖層
		lockCheck = 0;
		html.css({"overflow": html.data("previous-overflow"),"overflow-y": "scroll","overflow-x": "auto"});
		whenUseFF();
		body.css("margin-right","0");
		box.css("left",boxX);
		lightBox.css("overflow-y","hidden");
	};

	// scroll to current position when use FireFox
	var whenUseFF = function(){
		if ($.browser.mozilla){
			if (_settings.fixed==false){return;}//fixed狀態下。不再重新定位
			window.scrollTo(scrollPosition[0], scrollPosition[1]);
		}
	};

	// define lightbox bg class name
	lightBoxCID = "LB" + Math.ceil(Math.random()*100);
	lightBoxCIDiv = "." + lightBoxCID;

	// close do
	var closeDo = function(){
		if(thinBrowser == 0 && flatBrowser == 0){unlockScroll();}
		lightBox.fadeOut(250);
		box.fadeOut(250);
		boxShow=0;

		//box關閉後，移除resize跟scroll事件
		$(window).unbind('resize',run_onResize);
		$(window).unbind('scroll',run_onScroll);
	}

	// resize時要執行的function
	var run_onResize = function(){
		if(boxShow==1){
			checkSize();
			if(thinBrowser == 0 && flatBrowser == 0){
				if(lockCheck == 0){lockScroll();}
			}else{
				if(lockCheck == 1){unlockScroll();}
			}
		};	
	}
	var run_onScroll = function(){
		if(boxShow==1){
			if (_settings.fixed==false){return;}//fixed狀態下。不再重算位置		
			checkSize();
		};	
	}
	// open lightbox
	var openFunc = function(){
		if(_settings.onOpen === undefined || _settings.onOpen(box) !== false ){
			checkSize();
			if(thinBrowser == 0 && flatBrowser == 0){lockScroll();}
			lightBox.fadeTo(250, _settings.backgroundOpacity);
			box.fadeIn(250);
			boxShow=1;
			lightBox.attr("class",lightBoxCID);

			//box開啟後，註冊視窗的resize跟scroll事件
			// Resize when it show
			$( window ).bind( "resize",run_onResize);
			// position change dect
			$( window ).bind( "scroll",run_onScroll);
		}
	};
	box.data("open",openFunc);

	// close lightbox
	var closeFunc = function(){
		if(typeof(scrollPosition[1]) != "undefined"){
			if(_settings.onClose === undefined || _settings.onClose(box) !== false){
				closeDo();
			}
		}
	};
	box.data("close",closeFunc);
	
	// mask bg click close
	$(document).on("click",lightBoxCIDiv,function(event){
		if(_settings.maskClickClose){
			closeFunc();
		}
	});

	// box close icon
	$(document).on("click",_settings.btnName,function(event){
		closeFunc();
	});

	// button OK name
	if(typeof _settings.btnOkName == "string"){
		$(document).on("click",_settings.btnOkName,function(event){
			if(_settings.onOk === undefined || _settings.onOk(box) !== false){
				closeDo();
			}
		});
	}

	// open lightbox
	$(this).live("click", function(){
		openFunc();
	});
};