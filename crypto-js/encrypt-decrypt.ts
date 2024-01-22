import crypto from 'crypto'

const algorithm = 'aes-192-cbc'

export function generateKey (password, keylen) {
	const salt = crypto.randomBytes(8)
	console.log('Salt:', Buffer.from(salt).toString('hex'))
	return crypto.scryptSync(password, salt, keylen)
}
export function encrypt (key: Buffer, text: string) {
	const iv = crypto.randomBytes(16)
	const cipher = crypto.createCipheriv(algorithm, key, iv)
	const encrypted = cipher.update(text, 'utf8', 'hex')
	return [encrypted + cipher.final('hex'), Buffer.from(iv).toString('hex')].join('|')
}

export function decrypt (key: Buffer, text: string) {
	const [encrypted, iv] = text.split('|')
	if (!iv) throw new Error('IV not found')
	const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'))
	return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
}
