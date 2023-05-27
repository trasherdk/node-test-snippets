import mysql from 'mysql2/promise';

let pool;

const connect = async (poolOptions) => {
  // Create the connection pool. The pool-specific settings are the defaults

  if (!pool) {
    pool = mysql.createPool(poolOptions);
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

  pool.on('close', function (conn) {
    console.log('connection closed', conn.threadId);
  });
};

const getConn = async () => {
  return await pool.getConnection();
};

const close = async () => {
  return await pool.end()
}

const foundRow = async conn => {
  const [rows, fields] = await conn.query(`SELECT FOUND_ROWS();`);

  console.log({ rows });

  return rows[0]['FOUND_ROWS()'];
};

export { pool, connect, close, foundRow, getConn };
