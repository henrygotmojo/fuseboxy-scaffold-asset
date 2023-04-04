$(function(){


	// init ajax-uploader when page ready
	// ===> also when inline-edit & modal shows up
	fuseboxyScaffold__initAjaxUploader();
	$(document).on('ajaxLoad.bsx shown.bs.modal', function(evt){
		window.setTimeout(function(){
			fuseboxyScaffold__initAjaxUploader();
		}, 1000);
	});


	// init html-editor when page ready
	// ===> also when inline-edit & modal shows up
	fuseboxyScaffold__initHtmlEditor();
	$(document).on('ajaxLoad.bsx shown.bs.modal', function(evt){
		window.setTimeout(function(){
			fuseboxyScaffold__initHtmlEditor();
		}, 500);
	});


	// init datetime-picker when page ready
	// ===> also when inline-edit & modal shows up
	fuseboxyScaffold__initDatetimePicker();
	$(document).on('ajaxLoad.bsx shown.bs.modal', function(evt){
		window.setTimeout(function(){
			fuseboxyScaffold__initDatetimePicker();
		}, 500);
	});


	// sticky header
	$(window).on('scroll resize', function(evt){
		var $window = $(this);
		// check if any scaffold header
		$('.scaffold-header.sticky').each(function(){
			var $header = $(this);
			var $headerPlaceholder = $header.find('+ .scaffold-header-placeholder');
			// initiate placeholder container (when necessary)
			if ( !$headerPlaceholder.length ) {
				$headerPlaceholder = $('<div class="scaffold-header-placeholder"></div>').hide().height($header.outerHeight()).insertAfter($header);
			}
			// current status
			var scrollDownBeyondHeader = ( !$header.hasClass('sticky-active') && $window.scrollTop() >  $header.offset().top );
			var scrollUpAndReachHeader = (  $header.hasClass('sticky-active') && $window.scrollTop() <= $headerPlaceholder.offset().top );
			// make header sticky
			if ( scrollDownBeyondHeader ) {
				$headerPlaceholder.show();
				$header.addClass('sticky-active');
				$header.css('left', $headerPlaceholder.offset().left).css('width', $headerPlaceholder.outerWidth());
			// restore header to original state
			} else if ( scrollUpAndReachHeader ) {
				$headerPlaceholder.hide();
				$header.removeClass('sticky-active');
			// refresh header position
			} else if ( $header.hasClass('sticky-active') ) {
				$header.css('left', $headerPlaceholder.offset().left).css('width', $headerPlaceholder.outerWidth());
			}
		});
	}).scroll();


}); // document-ready




function fuseboxyScaffold__initDatetimePicker(){
	$('.scaffold-input-datetime,.scaffold-input-date,.scaffold-input-time').not('.datepicker-ready').each(function(){
		var config = {};
		var $field = $(this);
		// config @ date
		if ( $field.hasClass('scaffold-input-date') ) config = {
			format: 'Y-m-d',
			datepicker: true,
			timepicker: false,
			scrollMonth : false,
			scrollInput : false
		};
		// config @ time
		else if ( $field.hasClass('scaffold-input-time') ) config = {
			format: 'H:i',
			datepicker: false,
			timepicker: true,
			scrollInput : false,
			step: 30
		};
		// config @ datetime
		else config = {
			format: 'Y-m-d H:i',
			datepicker: true,
			timepicker: true,
			scrollInput : false,
			step: 30
		};
		// transform
		$field.datetimepicker(config);
		// mark complete
		$field.addClass('datepicker-ready');
	});
}




function fuseboxyScaffold__initHtmlEditor(){
	$('.scaffold-input-wysiwyg:not(.editor-ready').each(function(){
		// transform
		$(this).summernote({ 'height' : $(this).height() });
		// mark complete
		$(this).addClass('editor-ready');
	});
}




function fuseboxyScaffold__initAjaxUploader(){
	// hidden form behavior
	$('.scaffold-ajax-upload:not(.uploader-ready)').each(function(){
		var $ajaxForm = $(this);
		var $inputField = $(this).find('input[type=file]');
		// choose file & auto-submit
		$inputField.on('change', function(evt){
			if ( $(this).val().length ) $ajaxForm.find(':submit').click();
		});
		// validate before submit
		$ajaxForm.on('submit', function(evt){
			var dataTarget = $(this).attr('data-target');
			if ( !dataTarget || !$(dataTarget).length ) evt.preventDefault();
			if ( !dataTarget ) alert('Attribute [data-target] not specified');
			else if ( !$(dataTarget).length ) alert('Element ['+dataTarget+'] not found');
		});
		// mark complete
		$ajaxForm.addClass('uploader-ready');
	});
	// file field buttons behavior
	$('.scaffold-input-file:not(.uploader-ready)').each(function(){
		// elements
		var $fieldContainer = $(this);
		var $field = $fieldContainer.find('input[type=text]');
		var $uploadBtn = $fieldContainer.find('.btn-upload');
		var $removeBtn = $fieldContainer.find('.btn-remove');
		var $undoBtn = $fieldContainer.find('.btn-undo');
		var $previewImg = $fieldContainer.find('.img-thumbnail');
		var $ajaxForm = $fieldContainer.closest('form').parent().find('.scaffold-ajax-upload');
		// click button to select file (in hidden form)
		$uploadBtn.on('click', function(evt){
			evt.preventDefault();
			$ajaxForm.attr('data-target', '#'+$fieldContainer.attr('id')).find('input[type=file]').click();
		}).removeClass('text-white').addClass('bg-white');
		// click button to clear selected image
		$removeBtn.on('click', function(evt){
			evt.preventDefault();
			$field.val('');
			$previewImg.parent().hide();
			$undoBtn.removeClass('d-none');
			$removeBtn.hide();
		});
		// click button to restore to original image
		$undoBtn.on('click', function(evt){
			evt.preventDefault();
			$field.val( $undoBtn.attr('data-original-image') );
			$previewImg.parent().show().attr('href', $undoBtn.attr('data-original-image'));
			$previewImg.attr('src', $undoBtn.attr('data-original-image'));
			$undoBtn.addClass('d-none');
			$removeBtn.show();
		});
		// mark complete
		$field.addClass('uploader-ready');
	});
}