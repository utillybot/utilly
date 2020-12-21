# Build step 1
FROM node:15

# Copy package jsons for caching
WORKDIR /app
COPY ["package.json", "package-lock.json", "lerna.json", "./"]

# Copy the entire packages folder and remove anything that isn't a package.json file
COPY packages packages
RUN find packages -mindepth 2 -maxdepth 2 ! \( -name "package.json" -o -name "package-lock.json" \) -print | xargs rm -rf

# Build step 2
FROM node:15

# Copy files from previous build step aka the package jsons
WORKDIR /app
COPY --from=0 /app .

# Install dependencies
RUN npm ci
RUN npx lerna bootstrap --ci

# Copy over files
COPY . .

# Readd symlinks
RUN npx lerna bootstrap --ci

# Set production to run a production build
ENV NODE_ENV=production

RUN npm run build

RUN npm prune

CMD npm run run
