import * as crypto from 'crypto';

const ALGORITHM = 'aes-128-gcm';
const IV_LENGTH = 12; // Initialization vector length

export class AES {
	constructor (private secret: string) { }

	encrypt (plainText: string) {
		const iv = crypto.randomBytes(IV_LENGTH);
		const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(this.secret, 'hex'), iv);
		let encrypted = cipher.update(plainText, 'utf8');
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		const tag = cipher.getAuthTag();
		return {
			iv: iv.toString('hex'),
			encryptedData: encrypted.toString('hex'),
			tag: tag.toString('hex')
		};
	}

	decrypt (iv: string, encryptedData: string, tag: string) {
		const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(this.secret, 'hex'), Buffer.from(iv, 'hex'));
		decipher.setAuthTag(Buffer.from(tag, 'hex'));
		let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString('utf8');
	}
}

// Example usage
const secretKey = crypto.randomBytes(16).toString('hex'); // Generate a 16-byte key

const aes = new AES(secretKey);
const encrypted = aes.encrypt('Hello, World!');
console.log('Encrypted:', encrypted);
const decrypted = aes.decrypt(encrypted.iv, encrypted.encryptedData, encrypted.tag);
console.log('Decrypted:', decrypted);
