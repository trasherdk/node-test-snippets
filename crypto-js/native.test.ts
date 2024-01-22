import { generateKey, encrypt, decrypt } from "./encrypt-decrypt.ts";
import { log } from "console";


const key = generateKey('secret', 24)

const payload: Record<string, number | string> = {
	squence: 1,
	message: 'My secret message.'
}

const encrypted = encrypt(key, JSON.stringify(payload))

const decrypted = decrypt(key, encrypted)

console.log(JSON.parse(decrypted))