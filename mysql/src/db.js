import * as mysql from 'mysql2/promise';

let connection = null

export const DB = {

  async connect (options) {
    if (!connection) {
      connection = await DB.getConnection(options)
    }
  },

  async getConnection (options) {
    return await mysql.createConnection(options)
  },

  async query (sql, values) {
    return connection.query(sql, values)
      .then(([rows, fields]) => [rows, fields])
  },

  async execute (sql, values) {
    return connection.execute(sql, values)
      .then(([rows, fields]) => [rows, fields])
  },

  async close () {
    await connection.close()
  }
}
