# Librerias para que mi app funcione (a nivel sistema)
FROM node:lts-alpine

# En este directorio se almacenara todos los archivos para que mi app funcione (CONTAINER)
WORKDIR /app

# Copiar archivos package en el directorio app (a nivel de la app)
COPY package*.json ./

# necesito del comando npm install
RUN npm install

# Ahora es necesario copiar todos los archivos
# . copia todo lo almacenado en mi carpeta principal
# . pega todo lo copiado en mi directorio actual, i.e en ./app
COPY . .

# Necesitamos ignorar el archivo node_modules => creamos un archivo con el nombre ".dockerignore"


# SE EXPONE EL PUERTO DEL CONTENEDOR
EXPOSE 8080
# Ahora es necesario ejecutar el proyecto <1>
CMD ["npm", "run", "serve"]

# Para que <1> se ejectute necesitamos una imagen
# COMANDO CONSOLA: docker build -t <nombre de la imagen> .