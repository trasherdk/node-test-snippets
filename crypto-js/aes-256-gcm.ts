/**
 * Source: https://gist.github.com/rjz/15baffeab434b8125ca4d783f4116d81
 *
 * Notice the comment: IV should be 12 bytes (96 bit) - 16 byte nonce is not recommended for GCM
 * https://gist.github.com/rjz/15baffeab434b8125ca4d783f4116d81?permalink_comment_id=3725558#gistcomment-3725558
 */
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const encrypt = (data: string, key: string) => {
	const algorithm = 'aes-256-gcm';
	const iv = Buffer.from(randomBytes(12));

	// Create the cipher
	const cipher = createCipheriv(algorithm, key, iv);

	// Encrypt the data
	let encrypted = cipher.update(data, 'utf8', 'base64');
	encrypted += cipher.final('base64');

	// Add the auth tag
	const authTag = cipher.getAuthTag();

	// The encrypted data
	const encryptedText = `${iv.toString('base64')}:${encrypted}:${authTag.toString('base64')}`;
	return encryptedText;
}

const decrypt = (data, key) => {
	// Split the encrypted data and auth tag
	const [ivBase64, encrypted, authTagBase64] = data.split(':');

	const algorithm = 'aes-256-gcm';

	const iv = Buffer.from(ivBase64, 'base64')
	const authTag = Buffer.from(authTagBase64, 'base64')

	// Create the decipher
	const decipher = createDecipheriv(algorithm, key, iv);

	// Verify the auth tag
	decipher.setAuthTag(authTag);

	// Decrypt the data
	let decrypted = decipher.update(encrypted, 'base64', 'utf8');
	decrypted += decipher.final('utf8');

	// The decrypted data
	return decrypted;

}

const key = randomBytes(16).toString('hex')

const encrypted = encrypt('Secret data, do not tell anybody', key)
console.log(decrypt(encrypted, key))
