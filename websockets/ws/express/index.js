'use strict';

import session from 'express-session';
import express from 'express';
import { createServer } from 'http';
import { v4 as uuid } from 'uuid';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envpath = resolve(__dirname, '.env')
dotenv.config({ path: envpath })
const { HOST, PORT, SECRET } = process.env

const app = express();
const map = new Map();

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
  saveUninitialized: false,
  secret: SECRET,
  resave: false
});

//
// Serve static files from the 'public' folder.
// As this is not the root, resolve is needed.
//
app.use(express.static(resolve(__dirname, 'public')));
app.use(sessionParser);

app.post('/login', function (req, res) {
  //
  // "Log in" user and set userId to session.
  //
  const id = uuid();

  console.log(`Updating session for user ${id}`);
  req.session.userId = id;
  res.send({ result: 'OK', message: 'Session updated' });
});

app.delete('/logout', function (request, response) {
  const ws = map.get(request.session.userId);

  console.log('Destroying session');
  request.session.destroy(function () {
    if (ws) ws.close();

    response.send({ result: 'OK', message: 'Session destroyed' });
  });
});

//
// Create an HTTP server.
//
const server = createServer(app);

//
// Create a WebSocket server completely detached from the HTTP server.
//
const wss = new WebSocketServer({ clientTracking: false, noServer: true });

server.on('upgrade', function (request, socket, head) {
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

wss.on('connection', function (ws, request) {
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
server.listen(PORT, HOST, function () {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
