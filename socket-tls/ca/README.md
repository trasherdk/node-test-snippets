
The `gen-certs.sh` script will perform the below sequence of commands, without prompting for anything :smiley:

Generate a self-signed root certificate. Setting password to `password` using `-passout` parameter.

```sh
openssl req -new -x509 -days 365 -keyout ca-key.pem -out ca-crt.pem -passout pass:password
```

The root cert has the folowing properties:

```
Country Name (2 letter code) [AU]:DK
State or Province Name (full name) [Some-State]:Denmark
Locality Name (eg, city) []:Copenhagen
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Trashers Test CA
Organizational Unit Name (eg, section) []:Test CA
Common Name (e.g. server FQDN or YOUR name) []:Root CA
Email Address []:ca-admin@example.com
```

Generate the server private key:

```sh
openssl genrsa -out server-key.pem 4096
```

Generate Server certificate signing request:

```sh
openssl req -new -key server-key.pem -out server-csr.pem
```

The server signing request has the folowing properties:

```
Country Name (2 letter code) [AU]:DK
State or Province Name (full name) [Some-State]:Denmark
Locality Name (eg, city) []:Copenhagen
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Trashers Test Server
Organizational Unit Name (eg, section) []:Test Server
Common Name (e.g. server FQDN or YOUR name) []:server.js
Email Address []:server-admin@example.com
```

Signing the server signing request:
```sh
openssl x509 -req -days 365 -in server-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out server-crt.pem -passin pass:password
```

Verify the signed certificate:
```sh
openssl verify -CAfile ca-crt.pem server-crt.pem
```

Repeat the server steps, just for the client instead.

```sh
openssl genrsa -out client-key.pem 4096
openssl req -new -key client-key.pem -out client-csr.pem
openssl x509 -req -days 365 -in client-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out client-crt.pem -passin pass:password
```
