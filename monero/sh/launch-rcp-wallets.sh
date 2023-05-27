#!/bin/bash

BIN="/var/lib/monero/bin/monero-wallet-rpc"
LOG_DIR="/var/lib/monero/data/stagenet/logs"
BASE="$(realpath $(dirname $0))"
CONFIG="${BASE}/src/lib/server/config/wallet-rpc.conf"

for PORT in $(seq 38090 38099)
do
  CMD="${BIN} --stagenet --rpc-bind-port ${PORT} --log-file ${LOG_DIR}/wallet-rpc-${PORT}.log --config-file ${CONFIG}"
  echo -n "${WHITE}${CMD}${RESTORE} :"
  screen -S "wallet-rpc-${PORT}" -d -m bash -c "${CMD}" \
    && echo "${LGREEN} OK ${RESTORE}" \
    || echo "${RED} FAIL ${RESTORE}"
done
