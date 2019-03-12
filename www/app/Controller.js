var Conference = Conference || {};

Conference.controller = (function ($, dataContext, document) {
  "use strict";
  /**
   * Controller.js
   * @author Oliver Earl <ole4@aber.ac.uk>
   *
   * Main controller for the application that handles functions ranging from behaviour triggered by
   * changing pages, to rendering database-retrieved data, to rendering the map page and building up
   * the map and its token.
   */

  let position = null;
  let mapDisplayed = false;
  let currentMapWidth = 0;
  let currentMapHeight = 0;

  const sessionsListSelector = '#entries-list-content';
  const noSessionsCachedMsg = `<div>Your sessions list is empty.</div>`;
  const databaseNotInitialisedMsg = `<div>Your browser does not support local databases.</div>`;
  const SESSIONS_LIST_PAGE_ID = 'entries';
  const MAP_PAGE = 'map';
  const API_KEY = '***REMOVED***';

  /**
   * Initialise Page
   * @param event
   *
   * Triggers the Change Page Back History function to handle browser navigation.
   */
  const initialisePage = function(event) {
    change_page_back_history();
  };

  /**
   * On Page Change
   * @param event
   * @param data
   *
   * Triggers specific behaviours when changing over to specific pages. Such as processing and rendering
   * entries in the database on the entries page, and also handling geolocation and rendering the map
   * when navigating to the map tab. This is especially important to accurately render the map according to the
   * viewport.
   */
  const onPageChange = function(event, data) {
    let toPageId = data.toPage.attr("id");

    switch (toPageId) {
      case SESSIONS_LIST_PAGE_ID:
        dataContext.processSessionsList(renderSessionsList);
        break;
      case MAP_PAGE:
        if (!mapDisplayed || (currentMapWidth !== get_map_width() ||
          currentMapHeight !== get_map_height())) {
          deal_with_geolocation();
        }
        break;
    }
  };

  /**
   * Render Sessions List
   * @param sessionsList
   *
   * So historically named from the previous application that this was built from.
   *
   * Properly renders the List Entries page with data retrieved from the database, as well as the filter form and
   * base64 images, or renders a placeholder image in absence of an image.
   */
  const renderSessionsList = function(sessionsList) {
    let view = $(sessionsListSelector);
    view.empty();

    //console.log(`Sessions length is ${sessionsList.length}`);
    if (sessionsList.length === 0) {
      $(noSessionsCachedMsg).appendTo(view);
    } else {
      let liArray = [];
      let listItem = null;
      let session = null;
      let sessionsCount = sessionsList.length;

      let filterForm = $(`<form class="ui-filterable">`);
      let inputField = $(`<input id="myFilter" data-type="search" placeholder="Filter your entries">`);
      inputField.appendTo(filterForm);
      filterForm.appendTo(view);

      let ul = $(`<ul id="session-list" data-role="listview" data-filter="true" data-input="#myFilter"></ul>`)
        .appendTo(view);
      for (let i = 0; i < sessionsCount; i += 1) {
        session = sessionsList[i];
        if (session.photo !== null || session.photo !== undefined) {
          session.photo = `<img src="${session.photo}" alt="${session.name}" height="100" width="100">`;
        } else {
          session.photo = `<img src="res/logo.png" alt="No Photo Provided" height="100" width="100">`;
        }
        listItem = `
<li>
  <a class="ui-listview-item- button ui-button" href="#details" onclick="fillDetails(${session.id});">
    <span class="ui-listview-item-icon ui-icon ui-icon-caret-r ui-widget-icon-floatend"></span>
    ${session.photo}
    <h3>${session.name}</h3>
    <p>${new Date(session.date_of_entry).toLocaleString()}</p>
  </a>
</li>`;
        liArray.push(listItem);
      }
      let listItems = liArray.join('');
      $(listItems).appendTo(ul);
      ul.listview();
    }
  };

  /**
   * No Data Display
   * @param event
   * @param data
   *
   * If no data is retrieved, or the database is inaccessible, this behaviour determines what is displayed on
   * said page.
   */
  const noDataDisplay = function(event, data) {
    let view = $(sessionsListSelector);
    view.empty();
    $(databaseNotInitialisedMsg).appendTo(view);
  };

  /**
   * Change Page Back History
   *
   * This changes the behaviour of anchor tags so that when we click an anchor link we change the page without
   * updating the browser's history stack. We also don't want the usual page transition behaviour.
   */
  const change_page_back_history = function() {
    $('a[data-role="tab"]').each(function() {
      const anchor = $(this);
      anchor.bind("click", function() {
        $.mobile.changePage(anchor.attr("href"), { // Go to the URL
          transition: "none",
          changeHash: false
        });
        return false;
      });
    });
  };

  /**
   * Deal with Geolocation
   *
   * Activates the correct way of retrieving device geolocation. It determines whether the application is running on
   * a mobile device first, and if that's the case, is it a Cordova application. If running on Cordova, fetch
   * geolocation once its services are available. Otherwise, geolocation services on mobile browsers can be retrieved
   * immediately.
   */
  const deal_with_geolocation = function() {
    let phoneGapApp = (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 );
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
      if (phoneGapApp) {
        document.addEventListener("deviceready", initiate_geolocation, false);
      }
      else {
        // Mobile browsers
        initiate_geolocation();
      }
    } else {
      // Desktop browser
      initiate_geolocation();
    }
  };

  /**
   * Initiate Geolocation
   *
   * Determine whether native geolocation services are available. If they are, use them and callback Handle Geolocation
   * Query. Otherwise, use the yqlgeo polyfill and normalise its response before passing it further on to the same
   * function as the aforementioned.
   */
  const initiate_geolocation = function() {
    if (navigator.geolocation) {
      // Native services
      navigator.geolocation.getCurrentPosition(handle_geolocation_query, handle_errors);
    }
    else {
      // Polyfill
      yqlgeo.get('visitor', normalize_yql_response);
    }
  };

  /**
   * Handle Errro
   * @param error
   *
   * If any errors are passed from either geolocation service, then print said errors to the console.
   */
  const handle_errors = function(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error(`User did not share geolocation data: ${error.code}`);
        break;

      case error.POSITION_UNAVAILABLE:
        console.error(`Could not retrieve user's location: ${error.code}`);
        break;

      case error.TIMEOUT:
        console.error(`Request timeout: ${error.code}`);
        break;

      default:
        console.error(`Unknown error: ${error.code}`);
        break;
    }
  };

  /**
   * Normalise YQL Response
   * @param response
   *
   * The output from the YQL polyfill differs from the native geolocation services. This function
   * will normalise it so that it can be used by the same functions, including error messages.
   */
  const normalize_yql_response = function(response) {
    if (response.error) {
      handle_errors(response.error);
      return;
    }

    position = {
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
    handle_geolocation_query(position);
  };

  /**
   * Get Map Height
   * @returns {number}
   *
   * Calculates what the map height should be.
   */
  const get_map_height = function() {
    return $(window).height() - ($('#maptitle').height() + $('#mapfooter').height());
  };

  /**
   * Get Map Width
   * @returns {number | jQuery}
   *
   * Calculates what the map width should be.
   */
  const get_map_width = function() {
    return $(window).width();
  };

  /**
   * Handle Geolocation Query
   * @param pos
   *
   * This function will take the position object fetched from either native geolocation services or from a polyfill,
   * and then constructs a specific image URL string used by Google Maps Static API, consisting of all the coordinates
   * fetched from the database, and the user's current position.
   *
   * Currently this function is bugged as the coordinates are retrieved from the database, but can't be returned
   * for some reason. It just returns null. So only the user's current position is rendered on the map.
   */
  const handle_geolocation_query = function(pos) {
    position = pos;

    let the_height = get_map_height();
    let the_width = get_map_width();

    // FIXME: coordinates is null and there's nothing much I can do about it
    let coordinates = Conference.dataContext.getCoordinates();
    let markersString = `&markers=color:blue|label:S|${position.coords.latitude},${position.coords.longitude}`;
    if (coordinates) {
      for (let i = 0; i < coordinates.length; i++) {
        markersString += `&markers=color:blue|label:S|${coordinates[i]}`;
      }
    }

    let image_url = `
    https://maps.googleapis.com/maps/api/staticmap?center=${position.coords.latitude},${position.coords.longitude}
    &zoom=14&size=${the_width}x${the_height}${markersString}&key=${API_KEY}`;
    $('#map-img').remove();

    jQuery('<img/>', {
      id: 'map-img',
      src: image_url,
      title: 'Google map of my location'
    }).appendTo('#mapPos');

    document.getElementById('map-error').remove();
    mapDisplayed = true;
  };

  /**
   * Init
   *
   * The bootstrapping function that determines basic behaviours from the application. Predominatly page changing
   * behaviour, initialising the database, and fallback behaviour if it can't be initialised.
   */
  const init = function() {
    let d = $(document);
    let databaseInitialised = dataContext.init();
    if (!databaseInitialised) {
      d.on('pagechange', $(document), noDataDisplay);
    }
    d.on('pagechange', $(document), onPageChange);
    d.on('pageinit', $(document), initialisePage);
  };


  /**
   * Public functions
   *
   * @type {{init: init}}
   */
  const pub = {
    init: init
  };

  return pub;
}(jQuery, Conference.dataContext, document));

$(document).on('mobileinit', $(document), function () {
  Conference.controller.init();
});
