"use strict";
/**
 * Validation
 *
 * jQuery Validation Library. Provides additional validation services.
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
    'files': {
      required: true
    }
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
    },
    'files': {
      required: "Please provide a photo or image."
    }
  },

  /**
   * Error Placement
   * @param error
   * @param element
   *
   * Places error text onto the offending element when the user violates validation constraints.
   */
  errorPlacement: function(error, element) {
    // Put the error message just before the input element
    error.appendTo(element.parent().prev());
    //$(`<li class="error">${error}</li>`).appendTo($('#error-list'));
  },

  /**
   * Submit Handler
   * @param
   *
   * This crazy function will construct an object for submission once validation is passed, submits it to the database,
   * and if successful, changes the page to the List Entries tab.
   */
  submitHandler: function() {
    let name = document.getElementById('entry-name').value;
    let notes = document.getElementById('entry-notes').value;
    let geolocation = document.getElementById('entry-geolocation').value;
    let image = document.getElementById('files').files[0];

    let reader = new FileReader();
    let base64 = null;

    // It is such a pain in the ass to get base64 strings
    if (image) {
      reader.readAsDataURL(image);
      reader.onload = function() {
        base64 = reader.result;

        // Build submission object
        let submission = {
          'name': name,
          'notes': notes,
          'geolocation': geolocation,
          'image': base64
        };

        // Submit to database
        if (Conference.dataContext.insertDatabase(submission)) {
          // Reset form
        } else {
          alert('Failed to submit');
        }

        $(':mobile-pagecontainer').pagecontainer('change', '#entries', {
          reload: false
        });
      };
    }
  }
});
