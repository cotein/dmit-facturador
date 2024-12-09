FROM node:20.15.0

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
