import * as mysql from 'mysql2/promise';

let connection = null

const DB = {

  async connect (options) {
    if (!connection) {
      connection = await getConnection(options)
        .then(conn => conn)
    }
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

const getConnection = async (options) => {
  return await mysql.createConnection(options)
}

const errorReturn = (error) => {
  return {
    ok: false,
    code: error.message
  }
}
export default DB
