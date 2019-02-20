import { databaseTemplate } from './database.js';
const sqlite3 = require('sqlite3').verbose();
const mkdirp = require('mkdirp');

export class database extends databaseTemplate {
  constructor() {
    super();
    mkdirp('./db', (error) => {
      if (error) console.error(error)
    })
    this.db = new sqlite3.Database('./db/test.db');
    if (!this.checkDB()) {
      this.initialize();
    }
  }
  private checkDB(): Boolean {
    return this.db.all('SELECT name FROM sqlite_master WHERE type="table";', (error, rows) => {
      if (error) {
        console.error(error);
        return false}
      else {
        let user = false;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].name === 'user') {
            user = true;
          }
        }
        if (user) return true;
        return false;
      }
    });
  }

  initialize() {
    this.db.run('CREATE TABLE user (name TEXT password TEXT);', runCallback);
    console.log("Database initialized!")
  }

  insert(columns, values, table) {
      return this.db.run('INSERT INTO ? (?) VALUES (?);', table, columns, values, runCallback);
  };

  selectAll() {
    this.db.run('SELECT * from test');
  }
}

function runCallback(error): Boolean {
  if (error) {
    console.error(error);
    return false;
  }
  else {
    return true;
  }
}

function getCallback(error, row) {
  if (error) console.error(error)
  else console.log(row)
}

function allCallback(error, rows) {
  if (error) console.error(error)
  else console.log(rows)
}

const db = new database();
