import DB from './db.ts'
import dotenv from 'dotenv'
/*
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
*/
dotenv.config()
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env
const config = {
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
}

const db = new DB(config)

await db.query('select 1+1 as solution')
  .then(([rows]) => rows[0])
  .then((solution) => {
    console.log('Query: Solution is:', solution)
  })

await db.execute('select 2+3 as solution')
  .then(([rows]) => rows[0])
  .then((solution) => {
    console.log('Execute: Solution is:', solution)
  })

await db.close()
