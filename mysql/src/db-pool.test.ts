import { error } from 'console';
import DB from './db-pool.ts'

import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: resolve(__dirname, '.env') })
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env

const poolOptions = {
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = new DB(poolOptions)

const conn1 = await pool.connection()
const conn2 = await pool.connection()

console.log({
  conn1: conn1.threadId,
  conn2: conn2.threadId,
});

await conn1.query('START TRANSACTION')
  .then(response => {
    console.log('conn1: start', response)
    conn1.query('select * from users where firstname = ? for update', ['The'])
  })

await conn2.query('START TRANSACTION')
  .then(response => {
    console.log('conn2: start', response)
    conn2.query('select * from users where firstname = ? for update', ['The'])
  })

conn2.query('update users set lastname = ? where firstname = ?', ['Dude', 'The'])
  .then(response => {
    console.log('conn2: update', response)
    return conn2.query('select firstname fname, lastname lname, email from users where firstname = ?', 'the')
  })
  .then(([users]) => {
    console.log('conn2:then: users', users)
  })
  .catch(error => {
    console.log('conn2: error', error)
  })

await conn1.query('update users set lastname = ? where firstname = ?', ['Nobody', 'The'])
  .then(response => {
    console.log('conn1: update', response)
    return conn1.query('select firstname fname, lastname lname, email from users where firstname = ?', 'the')
  })
  .then(([users]) => {
    console.log('conn1:then: users', users)
  }).catch(error => {
    console.log('conn1: error', error)
  })

await conn1.query('COMMIT')
  .then(response => {
    console.log('conn1: commit ', response)
  })

conn1.query('select firstname fname, lastname lname, email from users where firstname = ?', 'the')
  .then(([users]) => {
    console.log('conn1: users - ', users)
  }).catch(error => {
    console.log('conn1: error', error)
  })

await conn2.query('COMMIT')
  .then(response => {
    console.log('conn2: commit ', response)
  })

conn2.query('select firstname fname, lastname lname, email from users where firstname = ?', 'the')
  .then(([users]) => {
    console.log('conn2: users - ', users)
  }).catch(error => {
    console.log('conn2: error', error)
  })

conn1.release()
conn2.release()

const conn3 = await pool.connection()
conn3.query('select firstname fname, lastname lname, email from users where firstname = ?', 'the')
  .then(([users]) => {
    console.log('conn3: users - ', users)
  }).catch(error => {
    console.log('conn3: error', error)
  })

conn3.release()
