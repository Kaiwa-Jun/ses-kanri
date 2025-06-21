# Node.js公式イメージをベースに使用
FROM node:18-alpine

# 作業ディレクトリの設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm ci

# アプリケーションのソースコードをコピー
COPY . .

# ビルド時の環境変数設定
ENV NEXT_TELEMETRY_DISABLED 1

# ポート3000を公開
EXPOSE 3000

# アプリケーションの起動
CMD ["npm", "run", "dev"] 
