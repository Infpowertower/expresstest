const pgp = require('pg-promise')();

const con_obj = {
    host: 'localhost',
    port: 5432,
    database: 'finanzreport',
    user: 'finanzreport',
    password: 'finanzreport',
}

export class database {
    private db: any;
    constructor() {
        this.db = pgp(con_obj);
    }
    insert(value, date, category, medium) {
        this.db.any(`INSERT INTO test_data(value, date, category, medium) VALUES (${value}, ${date}, ${category}, ${medium})`)
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