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

CREATE DEFINER=`root`@`%` FUNCTION `create_user_function`(
  fname VARCHAR(45),
  lname VARCHAR(45),
  email VARCHAR(256)
) RETURNS int(11)
    SQL SECURITY INVOKER
BEGIN
  DECLARE user_id INT DEFAULT 0;

  INSERT INTO users(firstname, lastname, email)
  VALUES(fname, lname, email);

  SET user_id = LAST_INSERT_ID();
  RETURN user_id;
END
*/
import * as db from "./check-conn-id-db.js";

await db.connect()

const conn = await db.getConn();
conn.config.namedPlaceholders = true
await conn.query('truncate table users')

const data = [
  { fname: 'John', lname: 'Doe', email: 'John.Doe@example.com' },
  { fname: 'Jane', lname: 'Doe', email: 'Jane.Doe@example.com' },
  { fname: 'Alice', lname: 'Doe', email: 'Alice.Doe@example.com' },
  { fname: 'Bob', lname: 'Doe', email: 'Bob.Doe@example.com' }
]
const sql = 'select create_user_function( :fname, :lname, :email) as id'

for (const user of data) {

  try {
    const [callres] = await conn.query(sql, user)
    console.log('insert:', callres[0])
    user.id = callres[0].id
  } catch (error) {
    console.log(error)
  }
  console.log(user)
}

await conn.release()
await db.close()