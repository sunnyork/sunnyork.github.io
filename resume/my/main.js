$(function(){	
	//<!-- 履歷開放設定 -->
	$('.open_box_resume_store_no').lightBox({boxName: '#box_resume_store_no',btnOkName: '#decide_store_new', btnName: '.close, #cancel_store',maskClickClose:false,onOpen:editResumeOnOpen,onOk:resumeStroeNoOnOk});
	$('.open_box_resume_store_dnf').lightBox({boxName: '#box_resume_store_dnf', btnOkName: '#dnf_decide_store', btnName: '.close, #dnf_cancel_store',maskClickClose:false,onOpen:editResumeOnOpen,onOk:edit_resume_onok});
    
    //<!-- 新增履歷 -->
	$('.resume_new_btn,.open_box_new_resume').lightBox({boxName: '#box_new_resume', btnOkName:'#decide_new_resume' , btnName: '.close, #cancel_new_resume', maskClickClose:false, onOpen:newResumeOnOpen, onClose:newResumeOnClose, onOk: newResumeOnOk});
	
	//<!-- 繼續編修履歷 -->
	$("<span />").lightBox({boxName: '#box_edit_resume', btnOkName:'#resume_edit_decide_store', btnName: ' #resume_edit_close, #resume_edit_cancel_store',maskClickClose:false,onOk:edit_resume_onok,onClose: edit_resume_onclose});
	//<!-- 判斷「新增履歷」是否disable -->
	checkResumeNewBtn();
	
	var adIdArr = [];
	var wid , cid;
	if(location['host'] == 'pda.e104.com.tw'){
		adIdArr = [612];
		wid = 1;
		cid = 7;
	}else{
		adIdArr = [570];
		wid = 2;
		cid = 18;
	}
	
	//精準廣告
	if ((typeof e104aidma_checkBoardIsDefault !== "undefined") && e104aidma_checkBoardIsDefault(adIdArr[0]) == 1 ){
	    e104aidma_show('aidma_'+adIdArr[0], wid, cid,adIdArr[0],false,true);
	}else{
		$('#my_ad_top').hide();//隱藏廣告
	}
	
	$("a.resumeSet").click(function(){changeResumeSetStatus(this);});
});

var myurl;
function gotoPage(url){
    myurl = url;

    if($('.open_box_resume_store_no').size()>0){
        $('.open_box_resume_store_no').click();
    }else if($('.open_box_resume_store_dnf').size()>0){
        $('.open_box_resume_store_dnf').click();
    }else{
        location.href = myurl;
    }
}


//<!-- 履歷開放設定 無已完成履歷資料 -->
$("#no_decide_store").on("click", function(){
    //呼叫新增履歷
});


//<!-- 新增履歷 -->

function newResumeBeforeValidate(form){
	$("#NewResumeFmo_resumeName").change(function(){$(this).val($(this).val().toString().replace(/^[\s\u3000]*|[\s\u3000]*$/g,""))});
	var resumeName = $('#NewResumeFmo_resumeName').val();
	if(resumeName.match('\u8acb\u8f38\u5165\u5c65\u6b77\u540d\u7a31')){
		$('#NewResumeFmo_resumeName').val('');
	}
	return true;
}

function newResumeAfterValidate(form, data, hasError){
	if(hasError){
		form.find('#NewResumeFmo_resumeName').defaultValue('\u8acb\u8f38\u5165\u5c65\u6b77\u540d\u7a31');
		return false;
	}
	return true;
}

function newResumeSuccessProccess(form, data)
{
	redirectToResumeIndex(data);
	if(data != '' && data !=null)
		{
			if(data.UserData.newResumeErr){
				if(data.UserData.resumeCount >= 6){
					alert("履歷最多6筆!");
				}else{
					alert('履歷複製異常!');
				}
			}else{		
				if($("#nowRsmCnt").length > 0)
				{
					$("#nowRsmCnt").val(data.UserData.resumeCount);
				}
				
				var strStatus = '';
				if(data.UserData.newResumeArr.resumeStatus != '')
				{
					strStatus = '('+data.UserData.newResumeArr.resumeStatus+')';
				}

				if( typeof data.UserData.masterAnnounce != 'undefined')
				{
					var announceObj = data.UserData.masterAnnounce;
					var announceStr = '';
					var announceArr  = [];
					var i = 0;
					for(var key in announceObj)
					{
						announceArr[i++] = '<span class="txt_red">' + announceObj[key] + '</span>';
					}
					if(announceArr.length > 0)
					{
						announceStr = announceArr.join('、');
					}
					
					if(announceStr != '')
					{
						$("#box_resume_store_dnf p").filter(":first").html("您尚未填寫 " + announceStr + "，因此目前無法進行履歷設定。");
					}
				}
				
				
				var job_cont = $('div.joblist_cont:last').html();
				//ie7 jquery.clone會有錯誤,所以不使用clone做複製dom使用
				$("<div id=\"\" class=\"joblist_cont\">"+job_cont+"</div>").insertAfter('div.joblist_cont:first');
				var newResume = $('div.joblist_cont').eq(1).show();
				newResume.attr('id',data.UserData.newResumeArr.nv).find('div.resume_class').children('span').html(data.UserData.newResumeArr.resumeType);
				newResume.find('#resume_name').text(data.UserData.newResumeArr.resumeName).next('span').html(strStatus);
				newResume.find('div.resume_date').text(data.UserData.newResumeArr.updateDate);
				newResume.find('.edit_resume').attr('href',data.UserData.newResumeArr.editUrl);
				newResume.find('.preview_resume').attr('href',data.UserData.newResumeArr.previewUrl);
				//依履歷表類別分類class
				if(data.UserData.resumeTypeCode != 3)
				{
					$('div.joblist_cont').eq(1).find('ul>li:first>div>span.mark').removeClass().addClass('mark');
				}
				else
				{
					$('div.joblist_cont').eq(1).find('ul>li:first>div>span.mark').removeClass().addClass('mark high');
				}
				//填上履歷表名稱在履歷表更名的燈箱
				$("#box_change_resume_name").find("#view_edit_resume_name").text(data.UserData.newResumeArr.resumeName);
				
				//bind 滑鼠滑到履歷類別要有layout出現
				$('div.joblist_cont').eq(1).find('ul>li:first>div>span.mark').hover(function(){
							var $this = $(this),
							condInfo = $('#mark_info'),
							infoTxt = $('#info_txt'),
							infoStr;
						
						infoStr = ($this.hasClass('high')) ? '用於應徵主管級職缺，僅提供104獵才顧問中心搜尋' : '用於應徵全職或兼職的職缺';
						
						infoTxt.text(infoStr);
						infoTxt.css('margin-top','4px');
						condInfo.find('.arrow_top').css('right', ((condInfo.width()/2)-20));
						condInfo.css({
							'left': $this.offset().left,
							'top': $this.offset().top + $this.height() + 10
						}).toggle();
					});
				
				
				
				copyResumeRadio = $("span#newResumeModel_resumeType").find("ul.form_list:first").children("li.radio");
				if(copyResumeRadio.length > 0){
					var addresume = $("span#newResumeModel_resumeType").find("ul.form_list:first");
					$("<li class=\"radio\">"+$(addresume).children("li.radio:first").html()+"</li>").insertAfter("ul.form_list:first li.radio:last");
					var newresume = $(addresume).children("li.radio:first");
					$(newresume).children('input').attr("id","NewResumeFmo_resumeType_" + resumeCount);
					$(newresume).children('input').val(data.UserData.newResumeArr.nv);
					$(newresume).children('label').attr("for","NewResumeFmo_resumeType_" + resumeCount);
					$(newresume).children('label').text(data.UserData.newResumeArr.resumeName);
					$("#box_new_resume").data("nv",data.UserData.newResumeArr.nv);
				}else{
					var copyResume = $("span#newResumeModel_resumeType").children('dd:first');
					copyResume.show();
					append = "<li class='radio'><input id='NewResumeFmo_resumeType_0' class='duplicate_resume' value='"+data.UserData.newResumeArr.nv+"' type='radio' name='NewResumeFmo[resumeType]'>";
					append += "<label for='NewResumeFmo_resumeType_0'>"+data.UserData.newResumeArr.resumeName+"</label></li>";
					copyResume.children('ul').append(append);
					$("#box_new_resume").data("nv",data.UserData.newResumeArr.nv);
				}
				nowNv = data.UserData.newResumeArr.nv;
				//履歷表只有一份就disable"刪除"
				if(clearDelResumeEvent() == 0)
				{
					$(".joblist_cont").filter('[id!="0"]').each(function(){
						var href = $('<a></a>').attr({'href':'javascript:void(0);','class':'delete_resume'});
						
						$(this).find('.resume_icon:last').wrapInner(href);
						$(this).find('.resume_icon:last > a.delete_resume').unbind('click').bind('click',function(){
    						versionNo = $(this).parents("div.joblist_cont").attr("id");
    						actionDeleteResume(versionNo);
    						clearDelResumeEvent();
    					});
					});
				}
				url = baseUrl + "/my104/resume/profile?nv=" + data.UserData.newResumeArr.nv; 
				$("<li id='mIndex_"+data.UserData.newResumeArr.nv+"'>．<a href='"+url+"'>"+data.UserData.newResumeArr.resumeName+"</a></li>").insertAfter("#mResumeList");				
				resumeCount=data.UserData.resumeCount;
				
				try{
				    $("<li><a href='"+url+"'>"+data.UserData.newResumeArr.resumeName+"<span class='txt_gray'> "+strStatus+" </span></a></li>").insertBefore("div.basic_info>ul>li:first");
				    $("#noresume").remove();
				}catch(e){}
				
				try{
					if(typeof(changeResumeButton) != "undefined") {
						changeResumeButton(resumeCount);
					}
				}catch(e){}
				
				if(resumeLostCont.length == 0){
					resumeLostCont="profile";
				}
				location.href=baseUrl + "/my104/resume/"+resumeLostCont+"?nv=" + nowNv;
			}

		}
}

function clearDelResumeEvent(){
	clearFlag=0;
	if($(".joblist_cont").filter('[id!="0"]').length == 1)
	{
		$(".joblist_cont").filter('[id!="0"]').find('.resume_icon:last').empty().append('\u522a\u9664');
		clearFlag=1
	}
	return clearFlag;
}

function newResumeErrorProcess(form, data, textStatus)
{
	alert('系統異常，請稍後再試。');
}

function newResumeOnOpen(box){
	if(typeof userStatus != 'undefined' && userStatus != 6 && userStatus >= 4)
	{
		location.href = baseUrl+'/my104/resume/manage';
		return false;
	}
	else
		{
			var rsmCnt = 0;
			if($("#nowRsmCnt").length > 0)
			{
				rsmCnt = parseInt($("#nowRsmCnt").val());
			}
			
			if(rsmCnt == 5)
			{
				alert('\u5c65\u6b77\u6700\u591a6\u4efd\uff0c\u76ee\u524d\u5df2\u67095\u4efd\u5c65\u6b77\uff0c\u60a8\u6b63\u5728\u65b0\u589e\u7b2c6\u4efd');
			}
			if( rsmCnt >= 0 && rsmCnt <= 5 )
			{
				rsmCnt = rsmCnt + 1;
				var numToCharArr = ['','\u4E00','\u4E8C','\u4E09','\u56DB','\u4E94','\u516D']
				$("#NewResumeFmo_resumeName").val('\u7B2C'+numToCharArr[rsmCnt]+'\u4EFD\u5C65\u6B77\u8868')
			}
			$("#newresume-form").data('boxClose',box.data('close'));
		}
	}


function newResumeOnOk(box){
	return false;
}

function newResumeOnClose(box){
	$("#newresume-form").each(function(){
		this.reset();
	});
	$('#NewResumeFmo_resumeName').defaultValue('\u8acb\u8f38\u5165\u5c65\u6b77\u540d\u7a31');
}

function uploadonOk(box){
	return false;
}

function beforeUpload(obj){
	return true;
}

function edit_resume_onok(box){
	if(resumeLostCont.length == 0){
		resumeLostCont="profile";
	}
	location.href=baseUrl + "/my104/resume/"+resumeLostCont+"?nv=" + nowNv;
}

function edit_resume_onclose(){
	checkResumeNewBtn()
	var length = $("#newResumeModel_resumeType").find("ul.form_list:first").children("li.radio").length;
	$("#mResumeList").find("span.txt_gray").text("("+length+")");
}

function checkResumeNewBtn(){
	var str = $("#resume_new_href").text();
	if($("#megamenu_resume .nav_sub li").length == 8){
		$("#resume_new_href").html("<span class='txt_gray'>"+str+"</span>");
	}else{
		$("#resume_new_href").html("<a href='javascript:void(0);' class='resume_new_btn'>"+str+"</a>");
	}
	if($('div.basic_info>ul>li').size()<6){
		$('#resume_add_c').removeClass("display_none");
		$('.resume_disable_c').addClass("display_none");
	}else{
		$('#resume_add_c').addClass("display_none");
		$('.resume_disable_c').removeClass("display_none");
		hoverDisableButton('#resume_disable');
	}
}



/**
 * 判斷要開燈箱還是直接導到總覽頁
 */
function changeResumeSetStatus(linkObj){
	
	
	if( (resumeCount >= 1 & hasCompleteResume >=1) ||  
		(userStatus == 4 || userStatus == 5) 
	  ){
		location.href = $(linkObj).attr("href");
	}else if( resumeCount >= 1 & hasCompleteResume == 0){
		$("#box_resume_store_dnf").data("open")();
	}else if(resumeCount == 0){
		$("#box_resume_store_no").data("open")();
	}
}


function resumeStroeNoOnOk(box){
	$(box).data("close")();
	$("#lightbox").stop();
	$("#lightbox").hide();
	$("#box_new_resume").data("open")();
	return false;
}

function editResumeOnOpen()
{
	if(typeof userStatus != 'undefined' && (userStatus == 4 || userStatus == 5))
	{
		location.href = baseUrl+'/my104/resume/manage';
		return false;
	}
	return true;
}

function redirectToResumeIndex(data){
	if(typeof data != 'undefined' 
		&& typeof data.UserData != 'undefined' 
		&& typeof data.UserData.resumeExist != 'undefined' 
		&& data.UserData.resumeExist == false)
	{
		alert('\u6b64\u4efd\u5c65\u6b77\u7a0d\u65e9\u5df2\u88ab\u522a\u9664\uff0c\u8acb\u91cd\u65b0\u586b\u5beb');
		location.href = baseUrl+'/my104/resume/manage';
		return false;
	}
}

//ga
try {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
} catch(err) {}
ga('create', 'UA-15276226-1', {'cookieDomain': '104.com.tw'});
ga('send', 'pageview', location.pathname);
ga('require', 'displayfeatures');
GAEvent=function(category, action, opt_label, opt_value){
 ga('send', 'event', category, action, opt_label, opt_value);
};