# monitoring-service

## Build

```sh
docker compose -f docker-compose.dev.yaml build shared
docker compose -f docker-compose.dev.yaml build
docker compose -f docker-compose.dev.yaml up
```

## Initialize a new Microservice

**init + dependency install**

```sh
npm init -y

# Dependencies
npm install express mongoose

# Dev dependencies
npm install -D typescript ts-node nodemon @types/node @types/express
```

**package.json scripts**

```json
"scripts": {
    "dev": "nodemon --watch src --ext ts --exec ts-node src/server.ts",
    "build": "tsc -b",
    "start:prod": "node dist/server.js"
}
```
