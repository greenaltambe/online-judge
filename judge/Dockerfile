FROM node:20-alpine

RUN apk add --no-cache docker-cli

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN mkdir -p temp && chmod 777 temp

EXPOSE 5010

CMD ["npm", "run", "dev"]