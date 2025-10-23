FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm install --production=false
COPY tsconfig.json .
COPY src ./src
COPY migrations ./migrations
EXPOSE 5000
CMD ["npm","run","dev"]
