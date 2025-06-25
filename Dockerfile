# Node.js公式イメージをベースに使用（LTS v22に更新）
FROM node:22-alpine

# 作業ディレクトリの設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール（React 19対応のため--legacy-peer-depsを使用）
RUN npm ci --legacy-peer-deps

# アプリケーションのソースコードをコピー
COPY . .

# ビルド時の環境変数設定
ENV NEXT_TELEMETRY_DISABLED 1

# ポート3000を公開
EXPOSE 3000

# アプリケーションの起動
CMD ["npm", "run", "dev"] 
