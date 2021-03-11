FROM node:10-alpine

RUN apk add --no-cache nodejs npm

WORKDIR D:\docker\temp\

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8181

CMD [ "node", "server.js" ]
