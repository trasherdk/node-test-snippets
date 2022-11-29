// get the client
import { createConnection } from 'mysql2/promise'
import dotenv from 'dotenv'
import { insertArray } from './insert-array.js'
/*
import path, {resolve} from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
*/

dotenv.config()
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

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
  // create the connection to database
  let connection
  try {
    connection = await createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  connection.execute('truncate table users')

  insertArray(connection, 'users', cols, data, (err, response) => {
    if (err) {
      console.log('callback:', err)
      console.log(`${response.length} was not inserted`)
    }
  })
  // simple query
  let [results, fields] = await connection.query('SELECT * FROM users')

  console.log('results', results) // results contains rows returned by server
  console.log('fields', fields.map(f => `${f.name}`)); // fields contains extra meta data about results, if available

  // with placeholder
  [results, fields] = await connection.query(
    'SELECT firstname, lastname FROM `users` WHERE `firstname` = ? AND `status` = ?',
    ['Page', 4],
    (err) => {
      if (err) {
        const error = {
          code: err.code,
          message: err.sqlMessage,
          sql: err.sql
        }
        console.error(error)
        return error
      }
    }
  )

  console.log('more results', results)
}

main()
