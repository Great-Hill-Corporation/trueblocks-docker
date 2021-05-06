# TrueBlocks Docker
<i>last updated: 2021-02-22</i>

![Image Logo](https://avatars1.githubusercontent.com/u/19167586?s=200&v=4)

[![Website trueblocks.io](https://img.shields.io/badge/Website-quickblocks.io-brightgreen.svg)](https://quickblocks.io/)
[![Docker](https://img.shields.io/badge/trueblocks-docker-blue.svg)](https://github.com/Great-Hill-Corporation/trueblocks-docker)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Twitter](https://img.shields.io/twitter/follow/espadrine.svg?style=social&label=Twitter)](https://twitter.com/quickblocks?lang=es)


The TrueBlocks indexer extracts address appearances from Ethereum chains and creates a lightweight, partitione index, which makes queries for particular addresses directly from the node trustless and fast.

trueblocks-docker is a docker image containing an installation of indexer and a simple API that allows you to control the indexing process.

## Prerequisite

- **You must be already running an Ethereum node with `--tracing` enabled.** (see [Running A Node](#how-do-you-recommned-I-run-a-node))

## Getting started

- Set the `RPC_PROVIDER` variable to your RPC endpoint (see ["Before running"](#before-running))
- Start the TrueBlocks docker container with `docker-compose up -d`
- Wait for TrueBlocks to build its cache. ([Why does this take so long?](#why-does-it-take-so-long-to-build-the-index))
- [Query TrueBlocks for a list of transactions on your accounts](#using-the-api)

## Requirements

- A running, syncing Parity Ethereum node with `--tracing on` enabled (see [Running A Node](#how-do-you-recommned-I-run-a-node))
- Time (see [Why Does It Take So Long To Build The Index?](#why-does-it-take-so-long-to-build-the-index))
- git, docker, docker-compose (see [Prerequisites](#prerequisites))

## Installation

The following instructions are for building on your local machine. Running on DappNode? See 
our [Dappnode Instructions](#dappnode-instructions).

```
git clone https://github.com/Great-Hill-Corporation/trueblocks-docker.git
cd trueblocks-docker
docker-compose build
```

## Before running

Before you bring the TrueBlocks docker container up, take the time to configure the following options:
- what port do you want to run the trueblocks api server on? Set this in .env file. Right now, the ports line reads 80:80. If you want to change this from port 80 to, say, 8181, then change this to 8181:80.
- If you are running TrueBlocks on your computer, copy trueblocks.local.env.example as trueblocks.local.env.
- What is your node's RPC endpoint? Set your RPC endpoint in the **trueblocks.local.env**, or if running on DAppNode **trueblocks.public.dappnode.eth.env**, file to `RPC_PROVIDER=http://your-rpc-provider:port`. Note that finding your RPC endpoint can initially be quite difficult (see [What is my RPC endpoint?](#what-is-my-rpc-endpoint)).
- Now you're ready to run trueblocks!

## First run

Bring the container up:

```
docker-compose up -d
```

There are 2 modes of operation for trueblocks: scrape and leech.

- **scrape**: scrape the entire Ethereum chain and build the TrueBlocks address index from scratch.
- **leech**: instead of building the TrueBlocks address index, download it from a 3rd party.

More about scraping vs leeching.

## Getting your data

Now we assume that you have part of the TrueBlocks address index.

### Using the API

From your host machine, you can direct curl commands to your TrueBlocks docker container's http server (default port 80) in order to get your data.

Examples:

- Get all JSON exported for specific address:
    - `curl http://localhost/export?address=0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359`
- Get `{blockNumber, txIndex}` appearances for specific address: `curl http://localhost/list?address=0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359`


### Prerequisites

| component | notes |
|-----------|-------|
| git       | Install the command line tool. [Instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|
| docker    | Install *docker* ([Instructions](https://docs.docker.com/engine/installation)).<br>- The community edition of docker (`docker-ce`) works fine.<br>- On Linux, grant permission to the current user to run docker (`sudo usermod -aG docker $USER`). |
| docker-compose | Install [docker-compose](https://docs.docker.com/compose/install) |

**Note**: Make sure that you are able to run `git`, `docker ps`, `docker-compose` without issue, and that you can do so without using the `sudo` command. (see [Troubleshooting](#troubleshooting))

## Helpful commands

### Start the TrueBlocks Docker Image
```
$ docker-compose up -d
```

### Stop
```
$ docker-compose down
```

### Status
```
$ docker-compose ps
```

### Logs
```
$ docker-compose logs -f
```

### Clearing the Docker Cache
```
#!/usr/bin/env bash

docker ps -q | xargs docker kill
docker ps --filter=status=exited --filter=status=created -q | xargs docker rm
docker rmi $(docker images -a -q)
docker volume rm trueblocks-docker_trueblocks_data
```

## Running on DappNode

Building and running the TrueBlocks docker image is taken care of by the dAppNode package manager. If you are running a dAppNode, you can simply install the package from the dAppNode package manager.

Note: your DappNode doesn't run Parity with `--tracing=on` by default. Set `EXTRA_OPTS=--tracing on` in the dappnode admin panel ([image](https://user-images.githubusercontent.com/21328788/52904014-04ab6c00-3226-11e9-8c47-747a42b22169.png)) or setting it in DNP_ETHCHAIN's ethchain.dnp.dappnode.eth.env file (see [Why do we need --tracing enabled?](#why-do-we-need-tracing-enabled))

## FAQ

### I'm running geth, do I need to run Parity instead?
Yes - Parity delivers the necessary articulated traces so that TrueBlocks can build its address index. We don't yet support Geth.

### What is my RPC endpoint?

That depends on how you've configured your parity node. some endpoints that we use are http://172.17.0.1:8545 (when running node on linux host), http://docker.for.mac.localhost:8545 (when running node on mac host), and http://my.ethchain.public.dappnode.eth:8545 (when running node on dappnode). http://localhost:8545 is a common guess, but docker has its own networking paradigm; don't be surprised if this RPC endpoint choice doesn't yield results.

Parity's default http RPC port is 8545, but your node could be configured differently.

### Why does it take so long to build the index?
TrueBlocks has to manually process every single block in the history of the Ethereum chain. Additionally, it has to descend into every transaction trace. Often, traces are deeply layered (traces of traces of traces of ... traces), and this takes time to 1) fetch from your node's RPC and 2) extract addresses.

### Why do we need tracing enabled?

By visiting every bit of the Ethereum data including blocks, transactions, receipts, logs, traces, trace actions, and trace results for every block, TrueBlocks is able to extract every 'appearance' of an address on the blockchain. TrueBlocks can only do this with a tracing node.

### How do you recommend I run a node?

You can run a node with the [DNP_ETHCHAIN](https://github.com/dappnode/DNP_ETHCHAIN) package - set `EXTRA_OPTS=--tracing on` in the dappnode admin panel or setting it in DNP_ETHCHAIN's ethchain.dnp.dappnode.eth.env file (see [Why do we need --tracing enabled?](#why-do-we-need-tracing-enabled))

Otherwise, in order for TrueBlocks to work properly, you need to start parity with at least the following options:

```
parity --tracing on --jsonrpc-cors all --jsonrpc-hosts all --db-compaction=ssd 
```

`--db-compaction=ssd` is optional, but Parity recommends using an SSD drive for storing its data. Enabling `--tracing on` requires a re-sync of your node.

We also recommend (although, this is optional) that you specify an alternative path to store Parity's data (this will also require a re-sync of your node). We suggest an external 4TB SSD.

```
--db-path=/path/to/larger/hard/drive/      ; optionally add to the command line
```

Finally, TrueBlocks works equally with both tracing and archive nodes. You may start Parity as an archive node by adding the following option:

```
--pruning archive                          ; optionally add to the command line
```

(You will definitely want to use a larger hard drive in this case.)

## Troubleshooting

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Thomas Jay Rush** - [tjayrush](https://github.com/tjayrush)
* **Ed Mazurek** - [wildmolasses](https://github.com/wildmolasses)

See also the list of [contributors](https://github.com/Great-Hill-Corporation/trueblocks-docker/contributors) who participated in this project.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details

## References

[git](https://git-scm.com/)

[docker](https://www.docker.com/)

[docker-compose](https://docs.docker.com/compose/)

[TrueBlocks](https://www.quickblocks.io/)
