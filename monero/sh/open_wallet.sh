#!/bin/bash

curl -k -vv https://86.48.96.142:38091/json_rpc \
  --tlsv1.2 --tls-max 1.2 \
  --digest -u 'rpc_user:abc123' \
  -d '{"jsonrpc":"2.0","id":"0","method":"open_wallet","params":{"filename":"userwallet","password":"5l1nger"}}' \
  -H 'Content-Type: application/json'

