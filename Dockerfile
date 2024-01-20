FROM node:21-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 5000

CMD yarn run dev