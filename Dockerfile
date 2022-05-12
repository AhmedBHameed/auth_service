FROM node:14-alpine as builder

# Switch to rootless user node (included in the node image)
USER node

# Workdir
RUN mkdir -p /home/node/auth_service && chown -R node:node /home/node/auth_service
RUN mkdir -p /home/node/auth_service/build && chown -R node:node /home/node/auth_service/build
WORKDIR /home/node/auth_service

COPY ./auth_service/package*.json ./

RUN npm install
COPY --chown=node:node ./auth_service ./

COPY ./auth_service .