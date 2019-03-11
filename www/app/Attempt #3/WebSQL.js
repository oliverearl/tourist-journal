'use strict';
const DATABASE_NAME = 'test';
const DATABASE_DISPLAY_NAME = 'Tourist WebSQL';
const DATABASE_SIZE = 200000;
const DATABASE_VERSION = '1.0';

let previousDatabase = '0';
let asyncProcessor = null;
let database = null;

function init()
{
  return websqlSetup();
}

function websqlSetup()
{
  console.log('Application INIT.');
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
}

function printEntries()
{
/*  let printingArea = document.getElementById('entries-list-content');
  database.transaction(function (tx) {
    tx.executeSql('SELECT * FROM entries', [], function(tx, results) {
      let len = results.rows.length;
      let msg = `<p>Found results: ${len}</p>`;
      printingArea.innerHTML += msg;

      for (let i = 0; i < len; i++) {
        console.log(results.rows.item(i));
        msg = `<p><strong>${results.rows.item(i)}</strong></p>`;
        printingArea.innerHTML += msg;
      }
    }, websqlError, websqlPrintSuccess);
  }, websqlError, websqlPrintSuccess);*/
}

function processEventsList(processor) {
  asyncProcessor = processor;
  if (database) {
    database.transaction(queryEntries, websqlError);
  }
}

function queryEntries(tx) {
  tx.executeSql("SELECT * FROM events ORDER BY events.date_of_entry ASC", [], websqlPrintSuccess, websqlError);
}

function websqlPopulate(tx)
{
  console.log('Populating database.');
  tx.executeSql('CREATE TABLE entries (id INTEGER CONSTRAINT entries_pk PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, notes TEXT, photo BLOB, date_of_entry DATETIME NOT NULL, location DECIMAL NOT NULL);', [], databasePopulateSuccess, databaseError);
  //tx.executeSql('CREATE UNIQUE INDEX entries_id_uindex ON entries (id);', [], databasePopulateSuccess, databaseError);
  tx.executeSql("INSERT INTO \"entries\" (\"id\",\"name\", \"notes\", \"photo\", \"date_of_entry\", \"location\") VALUES (null, 'This is a sample entry.', 'This is a sample description.', null, '2019-01-01 14:56:54.919', '(52.415303,-4.082920)')");
}

function websqlPopulateSuccess(tx, results)
{
  console.log(`Created table: ${results}`);
}

function websqlDropSuccess(tx, results)
{
  console.log(`Dropped table: ${results}`);
}

function websqlPrintSuccess(tx, results)
{
  console.log(`Printed to DOM: ${results}`);
}

function websqlError(err)
{
  console.error(`Error: ${err}`);
  console.log("Error : " + err.message + " in ");
}

function websqlDropTables()
{
  database.transaction(function (tx) {
    tx.executeSql('IF EXISTS (DROP TABLE entries)');
  }, websqlError, websqlDropSuccess);
}

