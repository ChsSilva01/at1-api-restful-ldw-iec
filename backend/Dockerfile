# Estágio 1: Compilação (Build)
FROM node:24-alpine AS builder

# Configura o diretorio global do pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Instala o pnpm globalmente
RUN npm install -g pnpm
RUN pnpm config set strict-dep-builds false

# Copia os arquivos de manifesto e instala dependências
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --shamefully-hoist --no-frozen-lockfile

# Copia o código-fonte e realiza a compilação (gera a pasta dist)
COPY . .
RUN pnpm run build

# Remove as dependências de desenvolvimento (fica só o que a API precisa em produção)
RUN pnpm prune --prod

# Estágio 2: Produção (Runner Otimizado)
FROM node:24-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

# Copia apenas o necessário do estágio de build para rodar a API e as migrations
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/migrations ./migrations
COPY --from=builder /app/src/config/config.cjs ./config/config.cjs

# Porta padrão local (no Render a porta vem da variável PORT)
EXPOSE 3000

# Aplica as migrations e inicia a API compilada
CMD ["sh", "-c", "npx sequelize-cli db:migrate --config config/config.cjs --migrations-path migrations && node dist/server.js"]
