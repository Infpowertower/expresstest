import { databaseTemplate } from './database.js';
const sqlite3 = require('sqlite3').verbose();
import mkdirp = require('mkdirp');

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
  private checkDB() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT name FROM sqlite_master WHERE type="table";', (error: any, rows: { name: string; }[]) => {
        if (error) {
          console.error(error);
          reject()}
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
          console.log(rows);
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
        /*let placeholder = values.map((value) => {
          return '('+columns.map(column => {return '?'}).join(',')+')';
        }).join(',');*/
        let placeholder = columns.map((_column: any) => {return '?'}).join(',');
        console.log(placeholder);
        const statement = this.db.prepare(`INSERT INTO ${table} (${columnStr}) VALUES (${placeholder})`);
        for (let i = 0; i < values.length; i++) {
          statement.run(values[i]);
        }
        console.log(statement);
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

const db = new database();
Promise.all([
  db.selectAll('test'),
  db.selectAll('user').then((output) => console.log(output)),
])
.catch((error) => {
  console.error(error);
})
.finally(() => {
  db.close();
})
