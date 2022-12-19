import Kraken from 'kraken-exc'
import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envpath = resolve(__dirname, '.env')

console.log('env:', envpath)
dotenv.config({ path: envpath })

const { API_KEY, API_SECRET } = process.env

console.log('KET: %s \nSECRET: %s', API_KEY, API_SECRET)

const main = async () => {
  const kraken = new Kraken({
    key: API_KEY,
    secret: API_SECRET,
    // otp: '2FA'
  }
  )

  try {
    kraken.getBalance(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(JSON.parse(data));
      }
    });
  } catch (error) {
    console.log('kraken.getBalance():', error)
  }
}

main()

// kraken-exc/src/kraken-exc.js