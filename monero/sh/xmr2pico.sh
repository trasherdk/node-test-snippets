#!/bin/sh

printf "%.0f\n" `echo "1000000000000 * $1" | bc`
