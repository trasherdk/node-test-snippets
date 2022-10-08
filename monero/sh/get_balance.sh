#!/bin/bash

curl http://86.48.96.142:38091/json_rpc \
  -d '{"jsonrpc":"2.0","id":"0","method":"get_balance","params":{"account_index":0,"address_indices":[0,1]}}' \
  -H 'Content-Type: application/json'