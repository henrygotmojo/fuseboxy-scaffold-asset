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
	// file field buttons behavior
	$('.scaffold-input-file:not(.uploader-ready)').each(function(){
		// elements
		var $container  = $(this);
		var $field      = $container.find('[data-toggle=ajax-upload]');
		var $chooseBtn  = $( $field.attr('data-choose-button') );
		var $removeBtn  = $( $field.attr('data-remove-button') );
		var $undoBtn    = $( $field.attr('data-undo-button') );
		var $preview    = $( $field.attr('data-preview') );
		// create hidden form
		var ajaxFormID = $container.attr('id')+'-ajax-upload';
		var $ajaxForm = $('<form><input type="file" name="file" /><button type="submit">Upload</button></form>').attr({
			'id'              : ajaxFormID,
 			'action'          : $field.attr('data-form-action'),
			'method'          : 'post',
			'enctype'         : 'multipart/form-data',
 			'data-toggle'     : 'ajax-submit',
 			'data-target'     : $field.attr('data-target'),
 			'data-callback'   : "fuseboxyScaffold__initAjaxUploader(); $('#"+ajaxFormID+"').remove();",
 			'data-transition' : 'none',
 		}).hide().appendTo('body');
		// hidden file field
		// ===> choose file & auto-submit
		var $hiddenFileField = $ajaxForm.find('[type=file]');
		$hiddenFileField.on('change', function(evt){
			evt.preventDefault();
			if ( $(this).val().length ) $ajaxForm.find(':submit').click();
		});
		// choose button
		// ===> open file select dialog
		$chooseBtn.on('click', function(evt){
			evt.preventDefault();
			$hiddenFileField.click();
		}).removeClass('disabled');
		// remove button
		// ===> click to clear selected image
		$removeBtn.on('click', function(evt){
			evt.preventDefault();
			$field.val('');
			$preview.parent().hide();
			$undoBtn.removeClass('d-none');
			$removeBtn.hide();
		});
		// undo button
		// ===> click to restore to original image
		$undoBtn.on('click', function(evt){
			evt.preventDefault();
			$field.val( $undoBtn.attr('data-original-image') );
			$preview.parent().show().attr('href', $undoBtn.attr('data-original-image'));
			$preview.attr('src', $undoBtn.attr('data-original-image'));
			$undoBtn.addClass('d-none');
			$removeBtn.show();
		});
		// mark complete
		$container.addClass('uploader-ready');
	});
}