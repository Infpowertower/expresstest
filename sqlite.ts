import { databaseTemplate } from './database.js';
const sqlite3 = require('sqlite3').verbose();
import * as mkdirp from 'mkdirp';

export class Database extends databaseTemplate {
  constructor() {
    super();
    mkdirp('./db', (error) => {
      if (error) console.error(error)
    })
    this.db = new sqlite3.Database('./db/test.db');
    if (!this.checkDB().catch((error) => console.error(error))) {
      this.initialize();
    }
  }
  private checkDB() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT name FROM sqlite_master WHERE type="table";', (error: any, rows: { name: string; }[]) => {
        if (error) {
          reject(error)}
        else {
          let user = false;
          for (let i = 0; i < rows.length; i++) {
            if (rows[i].name === 'user') {
              user = true;
            }
          }
          if (user) resolve(true);
          resolve(false);
        }
      })
    })
  }

  showTables(verbose = false) {
    return new Promise((resolve, reject) => {
      let select: string;
      if (verbose) select = '*'
      else select = 'name';
      this.db.all(`SELECT ${select} FROM sqlite_master WHERE type="table";`, (error: any, rows: {} | PromiseLike<{}>) => {
        if (error) reject(error);
        else {
          resolve(rows);
        }
      })
    })
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this.db.run('CREATE TABLE user (name TEXT, password TEXT);', (error: any) => {
        if (error) reject(error);
        else {
          console.log("Database initialized!");
          resolve();
        }
      });
    })
  }

  insert(table: string, columns: { toString: () => void; map: (arg0: (_column: any) => string) => { join: (arg0: string) => void; }; }, values: any[]) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        let columnStr = columns.toString();
        let placeholder = columns.map((_column: any) => {return '?'}).join(',');
        const statement = this.db.prepare(`INSERT INTO ${table} (${columnStr}) VALUES (${placeholder})`);
        for (let i = 0; i < values.length; i++) {
          statement.run(values[i]);
        }
        try {
          statement.finalize();
          resolve();
        }
        catch (error) {
          console.error(error);
          reject(error);
        }
      })
    });
  };

  get(table: string, column: string, condition: string) {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT ${column} FROM ${table} WHERE ${condition}`, (error, row) => {
        if (error) reject(error)
        else {
          resolve(row)
        };
      })
    })
  }

  delete() {

  }

  selectAll(table: string) {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM ${table};`, (error: any, rows: {} | PromiseLike<{}>) => {
        if (error) reject(error)
        else resolve(rows);
      });
    })
  }

  dropTable(table: string) {
    return new Promise((resolve, reject) => {
      this.db.run(`DROP TABLE ${table};`, (error: any) => {
        if (error) reject(error);
        else {
          console.log(`Table ${table} dropped.`);
          resolve();
        }
      })
    })

  }
}

function test() {
  const db = new Database();
  //db.selectAll('user').then((output) => console.log(output))
  db.dropTable('user')
  .then(() => db.initialize())
  .then(() => {
    db.close();
  })
  .catch((error) => {
    console.error(error);
    db.initialize().catch((error) => console.error(error));
  })
}

//test();
