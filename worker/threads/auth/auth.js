// import sha256 from "js-sha256"
import crypto from "crypto"
import { expose } from "threads/worker"

const sha256 = (data) => {
  return crypto.createHash('sha256').update(data).digest('base64')
}

expose({
  hashPassword (password, salt) {
    return sha256(password + salt)
  }
})
