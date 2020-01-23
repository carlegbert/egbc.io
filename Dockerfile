FROM node:12-alpine3.10

RUN apk add \
    python3 \
    g++ \
    make

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci