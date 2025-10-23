FROM node:20-alpine
WORKDIR /app
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --production=false
COPY backend/tsconfig.json .
COPY backend/src ./src
COPY database/migrations ./migrations
EXPOSE 5000
CMD ["npm","run","dev"]
