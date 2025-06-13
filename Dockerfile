FROM node:alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY ./resources ./resources

RUN npm install

COPY . ./

CMD ["npm", "start"]
