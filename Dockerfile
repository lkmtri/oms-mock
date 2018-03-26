FROM node:latest

EXPOSE 3003

RUN mkdir -p /oms
WORKDIR /oms

COPY . /oms

RUN npm install

CMD npm run dev