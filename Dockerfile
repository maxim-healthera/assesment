FROM node:14-alpine3.12 as base

# Create app directory
WORKDIR /app

COPY  package*.json ./
EXPOSE 4000

# RUN npm run build

FROM base as production
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "./dist/src/index.js" ]