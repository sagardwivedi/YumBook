FROM node:20-alpine AS build-stage

WORKDIR /app


COPY package*.json /app/

RUN bun install

COPY ./ /app/

RUN npm run build

RUN npm start
