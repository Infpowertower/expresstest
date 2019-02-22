const pgp = require('pg-promise')();
import { databaseTemplate } from './database.js';

const con_obj = {
    host: 'localhost',
    port: 5432,
    database: 'finanzreport',
    user: 'finanzreport',
    password: 'finanzreport',
}

export class Database extends databaseTemplate {
    constructor() {
      super();
      this.db = pgp(con_obj);
    }
    insert(value, date, category, medium) {
        this.db.any(`INSERT INTO test_data(value, date, category, medium) VALUES ('${value}', '${date}', '${category}', '${medium}')`)
            .catch((error) => {
                console.error(error);
            })
    }
    selectAll() {
        this.db.any('SELECT * from test_data')
            .then((data) => {
                console.log('DATA:', data);
            })
            .catch((error) => {
                console.error(error);
            })
    }
    close() {
        this.db.close();
    }
}

const db = new Database();
//db.insert(13, "2019-02-01", "testing", "bank");
db.selectAll();
