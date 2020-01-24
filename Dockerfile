# FROM hypriot/rpi-node:latest # not linux containers
# FROM node:alpine # not linux containers
FROM ubuntu:18.04

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN apt-get update && apt-get install -y apt-transport-https apt-utils
RUN apt-get install -y ffmpeg
RUN apt-get install python3.5
RUN npm install

COPY . /usr/src/bot
CMD ["node","index.js"]