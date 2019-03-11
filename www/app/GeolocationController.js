"use strict";
const handleGeolocation = function() {
  let toggle = document.getElementById('entry-geolocation-toggle');
  if (toggle.value) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(assignLocation, console.error);
    } else {
      yqlgeo.get('visitor', function(response) {
        if (response.error) {
          console.error(response.error);
          return;
        }
        let position = {
          coords: {
            latitude: response.place.centroid.latitude,
            longitude: response.place.centroid.longitude
          },
          address: {
            city: response.place.locality2.content,
            region: response.place.admin1.content,
            country: response.place.country.content
          }
        };
        assignLocation(position);
      });
    }
  }
};

const assignLocation = function(position) {
  let geolocation = document.getElementById('entry-geolocation');
  geolocation.value = null;
  if (position) {
    geolocation.value = position;
  }
};
