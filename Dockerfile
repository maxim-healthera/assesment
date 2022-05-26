FROM node:14-alpine3.12 as base
WORKDIR /app

COPY  package*.json ./
EXPOSE 4000
ARG config

RUN npm install
COPY . .
COPY ${config} .env
RUN npm run build
CMD ["node", "./dist/src/index.js" ]