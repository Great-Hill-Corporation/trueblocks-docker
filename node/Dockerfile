FROM node:latest
RUN git clone https://github.com/TrueBlocks/trueblocks-explorer.git /trueblocks-explorer
WORKDIR /trueblocks-explorer
RUN git checkout develop
RUN yarn install
