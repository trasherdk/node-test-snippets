import { error, log } from 'node:console'
import { WebSocket, WebSocketServer } from 'ws'

const promisifyWebSocket = (url: string): Promise<WebSocket> => {
	return new Promise((resolve, reject) => {
		const ws = new WebSocket(url)
		ws.on('error', (error) => reject(error))
		ws.on('open', () => resolve(ws))
	})
}

const logger = (err) => {
	console.error('caught', err.code, err.message)
}

try {
	const ws = await promisifyWebSocket('https://does.not.exist')
} catch (err: any) {
	logger(err)
}

try {
	const ws = await promisifyWebSocket('ws://localhost:8080')
} catch (err: any) {
	logger(err)
}
