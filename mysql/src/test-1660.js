import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

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
  console.log('awaited version:', version[0])

  const version2 = await pool.execute('SELECT version()')
  console.log('awaited execute():', version2[0])
}

main()
