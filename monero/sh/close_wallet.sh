#!/bin/bash

curl -k https://86.48.96.142:38091/json_rpc \
  --digest -u 'rpc_user:abc123' \
  -d '{"jsonrpc":"2.0","id":"0","method":"close_wallet"}' \
  -H 'Content-Type: application/json'
