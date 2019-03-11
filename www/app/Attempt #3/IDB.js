/**
 * IndexedDB Prefixes for compatibility
 */
window.indexedDB = window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction;

window.IDBKeyRange = window.IDBKeyRange ||
  window.webkitIDBKeyrange ||
  window.msIDBKeyrange;

if (!window.indexedDB) {
  // No IndexedDB Support. Fall back to WebSQL?
  console.error('IndexedDB Support not here. Falling back to WebSQL.');
}

// Database
let idb;
let request = window.indexedDB.open('TestDatabase');

// Request handlers
request.onerror = function(event) {
  idb = event.target.result;
};

request.onsuccess = function(event) {

};


const tempData = {
  id: '01', name: 'This place', description: 'Description of said place', date_of_entry: '2019-01-01 00-00'
};

function addToIDB()
{
  //
}