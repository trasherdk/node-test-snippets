export const insertArray = async (con, table, fields, items, cb) => {
  if (fields.length < 1) {
    return cb(Error('fields[] is empty'), items)
  }
  if (items.length < 1) {
    return cb(Error('items[] is empty'), items)
  }
  if (Object.keys(items[0]).length !== fields.length) {
    return cb(Error(`Number of fields (${fields.length}) must match fields in items[] (${Object.keys(items[0]).length})`), items)
  }

  const keys = fields.join(',')
  const vals = Array(fields.length).fill('?').join(',')

  while (items.length > 0) {
    const item = items.pop()
    try {
      await con.execute(`INSERT INTO ${table} ( ${keys} ) VALUES ( ${vals} )`, Object.values(item), (err, result) => {
        if (err) {
          items.unshift(item)
          const error = {
            code: err.code,
            sql: err.sql,
            message: err.sqlMessage,
            where: 'execute:callback'
          }
          return cb(error, items)
        }
        console.log('insert result', result)
        items.pop()
        console.log(`1 item inserted, ${items.length} left`)
      })
    } catch (err) {
      const error = {
        raw: err,
        code: err.code,
        sql: err.sql,
        message: err.sqlMessage,
        where: 'execute:try:catch'
      }
      items.unshift(item)
      return cb(error, items)
    }
  }
  return cb(null, 'OK')
}

/**
 *
insertArray(con, table, fields, array, (err, result) => {
  console.log({ err, result });
});
 */
