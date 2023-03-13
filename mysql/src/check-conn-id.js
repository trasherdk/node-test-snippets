import * as db from "./check-conn-id-db.js";
import dotenv from 'dotenv'

dotenv.config()
const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env
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

await db.connect(poolOptions)
const conn1 = await db.getConn();
const conn2 = await db.getConn();
console.log({
  conn1: conn1.threadId,
  conn2: conn2.threadId,
});

const [users] = await conn1.query('select firstname fname, lastname lname, email from users')

console.log(users)

conn1.release()
conn2.release()
