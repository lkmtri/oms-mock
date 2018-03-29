FROM node:latest

EXPOSE 3003

ARG node_env
ENV NODE_ENV $node_env

RUN mkdir -p /oms
WORKDIR /oms

COPY . /oms

RUN npm install

CMD npm run dev