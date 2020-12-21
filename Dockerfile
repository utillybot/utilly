FROM node:15

WORKDIR /app
COPY ["package.json", "package-lock.json", "lerna.json", "./"]

COPY packages packages

RUN find packages \!\( -name "package.json" -o -name "package-lock.json"\) -mindepth 2 -maxdepth 2 -print | xargs rm -rf

FROM node:15

WORKDIR /app

COPY --from=0 /app .

RUN npm ci
RUN npx lerna bootstrap --ci

COPY . .

RUN npx lerna bootstrap --ci

ENV NODE_ENV=production

RUN npm run build

RUN npm prune

CMD npm run run
