
The `gen-certs.sh` script will perform the below sequence of commands, without prompting for anything :smiley:

Actually, the below sequence does no provide valid server cert, only `gen-certs.sh` will.

Generate a self-signed root certificate. Setting password to `password` using `-passout` parameter.

```sh
openssl req -new -x509 -days 3650 \
  -keyout ca-key.pem -out ca-crt.pem \
  -passout pass:password \
  -subj "/C=DK/ST=Denmark/L=Copenhagen/O=Trashers Test CA/OU=Test CA/CN=Root CA/emailAddress=ca-admin@example.com"
```

Generate the server private key:

```sh
openssl genrsa -out server-key.pem 4096
```

Generate Server certificate signing request:

```sh
openssl req -new -key server-key.pem -out server-csr.pem \
  -subj "/C=DK/ST=Denmark/L=Copenhagen/O=Trashers Test Server/OU=Test Server/CN=server.js/emailAddress=server-admin@example.com"
```

Signing the server signing request:
```sh
openssl x509 -req -days 365 -in server-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out server-crt.pem -passin pass:password \
  -extfile <(printf "subjectAltName=DNS:localhost,DNS:127.0.0.1,IP:127.0.0.1")
```

Verify the signed certificate:
```sh
openssl verify -CAfile ca-crt.pem server-crt.pem
```

Repeat the server steps, just for the client instead.

```sh
openssl genrsa -out client-key.pem 4096

openssl req -new -key client-key.pem -out client-csr.pem \
  -subj "/C=DK/ST=Denmark/L=Copenhagen/O=Trashers Test Client/OU=Test Client/CN=client.js/emailAddress=client-user@example.com"

openssl x509 -req -days 365 -in client-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out client-crt.pem -passin pass:password
```
