# Usar una imagen oficial de Node.js ligera
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de configuración de paquetes
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código del proyecto (controladores, frontend, config)
COPY . .

# Exponer el puerto que utiliza tu aplicación (ajusta al puerto real de tu app)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]