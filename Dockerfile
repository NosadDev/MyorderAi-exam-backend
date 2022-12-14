FROM node:16.17.0-alpine

WORKDIR /app

COPY ./ /app

RUN npm install

CMD [ "npm" ,"run","start"]
