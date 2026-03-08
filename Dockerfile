FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm ci --omit=dev

FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY . .

EXPOSE 8080
CMD [ "node", "express.js" ]