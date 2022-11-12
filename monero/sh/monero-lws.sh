#!/bin/bash

CMD="monero-lws-daemon \
  --network stage \
  --db-path /var/lib/monero/data/stagenet/monero-lws \
  --daemon 'tcp://86.48.96.142:38082' \
  --sub 'tcp://86.48.96.142:38083'
  --log-level 2"

echo "${WHITE}* Launch ${YELLOW}monero-lws-stagenet ${RESTORE}"

screen -S "monero-lws-stagenet" \
  -d -m  bash -c "${CMD}" \
  && { echo "${GREEN} OK ${RESTORE}"; } \
  || { echo "${RED} FAILED ${RESTORE}"; }
