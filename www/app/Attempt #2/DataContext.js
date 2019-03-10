/* eslint-disable no-console */
var TouristApp = TouristApp || {};

TouristApp.Database = (function($) {
    'use strict';
    const DATABASE_NAME = 'tourist_db2';
    const DATABASE_DISPLAY_NAME = 'Tourist WebSQL';
    const DATABASE_SIZE = 200000;

    let database = null;
    let processor = null;
    let id = null;

    let databaseVersion = '1.0';
    let oldDatabaseVersion = '0';

    let populate = function(transaction)
    {
        let createStatement = 'CREATE TABLE entries (id INTEGER CONSTRAINT entries_pk PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, notes TEXT, photo BLOB, date_of_entry DATETIME NOT NULL, location DECIMAL NOT NULL); CREATE UNIQUE INDEX entries_id_uindex ON entries (id);';
        transaction.executeSql(createStatement, [], createSuccess, databaseError);

    }

    let createSuccess = function(transaction, results)
    {
        console.log('Created table');
    }

    let insertSuccess = function(transaction, results) {
        console.log(`Insert ID = ${results.insertId}`);
    }

    let successPopulate = function()
    {
        //
    }

    let databaseError = function(err)
    {
        console.error(`SQL Error: ${err.code}`);
    }

    let initialiseDatabase = function()
    {
        if (typeof window.openDatabase === 'undefined') {
            return false;
          }
          // Name, version, display name, size
          database = window.openDatabase(
            DATABASE_NAME,
            '',
            DATABASE_DISPLAY_NAME,
            DATABASE_SIZE
          );
        
          // If version is empty, populate the database with some sample data
          if (database.version.length === 0) {
            database.changeVersion("", databaseVersion);
            database.transaction(populate, databaseError, successPopulate)
          } else if (database.version === oldDatabaseVersion) {
            // TODO: Upgrade database
          } else if (database.version !== databaseVersion) {
            // TODO: Handle database problems
            alert('Database inconsistency.');
            return false;
          }
          console.log('Initialised');
          return true;
    }

    let init = function()
    {
        return initialiseDatabase();
    }

    let queryListSuccess = function(transaction, results)
    {
        let list = [];
        for (let i = 0; i < results.rows.length; i++) {
            list[i] = results.rows.item(i);
        }
        processor(list);
    }

    let queryEntries = function(transaction)
    {
        transaction.executeSql("SELECT * FROM entries WHERE entries.id = '1' ORDER BY entries.date_of_entry ASC",
        [], queryListSuccess, databaseError);
    }

    let processEntriesList = function(cpu)
    {
        processor = cpu;
        if (database) {
            database.transaction(queryEntries, databaseError);
        }
    }

    let pub = {
        init:init,
        processEntriesList:processEntriesList
    };

    return pub;
}(jQuery));