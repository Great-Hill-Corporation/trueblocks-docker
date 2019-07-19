FROM python@sha256:99a39f3907ab81c7800eb7f9bcfa28475d9b081133615c6fa86616a7d14bf2af as builder

WORKDIR /root

RUN curl https://dl.google.com/go/go1.12.7.linux-amd64.tar.gz --output go1.12.7.linux-amd64.tar.gz && \
	tar -C /usr/local -xzf go1.12.7.linux-amd64.tar.gz && \
	ln -s /usr/local/go/bin/* /usr/local/bin/

RUN apt-get update && \
	apt-get install -y \
	build-essential \
	cmake \
	git \
	nano \
	libcurl3-dev

ADD https://api.github.com/repos/Great-Hill-Corporation/trueblocks-core/git/refs/heads/develop version.json
RUN git clone -b 'develop' --single-branch --progress \ 
	https://github.com/Great-Hill-Corporation/trueblocks-core \
	/root/quickBlocks-src

RUN cd /root/quickBlocks-src && \
	mkdir -v build /root/.quickBlocks && \
	cd build && \
	bash ../src/other/install/docker/clean_for_docker.sh && \
	cmake ../src && \
	make

RUN find ../../trueblocks-core/. -name "*.cpp" -exec grep -His "COption(" {} \; > /root/trueblocksOptions

FROM node@sha256:9dfb7861b1afc4d9789e511f4202ba170ac7f4decf6a2fc47fab33a9ce8c0aab as templateParser
WORKDIR /root
COPY --from=builder /root/trueblocksOptions /root/trueblocksOptions
COPY template-parser /root/template-parser
RUN cd /root/template-parser && \
	npm install && \
	cat /root/trueblocksOptions | node index.js && \
	node ./node_modules/snowboard/lib/main.js html -o docs.html ../apiary.generated.apib

FROM node@sha256:9dfb7861b1afc4d9789e511f4202ba170ac7f4decf6a2fc47fab33a9ce8c0aab as base
WORKDIR /root

RUN apt-get update && apt-get install -y libcurl3-dev python procps
COPY api /root/api
COPY --from=templateParser /root/template-parser/docs.html /root/api/docs.html
COPY --from=templateParser /root/template-parser/server.generated.js /root/api/server.js
COPY --from=builder /root/quickBlocks-src/bin /usr/local/bin
COPY --from=builder /root/.quickBlocks /root/.quickBlocks
RUN cd /root/api && \
	npm install && \
	npm install -g forever && \
	mkdir /root/.quickBlocks/monitors
COPY trueblocks.entrypoint.sh /root

EXPOSE 80

ENTRYPOINT bash /root/trueblocks.entrypoint.sh
