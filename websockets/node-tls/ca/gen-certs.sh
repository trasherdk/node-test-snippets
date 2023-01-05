#!/bin/bash

cd $(dirname $(realpath $0))
if [ ! -f $(basename $0) ]; then
  exit 1
fi

rm ca-* server-* client-*

echo "Generate the self-signed Root CA certificate:"

openssl req -new -x509 -days 3650 \
  -keyout ca-key.pem -out ca-crt.pem \
  -passout pass:password \
  -subj "/C=DK/ST=Denmark/L=Copenhagen/O=Trashers Test CA/OU=Test CA/CN=Root CA/emailAddress=ca-admin@example.com"

echo "Generate the server private key:"

openssl genrsa -out server-key.pem 4096

echo "Generate the server signing request:"

openssl req -new -key server-key.pem -out server-csr.pem \
  -subj "/C=DK/ST=Denmark/L=Copenhagen/O=Trashers Test Server/OU=Test Server/CN=server.js/emailAddress=server-admin@example.com" \
  || {
    echo "Generate the server signing request: FAILED"
    exit 1
  }

echo "Signing the server signing request:"

openssl x509 -req -days 365 -in server-csr.pem \
  -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial \
  -out server-crt.pem -passin pass:password \
  -extfile <(printf "subjectAltName=DNS:localhost,DNS:127.0.0.1,IP:127.0.0.1") \
  || {
    echo "Generate the server signing: FAILED"
    exit 1
  }

echo "Generate the client private key:"

openssl genrsa -out client-key.pem 4096

echo "Generate the client signing request:"

openssl req -new -key client-key.pem -out client-csr.pem \
  -subj "/C=DK/ST=Denmark/L=Copenhagen/O=Trashers Test Client/OU=Test Client/CN=client.js/emailAddress=client-user@example.com" \
  || {
    echo "Generate the client signing request: FAILED"
    exit 1
  }

echo "Signing the client signing request:"

openssl x509 -req -days 365 -in client-csr.pem \
  -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial \
  -out client-crt.pem -passin pass:password \
  || {
    echo "Signing the client signing request: FAILED"
    exit 1
  }
