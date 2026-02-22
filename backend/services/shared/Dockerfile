FROM node:20 AS builder

WORKDIR /app

COPY services/shared/package.json ./
COPY services/shared/tsconfig.json ./
COPY services/shared/src ./src

RUN npm install
RUN npm run build
RUN npm pack

FROM scratch
COPY --from=builder /app/*.tgz /shared.tgz