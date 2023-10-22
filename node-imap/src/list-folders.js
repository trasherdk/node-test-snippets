import dotenv from 'dotenv'
import Imap from 'imap'
import { inspect } from 'util'

dotenv.config()

const { IMAP_USER, IMAP_PASS, IMAP_HOST, IMAP_PORT, IMAP_TLS } = process.env

const imap = new Imap({
  user: IMAP_USER,
  password: IMAP_PASS,
  host: IMAP_HOST,
  port: IMAP_PORT,
  tls: (IMAP_TLS === "true")
});

function openBox (prefix, cb) {
  imap.openBox(prefix, true, cb);
}

let boxes = []

imap.once('ready', function () {
  /*
  openBox('INBOX', function (err, box) {
    if (err) throw err;
    var f = imap.seq.fetch('1:2', {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });
  })
  */
  imap.getBoxes('Banking/Kasikorn/Kasikorn\ K-Plus/K-Plus\ Transfer', (err, top) => {
    if (err) {
      console.error('Error:', err)
      imap.end()
      return
    }
    console.log('Done fetching all mail boxes!');
    imap.end();

    console.log('Folders:', inspect(top, true, 8, true))
    /*
    ** top.Banking.children.Kasikorn.children["Kasikorn K-Plus"].children["K-Plus Transfer"].children["Jim (The Village)"]
    */
    // console.log('List:', top.Banking.children.Kasikorn.children["Kasikorn K-Plus"].children["K-Plus Transfer"].children["Jim (The Village)"])
    console.log('Banking Folders:', inspect(top.Banking, true, null, true))
  })
})


imap.once('error', function (err) {
  console.log(err);
});

imap.once('end', function () {
  console.log('Connection ended');
});

imap.connect();
