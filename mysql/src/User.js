const mysql = require('mysql')

class User {
  constructor (connection) {
    this.connection = connection
  }

  getAllUsers () {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
          return reject(err)
        }
        resolve(results)
      })
    })
  }

  getUserById (id) {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
          return reject(err)
        }
        resolve(results)
      })
    })
  }

  getUserByAlias (alias) {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM users WHERE alias = ?', [alias], (err, results) => {
        if (err) {
          return reject(err)
        }
        resolve(results)
      })
    })
  }

  getUserByEmail (email) {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
          return reject(err)
        }
        resolve(results)
      })
    })
  }

  createUser (alias, email) {
    return new Promise((resolve, reject) => {
      this.connection.query('INSERT INTO users (alias, email) VALUES (?, ?)', [alias, email], (err, results) => {
        if (err) {
          return reject(err)
        }
        resolve(results)
      })
    })
  }

  updateUser (id, alias, email) {
    return new Promise((resolve, reject) => {
      this.connection.query('UPDATE users SET alias = ?, email = ? WHERE id = ?', [alias, email, id], (err, results) => {
        if (err) {
          return reject(err)
        }
        resolve(results)
      })
    })
  }

  deleteUser (id) {
    return new Promise((resolve, reject) => {
      this.connection.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
          return reject(err)
        }
        resolve(results)
      })
    })
  }
}

module.exports = User
