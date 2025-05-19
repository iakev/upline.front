FROM node:18-alpine

RUN mkdir -p /usr/upline/front && chown -R node:node /usr/upline/front

WORKDIR /usr/upline/front

USER node

COPY package.json package-lock.json ./

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3000

