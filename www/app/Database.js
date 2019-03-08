document.addEventListener("DOMContentLoaded", function(event) {
  'use strict';
  const DATABASE_NAME = 'tourist_db';
  const DATABASE_DISPLAY_NAME = 'Tourist WebSQL';
  const DATABASE_SIZE = 200000;

  let database = null;
  let oldDatabaseVersion = '0';
  let databaseVersion = '1.0';

  const populate = function(transaction)
  {
    const statement = ''
    transaction.executeSql(statement);
  };

  const transactionError = function(err)
  {
    console.error(`Database error ${err}.`);
  };

  const transactionSuccess = function(transaction, results)
  {
    console.log(`Inserted ID = ${results.insertId}.`);
  };

  const init = function()
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
      database.transaction(populate, transactionError, transactionSuccess)
    } else if (database.version === oldDatabaseVersion) {
      // TODO: Upgrade database
    } else if (database.version !== databaseVersion) {
      // TODO: Handle database problems
      alert('Database inconsistency.');
      return false;
    }
    return true;
  };

  init();
});
