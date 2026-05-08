FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Exponer puerto
EXPOSE 5173

# Comando de inicio (preview mode para producción)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
