import dotenv from 'dotenv'
import Imap from 'imap'
import util from 'util'

dotenv.config()

const { IMAP_USER, IMAP_PASS, IMAP_HOST, IMAP_PORT, IMAP_TLS } = process.env

const imap = new Imap({
  user: IMAP_USER,
  password: IMAP_PASS,
  host: IMAP_HOST,
  port: IMAP_PORT,
  tls: (IMAP_TLS === "true")
});

function openInbox (cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function () {
  openInbox(function (err, box) {
    if (err) throw err;
    var f = imap.seq.fetch('1:*', {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });
    f.on('message', function (msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = `(#${seqno}) `;
      msg.on('body', function (stream, info) {
        var buffer = '';
        stream.on('data', function (chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function () {
          console.log(`${prefix}Parsed header: %s`, util.inspect(Imap.parseHeader(buffer)));
        });
      });
      msg.once('attributes', function (attrs) {
        console.log(`${prefix}Attributes: %s`, util.inspect(attrs, false, 8));
      });
      msg.once('end', function () {
        console.log(`${prefix}Finished`);
      });
    });
    f.once('error', function (err) {
      console.log(`Fetch error: ${err}`);
    });
    f.once('end', function () {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', function (err) {
  console.log(err);
});

imap.once('end', function () {
  console.log('Connection ended');
});

imap.connect();
