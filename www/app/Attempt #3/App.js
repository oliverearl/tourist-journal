var TouristApp = TouristApp || {};

TouristApp.controller = (function ($, database, document) {
  'use strict';
  const PRINTING_AREA = '#entries-list-content';
  const ENTRIES_PAGE = 'entries';
  const MAP_PAGE = 'map';

  const DATABASE_NOT_INITIALIZED = `<div>Your browser does not support WebSQL.</div>`;
  const NO_ENTRIES_CACHED = `<div>No entries are currently in the database. Why not add one?</div>`;

  var initialisePage = function (event) {
    changePageBackHistory();
  };

  var onPageChange = function(event, data) {
    let toPageId = data.toPage.attr('id');
    switch(toPageId) {
      case ENTRIES_PAGE:
        database.processEventsList(renderEventsList);
        break;
      case MAP_PAGE:
        // TODO: Map
        break;
    }
  };

  var noDataDisplay = function(event, data) {
    let printingArea = $(PRINTING_AREA);
    printingArea.empty();
    $(DATABASE_NOT_INITIALIZED).appendTo(printingArea);
  };

  var changePageBackHistory = function() {
    $('a[data-role="tab"]').each(function() {
      let anchor = $(this);
      anchor.bind('click', function() {
        $.mobile.changePage(anchor.attr("href"), {
          transition: 'none',
          changeHash: false
        });
        return false;
      });
    });
  };

  var renderEventsList = function(entriesList) {
    console.log(entriesList);
    let printingArea = $(PRINTING_AREA);
    printingArea.empty();

    if (entriesList.length === 0) {
      $(NO_ENTRIES_CACHED).appendTo(printingArea);
    } else {
      let listArray = [];
      let listItem;

      /*
      Build up a list
       */
      let filterForm = $(`<form class="ui-filterable">`);
      let inputField = $(`<input id="myFilter" data-type="search" placeholder="Filter entries">`);
      inputField.appendTo(filterForm);
      filterForm.appendTo(printingArea);

      let ul = $(`<ul id="event-list" data-role="listview" data-filter="true" data-input="#myFilter"></ul>`);
      let event = null;
      for (let i = 0; i < entriesList.length; i += 1) {
        event = entriesList[i];

        listItem = `<li><span class="session-list item entry-list-item"><h3>entry.name</h3><div><h6>entry.description</h6></div><div><h6>entry.date_of_entry</h6></div></span></li>`;
        listArray.push(listItem);
      }
      let listItems = listArray.join('');
      $(listItems).appendTo(ul);
      ul.listview();
    }
  };

  var init = function() {
    let document = $(document);
    let databaseInitialised = database.init();
    if (!databaseInitialised) {
      document.on('pagechange', $(document), noDataDisplay);
    }

    document.on('pagechange', $(document), onPageChange);
    document.on('pageinit', $(document), initialisePage);
  };

  return {init: init};
}(jQuery, TouristApp.Database, document));

$(document).on('mobileinit', $(document), function() {
  TouristApp.controller.init();
});
