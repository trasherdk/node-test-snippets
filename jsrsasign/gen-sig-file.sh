#!/bin/bash

BASE=$(dirname $(realpath $0))
echo "Working in ${BASE}"
cd ${BASE}

TEMP="${BASE}/temp"

usage() {
  echo "${LGREEN}Usage: ${WHITE}$(basename $0) ${YELLOW}certificate-key.pem payload.txt${RESTORE}"
  exit 1
}

if [ ! -d ${TEMP} ]; then
  if ! mkdir ${TEMP};then
    echo "* Make TEMP directory failed: ${TEMP}"
    exit 1
  fi
fi

if test $# -ne 2
then
  echo "Missing key file and/or payload."
  usage
fi

if ! test -f "$1"
then
  echo "Missing key file"
  usage
fi

if ! test -f "$2"
then
  echo "Missing payload file"
  usage
fi

# generate PSS signature file. Hash of payload.
if ! openssl dgst -sha256 -binary -out ${TEMP}/$2.bin $2
then
  echo "Generate sha256 hash file failed."
  exit 1
fi

if ! openssl pkeyutl -sign \
  -in ${TEMP}/$2.bin -inkey $1 \
  -out ${TEMP}/$2.sig.bin \
  -pkeyopt digest:sha256 \
  -pkeyopt rsa_padding_mode:pss \
  -pkeyopt rsa_pss_saltlen:-1
then
  echo "Generate PSS signature file failed."
  exit 1
fi
