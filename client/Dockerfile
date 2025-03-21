# Stage 1: Build React application
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Create production environment
FROM nginx:1.21-alpine

# Copy built app from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom NGINX config if needed
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]