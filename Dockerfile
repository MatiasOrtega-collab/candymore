# 1. Usar una imagen oficial de Node.js (la versión 20 es recomendada, como en tu clase)
FROM node:20-alpine

# 2. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar solo los archivos de configuración de paquetes primero (para optimizar)
COPY package*.json ./

# 4. Instalar las dependencias
RUN npm install

# 5. Copiar el resto del código del proyecto (frontend, controladores, config, etc.)
COPY . .

# 6. Comando para iniciar la aplicación en producción (usando Node, no nodemon)
CMD ["npm", "start"]