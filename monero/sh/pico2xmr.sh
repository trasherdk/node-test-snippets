#!/bin/sh

printf '%.12f\n' `echo "0.000000000001 * $1" | bc` | awk 'sub("\\.*0+$","")'
