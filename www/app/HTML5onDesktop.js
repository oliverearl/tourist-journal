/**
 // Quick fix at removing phone buttons and replacing them with HTML5 API buttons on desktop
 if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) || (document.URL.indexOf('http://') !== -1 && document.URL.indexOf('https://') !== -1 )) {
              document.getElementById('entry-camera').remove();
              document.getElementById('entry-gallery').remove();

              let html5FileUpload = document.createElement('input');
              $(html5FileUpload).attr({
                'id': 'entry-file',
                'name': 'entry-file',
                'type': 'file',
              });
              document.getElementById('camera-control').appendChild(html5FileUpload);
            }
 **/
