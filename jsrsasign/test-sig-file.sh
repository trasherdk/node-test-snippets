#!/bin/bash

BASE=$(dirname $(realpath $0))
echo "Working in ${BASE}"
cd ${BASE}

TEMP="${BASE}/temp"

pubFile="${BASE}/ca/server-crt.pem"
pubKey="${TEMP}/pubkey.pem"
sigFile="${TEMP}/message.txt.sig.bin"
payload="${BASE}/message.txt"

[ -f ${pubFile} ] || echo "Missing ${pubFile}"
[ -f ${sigFile} ] || echo "Missing ${sigFile}"
[ -f ${payload} ] || echo "Missing ${payload}"

openssl x509 -pubkey -noout -in ${pubFile} > ${pubKey}

if openssl dgst -sha256 -verify \
   ${pubKey} \
  -signature ${sigFile} \
  -sigopt rsa_padding_mode:pss \
  -sigopt rsa_pss_saltlen:-2 \
  ${payload}
then
  echo "Payload verification OK"
else
  echo "Payload verification FAILED"
fi
