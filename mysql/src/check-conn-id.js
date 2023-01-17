import * as db from "./check-conn-id-db.js";

await db.connect()
const conn1 = await db.getConn();
const conn2 = await db.getConn();
console.log({
  conn1: conn1.threadId,
  conn2: conn2.threadId,
});

const [users] = await conn1.query('select firstname fname, lastname lname, email from users')

console.log(users)

conn1.release()
conn2.release()
