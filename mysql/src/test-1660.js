import mysql from 'mysql2/promise'

import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: resolve(__dirname, '.env') })
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env

async function main () {
  const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
  })

  console.log('SELECT version()')

  let version = pool.execute('SELECT version()')

  console.log('version:', version)
  /*
  console.log('wait for promised timeout')
  await new Promise(resolve => setTimeout(() => {
    console.log('resolve timeout')
    resolve
  }, 2000));
  console.log('version:', version)

  * Anything after await new Promise() never executes.
   */
  version = await version
  console.log('awaited version:', version[0][0])

  const version2 = await pool.execute('SELECT version()')
  console.log('awaited execute():', version2[0])
}

main()
