// get the client
import { createConnection } from 'mysql2/promise'
import { insertArray } from './insert-array.js'
import { insertArrayRecursive } from './insert-array-recursive.js'
import { reject } from 'async'

import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: resolve(__dirname, '.env') })
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env

const data = [
  {
    firstname: 'John',
    lastname: 'Doe',
    email: 'John.Doe@example.com',
    status: 1
  },
  {
    firstname: 'Jane',
    lastname: 'Doe',
    email: 'Jane.Doe@example.com',
    status: 4
  }
]
const cols = ['firstname', 'lastname', 'email', 'status']

const main = async () => {
  return new Promise(async (resolve, reject) => {
    // create the connection to database
    let db
    try {
      db = await createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME
      })
    } catch (error) {
      console.error(error)
      reject(error)
    }

    await db.execute('truncate table users')

    // insertArrayRecursive(db, 'users', cols, data, (err, response) => {
    insertArrayRecursive(db, 'users', data, (err, response) => {
      if (err) {
        console.log('callback:', err)
        reject(`${response.length} was not inserted`)
      }
    })
    // simple query
    let [results, fields] = await db.query('SELECT * FROM users')

    console.log('results', results) // results contains rows returned by server
    console.log('fields', fields.map(f => `${f.name}`)); // fields contains extra meta data about results, if available

    // with placeholder
    [results, fields] = await db.query(
      'SELECT firstname, lastname FROM `users` WHERE `firstname` = ? AND `status` = ?',
      ['Jane', 4],
      (err) => {
        if (err) {
          const error = {
            code: err.code,
            message: err.sqlMessage,
            sql: err.sql
          }
          console.error(error)
          reject(error)
        }
      }
    )

    console.log('more results', results)
  })
}

(async () => {
  await main()
})()
