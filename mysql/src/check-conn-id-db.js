import mysql from 'mysql2/promise';
import dotenv from 'dotenv'

dotenv.config()
const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env

let pool;

const connect = async () => {
  // Create the connection pool. The pool-specific settings are the defaults
  const poolOptions = {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  if (!pool) {
    pool = await mysql.createPool(poolOptions);
  }

  pool.on('connection', function (err) {
    if (err.code) {
      console.log('error code', err.code); // 'ECONNREFUSED'
      console.log('error fatal', err.fatal); // true
    }
  });

  pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
  });

  pool.on('acquire', function (conn) {
    console.log('Acquired connection ', conn.threadId);
  });

  pool.on('release', function (conn) {
    console.log('connection release', conn.threadId);
  });
};

const getConn = async () => {
  return await pool.getConnection();
};

const foundRow = async conn => {
  const [rows, fields] = await conn.query(`SELECT FOUND_ROWS();`);

  console.log({ rows });

  return rows[0]['FOUND_ROWS()'];
};

export { pool, connect, foundRow, getConn };
