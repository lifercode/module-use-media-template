FROM node:18
WORKDIR /usr/src/app
COPY package*.json *.js ./
RUN npm install
EXPOSE 3050
CMD ["node", "app.js"]