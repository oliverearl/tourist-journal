var TouristApp = TouristApp || {};

TouristApp.controller = (function ($, document) {
  const DATABASE_NAME = 'test';
  const DATABASE_DISPLAY_NAME = 'Tourist WebSQL';
  const DATABASE_SIZE = 200000;
  const DATABASE_VERSION = '1.0';

  let previousDatabase = '0';
  let asyncProcessor = null;
  let database = null;

  var init = function() {
    return websqlSetup();
  };

  var websqlSetup = function() {
    console.log('Database INIT');
    if (window.openDatabase) {
      database = openDatabase(DATABASE_NAME, '', DATABASE_DISPLAY_NAME, DATABASE_SIZE);
      // Populate
      if (database.version.length === 0 || database.version !== DATABASE_VERSION) {
        database.changeVersion(previousDatabase, DATABASE_VERSION);
        websqlDropTables();
        database.transaction(websqlPopulate, websqlError, websqlPopulateSuccess);

      } else if (database.version === previousDatabase) {
        // Upgrade
      }
      return true;
    }
  };

  var websqlPopulate = function(tx) {
    console.log('Populating database.');
    tx.executeSql('CREATE TABLE entries (id INTEGER CONSTRAINT entries_pk PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, notes TEXT, photo BLOB, date_of_entry DATETIME NOT NULL, location DECIMAL NOT NULL);', [], databasePopulateSuccess, databaseError);
    //tx.executeSql('CREATE UNIQUE INDEX entries_id_uindex ON entries (id);', [], databasePopulateSuccess, databaseError);
    tx.executeSql("INSERT INTO \"entries\" (\"id\",\"name\", \"notes\", \"photo\", \"date_of_entry\", \"location\") VALUES (null, 'This is a sample entry.', 'This is a sample description.', null, '2019-01-01 14:56:54.919', '(52.415303,-4.082920)')");
  };

  var websqlPopulateSuccess = function(tx, results) {
    console.log(`Created table: ${results}`);
  };

  var websqlDropSuccess = function(tx, results) {
    console.log(`Dropped table: ${results}`);
  };

  var websqlPrintSuccess = function(tx, results) {
    console.log(`Printed to DOM: ${results}`);
  };

  var websqlError = function(err) {
    console.error(`Error: ${err} and ${err.message}`);
  };

  var websqlDropTables = function() {
    database.transaction(function (tx) {
      tx.executeSql('IF EXISTS (DROP TABLE entries)');
    }, websqlError, websqlDropSuccess);
  };

  var queryEntriesSuccess = function(tx, results) {
    let list = [];
    for (let i = 0; i < results.rows.length; i++) {
      list[i] = results.rows.item(i);
    }
    asyncProcessor(list);
  };

  var queryEntries = function(tx) {
    tx.executeSql("SELECT * FROM events ORDER BY events.date_of_entry ASC", [], websqlPrintSuccess, websqlError);
  };

  var processEntriesList = function(cpu) {
    processor = cpu;
    if (database) {
      database.transaction(queryEntries, websqlError)
    }
  };

  var pub = {
    init:init,
    processEntriesList:processEntriesList
  };
}(jQuery));
