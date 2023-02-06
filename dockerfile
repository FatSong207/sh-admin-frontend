# FROM node:12-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install 
# RUN npm install
# EXPOSE 8080
# CMD ["dist"]

FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:docker80
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]