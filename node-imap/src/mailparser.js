const simpleParser = require('mailparser').simpleParser;

fetch.on('message', function (msg, seqno) {
  msg.on('body', function (stream, info) {

    simpleParser(stream, (err, mail) => { //use this

      mail.text //contains mail body/content in text form
      mail.headers.get('<header key>') //retreives header content by key (for example 'from' or 'to')
      mail.attachments[
        {
          type: 'attachment',
          content: [], // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64 0a>,
          contentType: 'text/plain',
          partId: '2',
          release: null,
          contentDisposition: 'attachment',
          filename: 'attachment-file.txt',
          headers: [Map],
          checksum: '6f5902ac237024bdd0c176cb93063dc4',
          size: 12
        }
      ]
    });

  });
});
