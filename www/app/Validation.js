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
   * @param form
   */
  submitHandler: function(form) {
    // Clear form and process data
    alert('Success');
  }
});
