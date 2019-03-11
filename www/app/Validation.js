"use strict";
/**
 *
 */
$('#entry-form').validate({
  rules: {
    'entry-name': {
      required: true,
      minlength: 5,
      maxlength: 100
    },
    'entry-notes': {
      required: true,
      minlength: 5,
      maxlength: 600
    },
  },
  messages: {
    'entry-name': {
      required: "A name for the entry is required.",
      minlength: "Minimum length of 5.",
      maxlength: "Maximum length of 100."
    },
    'entry-notes': {
      required: "Please enter a description.",
      minlength: "Minimum length of 5.",
      maxlength: "Maximum length of 600."
    }
  },

  /**
   *
   * @param error
   * @param element
   */
  errorPlacement: function(error, element) {
    // Put the error message just before the input element
    error.appendTo(element.parent().prev());
    //$(`<li class="error">${error}</li>`).appendTo($('#error-list'));
  },

  /**
   *
   * @param
   */
  submitHandler: function() {
    let submission = {
      'name': document.getElementById('entry-name').value,
      'notes': document.getElementById('entry-notes').value,
      'geolocation': document.getElementById('entry-geolocation').value,
      'image': document.getElementById('files').value
    };

    // Attempt to decode the image URI to check for a base64 string. If there's a catch, it needs to be changed to null
/*    try {
      window.atob(submission.image);
    } catch(exception) {
      alert('Not a base64 string!');
      // Not a base64 image. Probably the default image.
      submission.image = null;
    }*/

    if (Conference.dataContext.insertDatabase(submission)) {
      alert('Success');
    }
  }
});
