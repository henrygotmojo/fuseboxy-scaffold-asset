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
	$('.scaffold-input-file:not(.uploader-ready)').each(function(){
		var elementID = $(this).attr('id');
		// apply ajax-upload to this single field
		$('#'+elementID).each(function(){
			// elements
			var $fieldContainer = $(this);
			var $field = $fieldContainer.find('input[type=text]');
			var $uploadBtn = $fieldContainer.find('.btn-upload');
			var $removeBtn = $fieldContainer.find('.btn-remove');
			var $undoBtn = $fieldContainer.find('.btn-undo');
			var $progress = $fieldContainer.find('.progress-row');
			var $previewImg = $fieldContainer.find('.img-thumbnail');
			var $errMsg = $fieldContainer.find('.form-text');
			// use jquery for show & hide
			$fieldContainer.find('.d-none').removeClass('d-none').hide();
			// click button to clear selected image
			$removeBtn.on('click', function(evt){
				evt.preventDefault();
				$field.val('');
				$previewImg.parent().hide();
				$undoBtn.show();
				$removeBtn.hide();
			}).removeClass('text-white').addClass('bg-white');
			// click button to restore to original image
			$undoBtn.on('click', function(evt){
				evt.preventDefault();
				$field.val( $undoBtn.attr('data-original-image') );
				$previewImg.parent().show().attr('href', $undoBtn.attr('data-original-image'));
				$previewImg.attr('src', $undoBtn.attr('data-original-image'));
				$undoBtn.hide();
				$removeBtn.show();
			}).removeClass('text-white').addClass('bg-white');
			// validation
			if ( !$fieldContainer.attr('data-upload-url') ) {
				alert('attribute [data-upload-url] is required for file upload');
				return false;
			// add behavior to upload button
			// ===> it will enable the upload button automatically
			} else {
				// param from controller
				var _uploadUrl   = $fieldContainer.attr('data-upload-url');
				var _progressUrl = $fieldContainer.is('[data-progress-url]') ? $fieldContainer.attr('data-progress-url') : false;
				var _maxSize     = $fieldContainer.is('[data-file-size]') ? (parseFloat($fieldContainer.attr('data-file-size-numeric'))/1024) : false;
				var _allowedExt  = $fieldContainer.is('[data-file-type]') ? $fieldContainer.attr('data-file-type').split(',') : false;
				// init ajax uploader
				var uploader = new ss.SimpleUpload({
					//----- essential config -----
					button: $uploadBtn.removeClass('text-white').addClass('bg-white'),
					name: $fieldContainer.attr('id'),
					url: _uploadUrl,
					//----- optional config -----
					progressUrl: _progressUrl,
					multiple: false,
					maxUploads: 1,
					debug: true,
					// number of KB (false for default)
					// ===> javascript use KB for validation
					// ===> server-side use byte for validation
					maxSize: _maxSize,
					// server-upload will block file upload other than below items
					allowedExtensions: _allowedExt,
					// control what file to show when choosing files
					//accept: 'image/*',
					hoverClass: 'btn-hover',
					focusClass: 'active',
					responseType: 'json',
					// validate allowed extension
					onExtError: function(filename, extension) {
						var msg = filename + ' is not in a permitted file type. ('+$fieldContainer.attr('data-file-type').toUpperCase()+' only)';
						$errMsg.show().html(msg);
					},
					// validate file size
					onSizeError: function(filename, fileSize) {
						var msg = filename + ' is too big. ('+$fieldContainer.attr('data-file-size')+' max file size)';
						$errMsg.show().html(msg);
					},
					// show progress bar
					onSubmit: function(filename, extension, uploadBtn, fileSize) {
						// send original filename as additional data
						uploader._opts.data['originalName'] = encodeURI(filename);
						// clear image & show progress
						$errMsg.hide().html('');
						$previewImg.parent().hide();
						$progress.show();
						// hook progress
						this.setProgressBar( $progress.find('.progress-bar') );
						this.setProgressContainer( $progress.find('.progress') );
					},
					// start upload
					startXHR: function() {
						// Adds click event listener that will cancel the upload
						// The second argument is whether the button should be removed after the upload
						// true = yes, remove abort button after upload
						// false/default = do not remove
						var $abortBtn = $progress.find('.btn-abort');
						this.setAbortBtn($abortBtn, false);
					},
					// show upload preview (and show remove button)
					// ===> hide alert, hide progress bar
					onComplete: function(filename, response, uploadBtn, fileSize) {
						// upload succeed!
						if ( response.success ) {
							// update file path
							$field.val(response.fileUrl).trigger('change');
							// refresh preview image
							$previewImg.parent().show().attr('href', response.fileUrl);
							$previewImg.attr('src', response.fileUrl);
							// toggle buttons
							if ( $undoBtn.attr('data-original-image').length ) {
								$undoBtn.show();
								$removeBtn.hide();
							} else {
								$undoBtn.attr('data-original-image', response.fileUrl);
								$removeBtn.show();
							}
						// upload failed...
						} else {
							// simply show message
							$errMsg.html( response.msg ? response.msg : response ).show();
						}
						// hide progress bar
						$progress.hide();
					},					// any error
					onError: function(filename, errorType, status, statusText, response, uploadBtn, fileSize) {
						// show error in modal when not valid response
						var $errModal = $('#ss-error-modal');
						if ( !$errModal.length ) {
							$errModal = $(`
								<div id="ss-error-modal" class="modal fade" role="dialog">
									<div class="modal-dialog">
										<div class="modal-content bg-danger">
											<div class="modal-body"></div>
										</div>
									</div>
								</div>
							`);
							$errModal.appendTo('body');
						}
						$errModal.find('.modal-body').html(response).end().modal('show');
					}
				}); // new-simple-upload
			} // if-data-upload-url
			// mark complete
			$(this).addClass('uploader-ready');
		}); // each-element-id
	}); // each-scaffold-input-file
} // function