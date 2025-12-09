# Usar imagem oficial do Node
FROM node:20

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

EXPOSE 80

# Rodar o modo dev
CMD ["npm", "run", "dev", "--", "--host", "--port", "80"]