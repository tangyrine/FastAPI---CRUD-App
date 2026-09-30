FROM nginx:alpine

# Copy all static files into default html directory
COPY . /usr/share/nginx/html/

# Replace default config with custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]