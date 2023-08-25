import mysql from 'mysql2/promise';
import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

(async () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  dotenv.config({ path: resolve(__dirname, '.env') })
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env

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
