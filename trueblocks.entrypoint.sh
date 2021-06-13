#!/bin/bash

sed -i "s|rpcProvider =.*|rpcProvider = \"$RPC_PROVIDER\"|" /root/.quickBlocks/quickBlocks.toml

export DOCKER_MODE=true
chifra serve
