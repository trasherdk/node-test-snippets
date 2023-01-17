/*
import mysql from 'mysql2/promise';
import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config(({ path: `${resolve(__dirname, '.env')}` }))
const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env
*/
import * as db from "./check-conn-id-db.js";

await db.connect()

const conn1 = await db.getConn();
conn1.config.namedPlaceholders = true
const conn2 = await db.getConn()
conn2.config.namedPlaceholders = true

const [users1] = await conn1.query('select * from users')
console.log(users1)

const [users2] = await conn2.query('select count(*) count from users')
console.log(users2[0])

await conn1.query('truncate table users')

const data = [
  { fname: 'John', lname: 'Doe', email: 'John.Doe@example.com' },
  { fname: 'Jane', lname: 'Doe', email: 'Jane.Doe@example.com' },
  { fname: 'Alice', lname: 'Doe', email: 'Alice.Doe@example.com' },
  { fname: 'Bob', lname: 'Doe', email: 'Bob.Doe@example.com' }
]

const sql = 'call create_user_transaction( :fname, :lname, :email, @user_id)'

let cnt = 0
for (const user of data) {
  let id = 0
  if (++cnt % 2) {
    try {
      const [callres1] = await conn1.query(sql, user)
      console.log('insert[1]:', callres1)
      const [selres1] = await conn1.query('select @user_id as id')
      console.log('select[1]:', selres1[0])

      id = selres1[0].id
      user.id = id
      console.log(user)
    } catch (error) {
      console.log('conn1:', error.sqlMessage)
    }
  } else {
    try {
      const [callres2] = await conn2.query(sql, user)
      console.log('insert[2]:', callres2.affectedRows)
      const [selres2] = await conn2.query('select @user_id as id')
      console.log('select[2]:', selres2[0])

      id = selres2[0].id
      user.id = id
      console.log(user)
    } catch (error) {
      console.log('conn2:', error.sqlMessage)
    }
  }
}

await conn1.release()
await conn2.release()
