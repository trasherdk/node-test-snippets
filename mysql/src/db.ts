import mysql from 'mysql2/promise';
import { setTimeout } from 'timers/promises';

export default class DB {
  // Note that it needs to be a promise:
  private connection: Promise<mysql.Connection>;

  constructor (options: mysql.ConnectionOptions) {
    // But in constructor, you can't use the "await"
    this.connection = this.getConnection(options);
  }

  private getConnection = async (options: mysql.ConnectionOptions) => await mysql.createConnection(options);

  // So, you need to await the promise both from "connection" and "query"
  public async query (sql: string, values?: string | [string | number] | null) {
    (await this.connection).connect();

    return await (await this.connection).query(sql, values);
  }

  // The same for "execute"
  public async execute (sql: string, values?: string | [string | number] | null) {
    (await this.connection).connect();

    return await (await this.connection).execute(sql, values);
  }

  public async close () {
    return new Promise((resolve) => {
      setTimeout(2000, resolve('OK'))
    })
  }
}
