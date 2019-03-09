document.addEventListener("DOMContentLoaded", function(event) {
  'use strict';
  let position = null;
  let mapDisplayed = false;
  let currentMapWidth = 0;
  let currentMapHeight = 0;
  let locationsListSelector = '#sessions-list-content';
  let noLocationsCachedMsg = `<div>Your locations list is empty.</div>`;
  let databaseNotInitialisedMsg = `<div>Your browser does not support local databases.`;

  const LOCATIONS_LIST_PAGE_ID = 'entries';
  const MAP_PAGE = 'map';

  const getMapHeight = function()
  {
    return (window.innerHeight - document.getElementById('')
  };

  /**
   * Changes anchor behaviour
   */
  const initialisePage = function(event) 
  {
    changePageBackHistory();
  };

  const onPageChange = function(event, data) 
  {
    // Find the ID of the page
    let toPageId = data.toPage.attr('id');

    /**
     * If we're about to display the map tab and it's not already displayed then display
     * else if displayed and window has changed then redisplay with new dimensions
     */
    switch(toPageId) {
      case LOCATIONS_LIST_PAGE_ID:
        processLocationsList(renderLocationsList);
        break;
      case MAP_PAGE:
        if (!mapDisplayed || 
          (currentMapWidth !== getMapWidth()) || 
          (currentMapHeight !== getMapHeight())) {
          dealWithGeolocation();
        }
        break;
    }
  };


});