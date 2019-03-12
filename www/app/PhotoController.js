"use strict";
/**
 * Clear Button
 *
 * Constructs a button to remove the image if you want to change your mind and choose another image.
 */
const clearButton = function() {
  // Now build a new clear button to allow the user to delete their photo
  // https://stackoverflow.com/questions/1703228/how-can-i-clear-an-html-file-input-with-javascript
  let clearButtonArea = document.getElementById('clear-button-area');
  let clearButton = document.createElement('button');

  clearButton.setAttribute('id', 'clear-button');
  clearButton.setAttribute('class', 'ui-textinput ui-corner-all ui-shadow-inset ui-textinput-text ui-body-inherit');
  clearButton.setAttribute('onclick', 'clearPhoto()');
  clearButton.innerHTML = 'Remove Image';
  clearButtonArea.appendChild(clearButton);
};

/**
 * Clear Photo
 *
 * This function is triggered once the clear image button is pressed and resets the image back to a placeholder, and
 * clears form data. It also removes the button.
 */
const clearPhoto = function() {
  let image = document.getElementById('img-preview');
  let imageEntry = document.getElementById('files');
  let clearButton = document.getElementById('clear-button');

  image.src = 'res/logo.png';
  image.title = 'Photo Preview';
  image.alt = 'Photo Preview';
  imageEntry.value = null;
  clearButton.remove();
};

/**
 * Handle File Select
 * @param event
 *
 * Reads base64 data using the HTML5 File API and renders it in a preview thumbnail.
 * This code is derived from an extremely useful tutorial on HTML5 File APIs by Eric Bidelman
 * I've had to tinker with it a little bit to get it to work with my application of course
 * https://www.html5rocks.com/en/tutorials/file/dndfiles/
 */
const handleFileSelect = function(event) {
  let files = event.target.files; // FileList object

  // Black magic
  for (let i = 0, f; f = files[i]; i++) {
    // Only process image files.
    if (!f.type.match('image.*')) {
      continue;
    }
    let reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        let image = document.getElementById('img-preview');
        image.src = e.target.result;
        image.title = escape(theFile.name);
      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
    clearButton();
  }
};
document.getElementById('files').addEventListener('change', handleFileSelect, false);
