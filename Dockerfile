FROM node:18-alpine AS build

ARG REACT_APP_BOT_USERNAME=berloganowbot
ARG REACT_APP_BACKEND_URL=https://now.berloga.dev/yandex
ENV REACT_APP_BOT_USERNAME=$REACT_APP_BOT_USERNAME
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 300000

COPY . .
RUN yarn build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
