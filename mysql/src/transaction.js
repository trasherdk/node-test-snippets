/*
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastname` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci

CREATE DEFINER=`root`@`%` PROCEDURE `create_user_transaction`(
  IN fname VARCHAR(45),
  IN lname VARCHAR(45),
  IN email VARCHAR(256),
  OUT user_id INT
)
    SQL SECURITY INVOKER
BEGIN
  START TRANSACTION;

  SELECT create_user_function( fname, lname, email) INTO user_id;

  IF user_id > 0 THEN
    COMMIT;
  ELSE
    ROLLBACK;
  END IF;
END
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
