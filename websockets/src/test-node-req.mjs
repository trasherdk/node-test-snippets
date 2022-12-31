import { request, Agent, createServer } from 'node:http';

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
  createServer((req, res) => {
    res.statusCode = 204;
    console.log(`${req.method}:NODE:${total}`);
    res.end();
  }).listen(4444, r),
);

await req('GET');
await req('PUT');
await req('POST');
await req('DELETE');
await req('GET');

process.exit(0);
