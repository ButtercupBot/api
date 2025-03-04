FROM oven/bun AS build

WORKDIR /app

COPY package.json package.json
COPY bun.lock bun.lock
COPY tsconfig.json tsconfig.json

RUN bun install

COPY ./src ./src

ENV NODE_ENV=production

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --outfile api \
    ./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/api api

ENV NODE_ENV=production

CMD ["./api"]