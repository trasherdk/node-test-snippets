# Stuff I can't remember, and has to google again and again

### Initialize MySQL database directory after initial install

Setting up a basic server, with no password on `root`@`localhost` account.

```sh
# mysqld --user mysql --initialize-insecure
```
Next you want to set a password for the root account.
- Add or Change Password for existing user (below)

## Account Management Statements
https://dev.mysql.com/doc/refman/5.7/en/account-management-statements.html

### Create new user

```sql
CREATE USER IF NOT EXISTS 'user'@'localhost' IDENTIFIED BY 'new_password' PASSWORD EXPIRE never;

CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'new_password' PASSWORD EXPIRE never;
```

### Grant all privileges on all database to root user

```sql
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
GRANT PROXY ON ''@'' TO 'root'@'localhost' WITH GRANT OPTION;

GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
GRANT PROXY ON ''@'' TO 'root'@'%' WITH GRANT OPTION;
```

### Add or Change Password for existing user

```sql
ALTER USER IF EXISTS 'user'@'localhost' IDENTIFIED BY 'new_password' PASSWORD EXPIRE never;

ALTER USER IF EXISTS 'user'@'%' IDENTIFIED BY 'new_password' PASSWORD EXPIRE never;
```

### Generate UUIDv4 in MySQL

```sql
select (lower(concat(hex(random_bytes(4)), '-', hex(random_bytes(2)), '-4', substr(hex(random_bytes(2)), -3), '-', hex((ascii(random_bytes(1)) >> 6)+8), substr(hex(random_bytes(2)), -3), '-', hex(random_bytes(6)))));
```

Source: [Generating v4 UUIDs in MySQL](https://emmer.dev/blog/generating-v4-uuids-in-mysql/)

