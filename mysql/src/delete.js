import { createConnection } from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

const db = await createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME
})

let results
let fields
let status = 1;

[results, fields] = await db.query('SELECT firstname, lastname, status FROM users WHERE status = ?', status)

console.log('Selected', results)
console.log('fields', fields.map(f => `${f.name}`))

results = await db.query('DELETE FROM users WHERE status=?', status, (err) => {
  if (err) {
    const error = {
      code: err.code,
      message: err.sqlMessage,
      sql: err.sql
    }
    console.error(error)
  }
})

console.log('Deleted #1:', results)

status = 4
await db.query('DELETE FROM users WHERE status=?', status, (err, result) => {
  if (err) {
    console.log('Error:', err)
  } else {
    console.log('Deleted #2', result)
  }
  db.close()
})
