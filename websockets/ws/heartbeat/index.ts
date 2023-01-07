import session from 'express-session';
import express, { Request, Response } from 'express'
import http, { createServer } from 'http';
import { v4 as uuid } from 'uuid';
import { WebSocketServer } from 'ws';

import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
import { Http2SecureServer } from 'http2';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envpath = resolve(__dirname, '.env')
dotenv.config({ path: envpath })
const { HOST, PORT, SECRET } = process.env

const app = express()
const map = new Map()

const sessionParser = session({
  saveUninitialized: false,
  secret: SECRET,
  resave: false
})

app.use(express.static(resolve(__dirname, 'public')));
app.use(sessionParser)

app.get('/', (req: Request, res: Response) => {
  res.json({ greeting: 'Hello world!' })
})

app.post('/login', function (req: Request, res: Response) {
  //
  // "Log in" user and set userId to session.
  //
  const id = uuid();

  console.log(`Updating session for user ${id}`);
  req.session.userId = id;
  res.send({ result: 'OK', message: 'Session updated' });
})

app.delete('/logout', function (req: Request, res: Response) {
  const ws = map.get(req.session.userId);

  console.log('Destroying session');
  req.session.destroy(function () {
    if (ws) ws.close();

    res.send({ result: 'OK', message: 'Session destroyed' });
  });
});

const server = createServer(app);
const wss = new WebSocketServer({ clientTracking: false, noServer: true });

server.on('upgrade', function (request: Request, socket, head) {
  console.log('Parsing session from request...');

  sessionParser(request, {}, () => {
    if (!request.session.userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    console.log('Session is parsed!');

    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    });
  });
});

wss.on('connection', function (ws, request: Request) {
  const userId = request.session.userId;

  map.set(userId, ws);

  ws.on('message', function (message) {
    //
    // Here we can now use session parameters.
    //
    console.log(`Received message ${message} from user ${userId}`);
  });

  ws.on('close', function () {
    map.delete(userId);
  });
});

//
// Start the server.
//
server.listen(Number(PORT), HOST, function () {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
