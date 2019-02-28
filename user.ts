import argon = require("argon2");
import { Database } from "./sqlite.js";

const TABLE = 'user';

export class User {
  private db;
  constructor(db) {
    this.db = db;
  }

  async create(name, password) {
    try {
      const hash = await argon.hash(password, {type: argon.argon2i});
      return this.db.insert(TABLE, ['name', 'password'], [[name, hash]]);
    }
    catch (error) {
      console.error(error);
    }
  }

  async login(name, password) {
    try {
      const dbData = await this.db.get(TABLE, 'password', `name = "${name}"`);
      const hash = dbData.password;
      if (await argon.verify(hash, password)) {
        return true;
      }
      else {
        return false;
      }
    }
    catch (error) {
      console.error(error);
    }
  }
}

function test() {
  const db = new Database();
  const user = new User(db);
  user.login('test', 'testing')
  .then((verified) => {
    if (verified) console.log('Login successful.')
    else console.log('You shall not pass!!')
  })
  .catch((error) => console.log(error));
}
