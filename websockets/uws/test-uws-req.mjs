import { App } from 'uWebSockets.js';
import { request, Agent } from 'node:http'; // same with undici/fetch

const agent = new Agent({ keepAlive: true, maxSockets: 1 }); // share same connection

let total = 0;
async function req (method) {
  try {
    const no = ++total;
    await new Promise((r) => setTimeout(r, 5));
    console.log(`${method}:START:${no}`);
    await new Promise((resolve, reject) => {
      request(
        'http://127.0.0.1:4444/',
        {
          method,
          agent,
        },
        (res) => {
          res.on('data', () => { });
          res.on('end', resolve);
          res.once('error', reject);
        },
      ).end();
    });
    console.log(`${method}:DONE:${no}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

await new Promise((r) =>
  App()
    .any('/*', async (res, req) => {
      res.writeStatus('204 No Content');
      console.log(`${req.getMethod().toUpperCase()}:UWS:${total}`);
      res.end();
    })
    .listen(4444, r),
);

await req('GET');
await req('PUT');
await req('POST');
await req('DELETE'); // this one close connection on UWS side
await req('GET');

process.exit(0);
