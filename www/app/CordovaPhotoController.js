/** let pictureSource;
 'use strict';
 let destinationSource;

 document.addEventListener("deviceready", onDeviceReady, false);
 function onDeviceReady() {
            pictureSource = navigator.camera.PictureSourceType;
            destinationSource = navigator.camera.DestinationType;
          }

 // Called when photo is successfully retrieved
 function onPhotoDataSuccess(imageData) {
            console.log(imageData);
            let smallImage = document.getElementById('img-preview');
            smallImage.src = `data:image/jpeg;base64,${imageData}`;
          }

 // When photo is successfully retrieved
 function onPhotoURISuccess(imageURI) {
            console.log(imageURI);
            let largeImage = document.getElementById('img-preview');
            largeImage.src = imageURI;
          }

 // A button calls this function
 function capturePhoto() {
            // Take picture and retrieve as base64
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
              quality: 50,
              allowEdit: true,
              destinationType: destinationType.DATA_URL
            });
          }

 // A button calls this function
 function getPhoto(source) {
            // Retrieve image file from specified source
            navigator.camera.getPicture(onPhotoURISuccess, onFail, {
              quality: 50,
              destinationType: destinationType.FILE_URI,
              sourceType: source
            });
          }

 // Called if something goes wrong
 function onFail(message) {
            alert(`Failed because: ${message}`);
          } **/
