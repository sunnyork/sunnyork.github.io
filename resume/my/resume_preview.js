$(function(){
	// 下載履歷
	$(".download").lightBox({boxName: "#resume_download" , btnName : "#resume_download .close ,#download, #cancel"});
	
	var agree = $('#agree'),
		download = $('#download');
		
	agree.next('label').css('cursor', 'pointer');
	
	// 按下載時就設回預設
	$(".download").click(function(){
		agree.attr('checked', false);
		download.attr('disabled', true);
		download.addClass('opacity');
	});
	
	download.click(function(){
		if(agree.prop("checked")){
			window.location.href = baseUrl+'/my104/downloadresume/'+nv+'/resume.doc';
			$("#resume_download").data("close")();
		}
	});
	$("#icon_edit,#icon_edit_f").click(function(){
		var ans  = confirm("您目前正開啟多個視窗，請先確認所有動作皆已完\n成，再修改履歷，" +
								"避免資料遺失。\n請確認是否修改履歷？");
		if(ans)
		{
			window.location.href = baseUrl+'/my104/resume/profile/index?nv=' + nowNv;
		}
		else
		{
			return false;
		}
	})
	
	$("#icon_print,#icon_print_f").click(function(){

		if(typeof nowNv != 'undefined')
		{
			countPrint();
			window.print();
			
			//window.location.href = baseUrl+'/my104/resume/manage/uploadtoibon?nv=' + nowNv;
		}
		else
		{
			return false;
		}
	})
	
	$("#icon_print_ibon,#icon_print_ibon_f").click(function(){

		if(typeof nowNv != 'undefined')
		{
			window.location.href = baseUrl+'/my104/resume/manage/uploadtoibon?nv=' + nowNv;
		}
		else
		{
			return false;
		}
	})	
	
	
	agree.change(function(){
		download.attr('disabled', !agree.is(':checked'));
		if(agree.is(':checked')){
			download.removeClass('opacity');
		} else {
			download.addClass('opacity');
		}
	});

});

function countPrint(){
	my104Ajax(
			{
				url			:baseUrl+"/my104/resume/manage/ResumePrintCount",
				type		:"POST",
				data		:{nv:nowNv},
				dataType	:"html",
				async		: false
			}
		);
}