﻿var Conference = Conference || {};

Conference.dataContext = (function ($) {
  "use strict";
  /**
   * DataContext.js
   * @author Oliver Earl <ole4@aber.ac.uk>
   *
   * Database layer that is responsible for all WebSQL functionality.
   */

  let db = null;
  let processorFunc = null;

  const DATABASE_NAME = 'tourist_websql';
  const DATABASE_DISPLAY_NAME = 'Tourist WebSQL';
  const OLD_DATABASE_VERSION = "0";
  const DATABASE_VERSION = "1.0";
  const DATABASE_SIZE = 200000;

  /**
   * Populate DB
   * @param tx
   *
   * Populates the WebSQL database with some initial data to work with.
   * The base64 image is of Ricardo Milos. A Brazillian model, and memelord.
   */
  const populateDB = function(tx) {
    console.log('Populating database.');
    tx.executeSql('CREATE TABLE entries (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, notes TEXT, photo BLOB, date_of_entry DATETIME NOT NULL, location DECIMAL NOT NULL);', [], createSuccess, errorDB);
    for (let i = 0; i < 2; i++) {
      tx.executeSql("INSERT INTO \"entries\" (\"id\",\"name\", \"notes\", \"photo\", \"date_of_entry\", \"location\") VALUES (?, ?, ?, ?, ?, ?)",
        [null, 'This is a sample entry.', 'This is a sample description.',
          'data:image/jpeg;base64,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',
          Date.now(), createRandomCoordinates()], insertSuccess, errorDB);
    }
  };

  /**
   * Create Random Coordinates
   * @returns {string}
   *
   * Returns a pair of randomly (but semantically accurate) coordinates wrapped in parenthesis. I thought it would
   * be more fun to include some coordinates to render on the map instead of dealing with lots of null values.
   */
  const createRandomCoordinates = function() {
    // https://stackoverflow.com/questions/6878761/javascript-how-to-create-random-longitude-and-latitudes
    let latitude = Math.round((Math.random() * 180 - 90) * 1000) / 1000;
    let longitude = Math.round((Math.random() * 360 - 180) * 1000) / 1000; // you could just divide it by two
    return `(${latitude}, ${longitude})`;
  };

  /**
   * Create Success
   * @param tx
   * @param results
   *
   * Database table success.
   */
  const createSuccess = function (tx, results) {
    console.log(`Created table: ${results.name}`)
  };

  /**
   * Insert Success
   * @param tx
   * @param results
   *
   * Data inserted into the database successfully.
   */
  const insertSuccess = function (tx, results) {
    console.log(`Inserted ID: ${results.insertId}`);
  };

  /**
   * Success Populate
   * @param tx
   * @param results
   *
   * Database initialised and populated successfully.
   */
  const successPopulate = function (tx, results) {
    console.log(`Success: ${results}`)
  };

  /**
   * Retrieve Success
   * @param tx
   * @param results
   *
   * Used to indicate data being successfully retrieved from database.
   */
  const retrieveSuccess = function (tx, results) {
    console.log(`Successfully retrieved: ${results}`)
  };

  /**
   * Error DB
   * @param err
   *
   * Prints out database errors to the console.
   */
  const errorDB = function (err) {
    console.error(`Error processing SQL: ${err.message}`);
  };

  /**
   * Initialise Database
   * @returns {boolean}
   *
   * Sets up the WebSQL database.
   */
  const initialise_database = function() {
    if (typeof window.openDatabase === 'undefined') {
      return false;
    }
    db = window.openDatabase(DATABASE_NAME, '', DATABASE_DISPLAY_NAME, DATABASE_SIZE);
    if (db.version.length === 0) {
      db.changeVersion('', DATABASE_VERSION);
      db.transaction(populateDB, errorDB, successPopulate);
    } else if (db.version === OLD_DATABASE_VERSION) {
      // Database upgrade
      console.error('Database upgrade needed?');
      return false;
    } else if (db.version !== DATABASE_VERSION) {
      // Database failure
      console.error('Database failure?');
      return false;
    }
    return true;
  };

  /**
   * Init
   * @returns {boolean}
   *
   * Starts up the Data Context file and initialises the database.
   */
  const init = function () {
    return initialise_database();
  };

  /**
   * Query List Success
   * @param tx
   * @param results
   *
   * Constructs an array of results and hands them to the processor.
   * I honestly have no idea how that works. Magic.
   */
  const queryListSuccess = function (tx, results) {
    let list = [];
    for (let i = 0; i < results.rows.length; i++) {
      list[i] = results.rows.item(i);
    }
    // After asynchronously obtaining the data we call the processor provided
    // by the caller, e.g. it could be a UI renderer
    processorFunc(list);
  };


  /**
   * Query Sessions
   * @param tx
   *
   * Historically named. Fetches all of the data to be rendered on the List Entries tab.
   */
  const querySessions = function (tx) {
    tx.executeSql("SELECT * FROM entries ORDER BY entries.date_of_entry ASC",
      [], queryListSuccess, errorDB);
  };

  /**
   * Process Sessions List
   * @param processor
   *
   * Historically named. Starts the transaction for retrieving all the data from the database.
   */
  const processSessionsList = function (processor) {
    processorFunc = processor;
    if (db) {
      db.transaction(querySessions, errorDB);
    }
  };

  /**
   * Insert Database
   * @param form
   * @returns {boolean}
   *
   * Used to enter data into the database when passed from Add Entry.
   */
  const insertDatabase = function(form) {
    // Validation has already been done, so let's grab the data we need from the form
    // Check if the object is empty, for whatever reason
    if (Object.entries(form).length === 0 && form.constructor === Object) {
      errorDB('Form has failed internal validation and cannot be entered');
      return false;
    }

    if (form.geolocation === null || form.geolocation === 'null') {
      form.geolocation = createRandomCoordinates();
    }
    //let currentLocation = '(52.415303, -4.082920)'; //

    db.transaction(function (tx) {
      tx.executeSql('INSERT INTO entries (id, name, notes, photo, date_of_entry, location) VALUES (?, ?, ?, ?, ?, ?)',
        [null, form.name, form.notes, form.image, Date.now(), form.geolocation], createSuccess, errorDB);
    }, errorDB, insertSuccess);
    return true;
  };

  /**
   * Get Coordinates
   * @returns {Array}
   *
   * Constructs an array of coordinates to be used by the map pins and returns it.
   */
  const getCoordinates = function() {
    let data = [];
    let strippedResult;
    if (db) {
      db.transaction(function (tx) {
        tx.executeSql('SELECT location FROM entries', [], function(tx, results) {
          for (let i = 0; i < results.rows.length; i++) {
            strippedResult = results.rows.item(i).location.replace(/[\])}[{(]/g, '');
            if (strippedResult) {
              data.push(strippedResult);
            }
          }
        }, errorDB, retrieveSuccess());
      }, errorDB)
    }
    return data;
  };

  /**
   * Get Entry
   * @param id
   * @returns {null}
   *
   * I don't like that this function directly manipulates the DOM but I couldn't get it working any other way.
   * This builds the details page when you select a specific entry.
   */
  const getEntry = function(id) {
    if (id && db) {
      db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM entries WHERE entries.id = ?",
          [id], function(tx, results) {
            let name = document.getElementById('details-name');
            let notes = document.getElementById('details-notes');
            let image = document.getElementById('details-img');
            let date = document.getElementById('details-date_of_entry');
            let geolocation = document.getElementById('details-geolocation');
            let data = results.rows.item(0);

            name.innerText = data.name;
            notes.innerText = data.notes;
            image.src = data.photo;
            image.alt = data.name;
            image.title = data.name;
            date.innerText = new Date(data.date_of_entry).toLocaleString();
            geolocation.innerText = data.location;
          }, errorDB);
      }, errorDB);
    }
    return null;
  };

  /**
   * Public functions.
   * @type {{init: (function(): boolean), processSessionsList: processSessionsList,
   * insertDatabase: insertDatabase, getEntry: (function(*=): null), getCoordinates: (function(): Array)}}
   */
  const pub = {
    init:init,
    insertDatabase:insertDatabase,
    getEntry:getEntry,
    getCoordinates:getCoordinates,
    processSessionsList:processSessionsList
  };

  return pub;
}(jQuery));
