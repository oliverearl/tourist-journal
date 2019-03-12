"use strict";
/**
 * Handle Geolocation
 *
 * I hate that there's code reusage here, but I was hesitant to touch any of the existing codebase.
 *
 * This is called when the checkbox for the geolocation is ticked and retrieves the user's geolocation either
 * using native geolocation services, or using a polyfill.
 */
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

/**
 * Assign Location
 * @param position
 *
 * Once the data is retrieved from Handle Geolocation, this function assigns it to a hidden form value.
 */
const assignLocation = function(position) {
  let geolocation = document.getElementById('entry-geolocation');
  geolocation.value = null;
  if (position) {
    geolocation.value = position;
  }
};
