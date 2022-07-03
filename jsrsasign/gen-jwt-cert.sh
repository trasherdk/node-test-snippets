#!/bin/bash

BASE=$(dirname $(realpath $0))
echo "Working in ${BASE}"
cd ${BASE}

CA="${BASE}/ca"
TEMP="${BASE}/temp"

openssl ecparam -genkey -name prime256v1 -noout -out "${CA}/private-jwt-key.pem" || exit 1

openssl ec -in "${CA}/private-jwt-key.pem" -pubout -out "${CA}/public-jwt-key.pem" || exit 1
