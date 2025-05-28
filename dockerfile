FROM node:20-alpine

WORKDIR /app/client

COPY ./client/package*.json .

RUN npm run install-legacy

COPY ./client .

RUN npm run build

WORKDIR /app/server

COPY package*.json ./

RUN npm install

COPY ./server .

RUN npm run build

EXPOSE 1905

CMD ["npm", "run", "start"]