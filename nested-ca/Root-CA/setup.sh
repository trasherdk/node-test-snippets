#!/bin/bash

BASE=$(dirname $(realpath $0))

echo "Working in ${BASE}"

cd ${BASE}

DIRS="CA
certs
crl
newcerts
private"

for DIR in ${DIRS}
do
  echo "directory: ${BASE}/${DIR}"
  if [ ! -d "${BASE}/${DIR}" ]; then
    mkdir "${BASE}/${DIR}"
  fi
done
exit
chmod 700 private
if [ ! -f ${BASE}/index.txt ]; then
  touch index.txt
  echo 1000 > serial
fi


