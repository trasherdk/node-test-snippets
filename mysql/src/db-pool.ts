import mysql from 'mysql2/promise';
import { setTimeout } from 'timers/promises';

export default class DB {
  private pool

  constructor (options: mysql.PoolOptions) {

    this.pool = mysql.createPool(options)

    this.pool.on('connection', function (err) {
      if (err.code) {
        console.log('error code', err.code); // 'ECONNREFUSED'
        console.log('error fatal', err.fatal); // true
      }
    });

    this.pool.on('enqueue', function () {
      console.log('Waiting for available connection slot');
    });

    this.pool.on('acquire', function (conn) {
      console.log('Acquired connection ', conn.threadId);
    });

    this.pool.on('release', function (conn) {
      console.log('connection release', conn.threadId);
    });

    this.pool.on('close', function (conn) {
      console.log('connection closed', conn.threadId);
    });
  }

  private async createPool (options) {
    const res = await mysql.createPool(options)

    return res
  };

  public connection () {
    return this.pool.getConnection()
  }
}

