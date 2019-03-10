/* eslint-disable no-console */
var TouristApp = TouristApp || {};

TouristApp.controller = (function ($, database, document) {
    'use strict';

    let position = null;
    let mapDisplayed = false;
    let currentMapWidth = 0;
    let currentMapHeight = 0;
    let entriesListSelector = '#sessions-list-content';
    let noEntriesCachedMsg = `<div>Your entries list is empty.</div>`;
    let databaseNotInitialisedMsg = `<div>Your browser does not support WebSQL.</div>`;

    const TECHNICAL_SESSION = 'Technical';
    const ENTRIES_LIST_PAGE_ID = 'entries';
    const MAP_PAGE = 'map';

    let initialisePage = function(event)
    {
        changePageBackHistory();
    };

    let onPageChange = function(event, data)
    {
        let toPageId = data.toPage.attr('id');

        switch (toPageId) {
            case ENTRIES_LIST_PAGE_ID:
                database.processEntriesList(renderEntriesList);
                break;
            case MAP_PAGE:
                if (!mapDisplayed || (currentMapWidth !== getMapWidth()) ||
                (currentMapHeight !== getMapHeight())) {
                    dealWithGeolocation();
                }
                break;
        }
    };

    let renderEntriesList = function(entriesList) {
        let view = $(entriesListSelector);
        view.empty();

        if (entriesList.length === 0) {
            $(noEntriesCachedMsg).appendTo(view);
        } else {
            let liArray = [];
            let listItem;
            let entry;
            
            let filterForm = `<form class="ui-filterable">`;
            let inputField = `<input id="myFilter" data-type="search" placeholder="Search"`;
            inputField.appendTo(filterForm);
            filterForm.appendTo(view);

            let ul = `<ul id="session-list" data-role="listview" data-filter="true" data-input="#myFilter"></ul>`.appendTo(view);

            for (let i = 0; i < entriesList.length; i += 1) {
                listItem = `<li>`;
                entry = entriesList[i];

                liArray.push(listItem
                    + `<span class="session-list-item">`
                    + `<h3>${entry.name}</h3>`
                    + `<div>`
                    + `<h6>${entry.notes}</h6>`
                    + `</div>`
                    + `</span>`
                    + `</li>`
                    );
            }

            let listItems = liArray.join("");
            $(listItems.appendTo(ul));
            ul.listview();
        }
    };
    
    let noDataDisplay = function(event, data)
    {
        let view = $(entriesListSelector);
        view.empty();
        $(databaseNotInitialisedMsg).appendTo(view);
    };

    let changePageBackHistory = function()
    {
        $('a[data-role="tab"]').each(function() {
            let anchor = $(this);
            anchor.bind('click', function() {
                $.mobile.changePage(anchor.attr('href', {
                    transition: 'none',
                    changeHash: false
                }));
                return false;
            });
        });
    };

    let dealWithGeolocation = function()
    {
        let phoneGapApp = (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 );
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            if (phoneGapApp) {
                document.addEventListener("deviceready", initiateGeolocation, false);
            } else {
                initialiseGeolocation();
            }
        } else {
            initialiseGeolocation();
        }
    };

    let initialiseGeolocation = function()
    {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handleGeolocationQuery, handleErrors);
        } else {
            yqlgeo.get('visitor', normalizeYQLResponse);
        }
    };

    let handleErrors = function(error)
    {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert('User did not share geolocation data.');
                break;
            case error.POSITION_UNAVAILABLE:
                alert('Could not detect current position.');
                break;
            case error.TIMEOUT:
                alert('Could not detect current position.');
                break;
            default:
                alert('Unknown error.');
                break;
        }
    };

    let normalizeYQLResponse = function(response)
    {
        if (response.error) {
            let error = { code: 0 };
            handleErrors(error);
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
        handleGeolocationQuery(position);
    };

    let getMapHeight = function()
    {
        return $(window).height() - ($('#maptitle').height() + $('#mapfooter').height());
    };

    let getMapWidth = function()
    {
        return $(window).width(); 
    };

    let handleGeolocationQuery = function(pos)
    {
        position = pos;
        let mapHeight = getMapHeight();
        let mapWidth = getMapWidth();
        let imageURL = `https://maps.googleapis.com/maps/api/staticmap?center=${position.coords.latitude},${position.coords.longitude}&zoom=14&size=${mapWidth}x${mapHeight}&markers=color:blue|label:S|${position.coords.latitude},${position.coords.longitude}&key=***REMOVED***`;
        $('#map-img').remove();

        jQuery('<img/>', {
            id: 'map-img',
            src: imageURL,
            title: 'Google map of the location'
        }).appendTo('#mapPos');

        mapDisplayed = true;
    };

    let init = function()
    {
        let d = $(document);
        let databaseInitialised = database.init();
        if (!databaseInitialised) {
            d.on('pagechange', $(document), noDataDisplay);
        }
        d.on('pagechange', $(document), onPageChange);
        d.on('pageinit', $(document), initialisePage);
    };

    let pub = {
        init: init
    };

    return pub;
}(jQuery, TouristApp.database, document));

// Called when jQuery Mobile is loaded and ready to use.
$(document).on('mobileinit', $(document), function () {
    TouristApp.controller.init();
});