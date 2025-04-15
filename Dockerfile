FROM node:22-alpine

RUN npm install -g pnpm

ENV PNPM_HOME=/pnpm-global
ENV PNPM_STORE_PATH=/pnpm-global/store
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --dev

COPY . .

EXPOSE 3000

CMD ["pnpm", "start:dev"]
