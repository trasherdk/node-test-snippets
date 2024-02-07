import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// Demo implementation of using `aes-256-gcm` with node.js's `crypto` lib.
const aes256gcm = (key) => {
	const ALGO = 'aes-256-gcm';

	// encrypt returns base64-encoded ciphertext
	const encrypt = (str) => {
		// The `iv` for a given key must be globally unique to prevent
		// against forgery attacks. `randomBytes` is convenient for
		// demonstration but a poor way to achieve this in practice.
		//
		// See: e.g. https://csrc.nist.gov/publications/detail/sp/800-38d/final
		const iv = Buffer.from(randomBytes(12), 'utf8');
		const cipher = createCipheriv(ALGO, key, iv);

		// Hint: Larger inputs (it's GCM, after all!) should use the stream API
		let enc = cipher.update(str, 'utf8', 'base64');
		enc += cipher.final('base64');
		return [enc, iv, cipher.getAuthTag()];
	};

	// decrypt decodes base64-encoded ciphertext into a utf8-encoded string
	const decrypt = (enc, iv, authTag) => {
		const decipher = createDecipheriv(ALGO, key, iv);
		decipher.setAuthTag(authTag);
		let str = decipher.update(enc, 'base64', 'utf8');
		str += decipher.final('utf8');
		return str;
	};

	return {
		encrypt,
		decrypt,
	};
};

const KEY = Buffer.from(randomBytes(32), 'utf8');

const aesCipher = aes256gcm(KEY);

const [encrypted, iv, authTag] = aesCipher.encrypt('hello, world');
const decrypted = aesCipher.decrypt(encrypted, iv, authTag);

console.log(decrypted); // 'hello, world'
