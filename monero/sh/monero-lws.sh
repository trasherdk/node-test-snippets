#!/bin/bash

BASE=$(realpath $(dirname $0))
cd $BASE

source "../../.env.stagenet"
echo "Remote: ${MONERO_HOST}:${MONERO_ZMQ_RPC_PORT}"

case ${MONERO_NET} in
  mainnet) MONERO_NET="main" ;;
  testnet) MONERO_NET="test" ;;
  stagenet) MONERO_NET="stage"
esac

CMD="monero-lws-daemon \
  --network ${MONERO_NET} \
  --db-path /var/lib/monero/data/stagenet/monero-lws \
  --daemon 'tcp://${MONERO_HOST}:${MONERO_ZMQ_RPC_PORT}' \
  --sub 'tcp://${MONERO_HOST}:${MONERO_ZMQ_SUB_PORT}' \
  --log-level 4"

echo "$CMD"
echo -n "${WHITE}* Launch ${YELLOW}monero-lws-stagenet: ${RESTORE}"

screen -S "monero-lws-stagenet" \
  -d -m  bash -c "${CMD}" \
  && { echo "${GREEN} OK ${RESTORE}"; } \
  || { echo "${RED} FAILED ${RESTORE}"; }