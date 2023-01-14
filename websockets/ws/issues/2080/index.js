/*
Before upgrading an http connection to websocket,
we might reject the connection based on certain policies.
In such cases, we would like to send the reason of rejection
along with a correlation Id.

Source: https://github.com/websockets/ws/issues/2080#issuecomment-1257516481
*/
import http from 'node:http';
import WebSocket from 'ws';

const server = http.createServer();

server.on('upgrade', function (request, socket) {
  socket.write('HTTP/1.1 429 Too Many Requests\r\n\r\n');
  socket.write('Corr Id: 123 \r\n');
  // Using `socket.end()` or
  // `socket.once('finish', socket.destroy); socket.end()` might be better
  // to ensure that the data is written.
  socket.destroy();
});

server.listen(function () {
  const { port } = server.address();
  const ws = new WebSocket(`ws://localhost:${port}`);

  ws.on('unexpected-response', function (request, response) {
    response.setEncoding('utf-8');

    response.on('data', function (chunk) {
      process.stdout.write(chunk);
    });

    response.on('end', function () {
      server.close();
    });
  });
});
