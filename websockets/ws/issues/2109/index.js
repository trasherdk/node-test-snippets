import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const data = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
  </head>
  <body>
    <button onClick="hello()">Send Hello!</button>
    <script>
      function hello() {
        var ws = new WebSocket('ws://localhost:8080');

        ws.onopen = function () {
          ws.send('hello');
        };
      }
      (
        hello()
      )();
    </script>
  </body>
</html>`;

const server = createServer();

const wss = new WebSocketServer({ server });

server.on('request', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.end(data);
});

wss.on('connection', (ws) => {
  ws.on('message', (buf) => {
    console.log(buf.toString());
  });

  ws.send('hello');
});

server.listen(8080, () => {
  console.log('Open http://127.0.0.1:8080 in the brower');
});
