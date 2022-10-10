FROM node:lts-alpine3.14 as builder

# Use /app as the CWD
WORKDIR /app

# # Copy package.json and package-lock.json to /app
COPY package*.json  ./  

# Install all dependencies
RUN yarn install && yarn cache clean --force

COPY . .

RUN yarn run build

EXPOSE 80
ENTRYPOINT [ "yarn", "run", "preview"]
CMD [ "preview" ]

# FROM builder as test
# COPY . .
# RUN npm audit

FROM nginx:stable-alpine as server

# Set node environment to production
ENV NODE_ENV production

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Add your nginx.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]