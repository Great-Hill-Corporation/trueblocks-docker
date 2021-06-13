#!/bin/bash

CONFIG_FILE=/root/.local/share/trueblocks/trueBlocks.toml

# write the RPC provider to quickBlocks.toml
if grep -q rpcProvider "$CONFIG_FILE"; then
    sed -i "s|rpcProvider =.*|rpcProvider = \"$RPC_PROVIDER\"|" $CONFIG_FILE
else
    echo "Writing RPC provider for the first run"
    echo "rpcProvider = \"$RPC_PROVIDER\"" >> $CONFIG_FILE
fi

export DOCKER_MODE=true
chifra serve
