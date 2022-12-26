import mysql from 'mysql2/promise';
import dotenv from 'dotenv'

(async () => {
  dotenv.config()
  const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env

  const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    namedPlaceholders: true
  });
  const sql = `INSERT INTO content (name, content, publish) VALUES (:name, :content, :publish})`;
  try {
    const response = await pool.execute(sql, { name: 'some name', content: 'some content' });
    console.log(response);
  } catch (e) {
    console.log('Hooray I caught an error.')
  }

})();
