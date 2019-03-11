var Conference = Conference || {};

Conference.controller = (function ($, dataContext, document) {
  "use strict";

  let position = null;
  let mapDisplayed = false;
  let currentMapWidth = 0;
  let currentMapHeight = 0;

  const sessionsListSelector = "#entries-list-content";
  const noSessionsCachedMsg = "<div>Your sessions list is empty.</div>";
  const databaseNotInitialisedMsg = "<div>Your browser does not support local databases.</div>";
  const SESSIONS_LIST_PAGE_ID = "entries";
  const MAP_PAGE = "map";

  // This changes the behaviour of the anchor <a> link
  // so that when we click an anchor link we change page without
  // updating the browser's history stack (changeHash: false).
  // We also don't want the usual page transition effect but
  // rather to have no transition (i.e. tabbed behaviour)
  const initialisePage = function(event) {
    change_page_back_history();
  };

  const onPageChange = function(event, data) {
    // Find the id of the page
    let toPageId = data.toPage.attr("id");

    // If we're about to display the map tab (page) then
    // if not already displayed then display, else if
    // displayed and window dimensions changed then redisplay
    // with new dimensions
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
        if (session.photo !== null) {
          session.photo = `<img src="${session.photo}" alt="${session.name}" height="100" width="100">`;
        } else {
          session.photo = `<img src="res/logo.png" alt="No Photo Provided" height="100" width="100">`;
        }
        listItem = `
<li>
  <a class="ui-listview-item- button ui-button" href="#">
    <span class="ui-listview-item-icon ui-icon ui-icon-caret-r ui-widget-icon-floatend"></span>
    ${session.photo}
    <h3>${session.name}</h3>
    <p>${new Date(session.date_of_entry).toLocaleString()}</p>
    <p>${session.notes}</p>
  </a>
</li>`;
        liArray.push(listItem);
      }
      let listItems = liArray.join('');
      $(listItems).appendTo(ul);
      ul.listview();
    }
  };

  const noDataDisplay = function(event, data) {
    let view = $(sessionsListSelector);
    view.empty();
    $(databaseNotInitialisedMsg).appendTo(view);
  };

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

  const deal_with_geolocation = function() {
    var phoneGapApp = (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 );
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
      // Running on a mobile. Will have to add to this list for other mobiles.
      // We need the above because the deviceready event is a phonegap event and
      // if we have access to PhoneGap we want to wait until it is ready before
      // initialising geolocation services
      if (phoneGapApp) {
        //alert('Running as PhoneGapp app');
        document.addEventListener("deviceready", initiate_geolocation, false);
      }
      else {
        initiate_geolocation(); // Directly from the mobile browser
      }
    } else {
      //alert('Running as desktop browser app');
      initiate_geolocation(); // Directly from the browser
    }
  };

  const initiate_geolocation = function() {
    // Do we have built-in support for geolocation (either native browser or phonegap)?
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handle_geolocation_query, handle_errors);
    }
    else {
      // We don't so let's try a polyfill
      yqlgeo.get('visitor', normalize_yql_response);
    }
  };

  const handle_errors = function(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("user did not share geolocation data");
        break;

      case error.POSITION_UNAVAILABLE:
        alert("could not detect current position");
        break;

      case error.TIMEOUT:
        alert("retrieving position timed out");
        break;

      default:
        alert("unknown error");
        break;
    }
  };

  const normalize_yql_response = function(response) {
    if (response.error) {
      var error = { code: 0 };
      handle_errors(error);
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

  const get_map_height = function() {
    return $(window).height() - ($('#maptitle').height() + $('#mapfooter').height());
  };

  const get_map_width = function() {
    return $(window).width();
  };

  const handle_geolocation_query = function(pos) {
    position = pos;

    let the_height = get_map_height();
    let the_width = get_map_width();

    let image_url = 'https://maps.googleapis.com/maps/api/staticmap?center=' + position.coords.latitude + ',' +
      position.coords.longitude + '&zoom=14&size=' +
      the_width + 'x' + the_height + '&markers=color:blue|label:S|' +
      position.coords.latitude + ',' + position.coords.longitude +
      '&key=***REMOVED***';

    $('#map-img').remove();

    jQuery('<img/>', {
      id: 'map-img',
      src: image_url,
      title: 'Google map of my location'
    }).appendTo('#mapPos');

    mapDisplayed = true;
  };

  const init = function() {
    // The pagechange event is fired every time we switch pages or display a page
    // for the first time.
    let d = $(document);
    let databaseInitialised = dataContext.init();
    if (!databaseInitialised) {
      d.on('pagechange', $(document), noDataDisplay);
    }

    // The pagechange event is fired every time we switch pages or display a page
    // for the first time.
    d.on('pagechange', $(document), onPageChange);
    // The pageinit event is fired when jQM loads a new page for the first time into the
    // Document Object Model (DOM). When this happens we want the initialisePage function
    // to be called.
    d.on('pageinit', $(document), initialisePage);
  };


  // Provides an object wrapper for the "public" functions that we return to external code so that they
  // know which functions they can call. In this case just init.
  const pub = {
    init: init
  };

  return pub;
}(jQuery, Conference.dataContext, document));

// Called when jQuery Mobile is loaded and ready to use.
$(document).on('mobileinit', $(document), function () {
  Conference.controller.init();
});
