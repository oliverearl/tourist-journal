/* eslint-disable no-console */
"use strict";
/* Globals and Constants */
const DATABASE_NAME = 'tourist_db';
const DATABASE_DISPLAY_NAME = 'Tourist WebSQL';
const DATABASE_SIZE = 200000;

class Database
{
    constructor()
    {
        this.database = null;
        this.processor = null;
        this.oldDatabaseVersion = '0';
        this.databaseVersion = '1.0';
    }

    initialiseDatabase()
    {
        if (typeof window.openDatabase === 'undefined') {
            return false;
        }
        // Add in constant information and build database
        this.database = window.openDatabase(
            DATABASE_NAME,
            '',
            DATABASE_DISPLAY_NAME,
            DATABASE_SIZE
        );
        
        // Empty? Populate
        if (this.database.version.length === 0) {
            this.database.changeVersion('', this.databaseVersion);
            this.database.transaction(this.populate, this.transactionError, this.transactionSuccess);
        } else if (this.database.version === this.oldDatabaseVersion) {
            // TODO: Upgrade database
        } else if (this.database.version !== this.databaseVersion) {
            // TODO: Handle database problems
            alert('Database inconsistency.');
            return false;
        }
        return true;
    }

    transactionError(err)
    {
        console.error(`Database error: ${err}.`);
    }

    transactionSuccess(transaction, results)
    {
        console.log(`Inserted ID: ${results.insertId}.`);
    }

    populate(transaction)
    {
        let statement = `create table table_name
        (
            id integer
                constraint table_name_pk
                    primary key autoincrement,
            name text not null,
            notes text,
            photo blob,
            date_of_entry datetime not null,
            location decimal not null
        );
        
        create unique index table_name_id_uindex
            on table_name (id);
        
        `;
        transaction.executeSql(statement);
    }

    queryListSuccess(transaction, results)
    {
        let list = [];
        for (let i = 0; i < results.rows.length; i++) {
            list[i] = results.rows.item(i);
        }
        // After asynchronously obtaining data, call the processor provided by the caller
        this.processor(list);
    }

    queryEntries(transaction)
    {
        transaction.executeSql("SELECT * FROM locations WHERE locations.id = '1' ORDER BY locations.date_of_entry ASC",
        [],
        this.queryListSuccess,
        this.transactionError);
    }

    processEntriesList(cpu)
    {
        this.processor = cpu;
        if (this.database) {
            this.database(this.queryEntries, this.transactionError);
        }
    }
}
//alert('This works!' + database.version + ' ' + `Template literals work too!`);
