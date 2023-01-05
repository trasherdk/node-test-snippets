import { App } from 'uWebSockets.js';
import { request, Agent } from 'node:http';
import { Readable } from 'node:stream';
import { randomBytes } from 'node:crypto';

const agent = new Agent({ keepAlive: true, maxSockets: 1 });

let total = 0;
async function req (method) {
  try {
    const no = ++total;
    await new Promise((r) => setTimeout(r, 5));
    console.log(`${method}:START:${no}`);
    await new Promise((resolve, reject) => {
      const req = request(
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
      ).on('error', reject);
      Readable.from(randomBytes(20000)).pipe(req);
    });
    console.log(`${method}:DONE:${no}`);
  } catch (err) {
    console.error(`ERROR:${err.message}`);
    process.exit(1);
  }
}

await new Promise((r) =>
  App()
    .any('/*', async (res, req) => {
      console.log(
        `${req.getMethod().toUpperCase()}:UWS:${total}:${req.getHeader('transfer-encoding')}`,
      );
      let byteLength = 0;
      res.onData((c, isLast) => {
        byteLength += c.byteLength;
        if (isLast) {
          console.log('received', byteLength);
          res.writeStatus('204 No Content');
          res.end();
          // workaround:
          // res.end(undefined, true);
        }
      });
      res.onAborted(() => {
        console.log('aborted');
        res.writeStatus('204 No Content');
        res.end();
      });
    })
    .listen(4444, r),
);

await req('POST');
await req('POST');

process.exit(0);
