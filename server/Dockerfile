# Copies in our code and runs NPM Install
FROM node:14.8.0-alpine as builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install --verbose
COPY . .

# Runs Unit Tests
FROM node:14.8.0-alpine as unit-tests
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ .
RUN npm install -g jest
CMD ["npm", "run", "test:watch"]

# Starts and Serves Web Page
FROM node:14.8.0-alpine as serve
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ .
CMD ["npm", "start"]