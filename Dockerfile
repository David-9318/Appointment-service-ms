FROM node:24-alpine

WORKDIR /app

# Copiar archivos de dependencias para aprovechar el caché
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

ARG PORT=3003
EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]
