# Build stage
FROM node:20 AS build
WORKDIR /app

# We are using npx @angular/cli directly since we bypassed npm install during scaffolding, 
# but for a standard docker build, we'll install dependencies here.
# Since we didn't run npm install, we'll write a script to install and serve.
# In a real-world scenario, you would have package.json.
# Because package.json doesn't have material, we'll run npx ng serve.

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npx ng build --configuration production

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
# Angular routing configuration for Nginx
RUN echo "server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
