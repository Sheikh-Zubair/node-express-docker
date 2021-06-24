FROM node:14.17-slim

WORKDIR /home/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]