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

CREATE DEFINER=`root`@`%` PROCEDURE `create_user`(
  IN fname VARCHAR(45),
  IN lname VARCHAR(45),
  IN email VARCHAR(256),
  IN delay SMALLINT,
  INOUT user_id INT
)
  SQL SECURITY INVOKER
BEGIN
  INSERT INTO users(firstname, lastname, email)
  VALUES(fname, lname, email);

  IF(delay > 0) THEN
    DO SLEEP(delay);
  END IF;

  SELECT LAST_INSERT_ID() INTO user_id;
END
*/
import * as db from "./check-conn-id-db.js";

await db.connect()

const conn = await db.getConn();
conn.config.namedPlaceholders = true
await conn.query('truncate table users')

const data = [
  { fname: 'John', lname: 'Doe', email: 'John.Doe@example.com', delay: 0 },
  { fname: 'Jane', lname: 'Doe', email: 'Jane.Doe@example.com', delay: 0 },
  { fname: 'Alice', lname: 'Doe', email: 'Alice.Doe@example.com', delay: 0 },
  { fname: 'Bob', lname: 'Doe', email: 'Bob.Doe@example.com', delay: 0 }
]
const sql = 'call test.create_user( :fname, :lname, :email, :delay, @user_id)'

for (const user of data) {

  try {
    const [callres] = await conn.query(sql, user)
    console.log('insert:', callres.affectedRows)
    const [selres] = await conn.query('select @user_id as id')
    console.log('select:', selres[0])
    user.id = selres[0].id
    delete (user.delay)
  } catch (error) {
    console.log(error)
  }
  console.log(user)
}

await conn.release()
await db.close()