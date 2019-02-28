export abstract class databaseTemplate {
  db: any;
  constructor() {};
  abstract insert(columns, values, table);
  abstract selectAll(table?: string);
  close() {
    this.db.close();
  };
}
