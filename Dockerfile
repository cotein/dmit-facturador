# Utiliza una imagen base de Node.js para construir la aplicación
FROM node:20.15.0 AS build-stage

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npm run build-only

# Utiliza una imagen base de Node.js para servir la aplicación
FROM node:20.15.0 AS production-stage

# Instala http-server globalmente
RUN npm install -g http-server

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos construidos desde la etapa de construcción
COPY --from=build-stage /app/dist /app

# Expone el puerto 80
EXPOSE 80

# Comando para ejecutar http-server
CMD ["http-server", "-p", "80"]
