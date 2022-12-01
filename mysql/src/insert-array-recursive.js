export const insertArrayRecursive = async (conn, table, items, cb) => {
  if (items.length < 1) {
    return cb(null, 'done!')
  }
  const [item, ...tail] = items
  console.log('INSERT:', item)

  const keys = Object.keys(item).join(',')
  const vals = Array(Object.values(item).length).fill('?').join(',')
  let result

  try {
    result = await conn.query(`INSERT INTO ${table} (${keys}) VALUES (${vals})`, Object.values(item))
  } catch (err) {
    return cb(err)
  }
  console.log('INSERT Result:', result)
  console.log(`1 item inserted, ${tail.length} left`)
  insertArrayRecursive(conn, table, tail, cb)
}

/*
insertArray(conn,'users', arr, (err, result) => {
  console.log({ err, result })
})
*/