export abstract class databaseTemplate {
  db: any;
  constructor() {};
  abstract insert(columns, values, table): Boolean;
  abstract selectAll();
  close() {
    this.db.close();
  };
}
