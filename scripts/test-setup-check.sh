#!/bin/bash

echo "🔧 テスト環境のセットアップチェックを開始します..."
echo ""

# Node.jsとnpmのバージョン確認
echo "📋 環境情報:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo ""

# 依存関係のインストール確認
echo "📦 依存関係の確認..."
if ! npm list @testing-library/react @testing-library/jest-dom jest > /dev/null 2>&1; then
    echo "❌ テスト用の依存関係が不足しています"
    echo "💡 実行してください: npm install"
    exit 1
else
    echo "✅ テスト用の依存関係が正しくインストールされています"
fi
echo ""

# Jest設定ファイルの確認
echo "⚙️ Jest設定の確認..."
if [ ! -f "jest.config.js" ]; then
    echo "❌ jest.config.js が見つかりません"
    exit 1
else
    echo "✅ jest.config.js が存在します"
fi

if [ ! -f "jest.setup.js" ]; then
    echo "❌ jest.setup.js が見つかりません"
    exit 1
else
    echo "✅ jest.setup.js が存在します"
fi
echo ""

# テストファイルの確認
echo "📝 テストファイルの確認..."
test_files=$(find __tests__ -name "*.test.*" 2>/dev/null | wc -l)
if [ $test_files -eq 0 ]; then
    echo "❌ テストファイルが見つかりません"
    exit 1
else
    echo "✅ $test_files 個のテストファイルが見つかりました"
fi
echo ""

# Huskyフックの確認
echo "🪝 Git hooksの確認..."
if [ ! -f ".husky/pre-push" ]; then
    echo "❌ pre-pushフックが設定されていません"
    exit 1
else
    echo "✅ pre-pushフックが設定されています"
fi
echo ""

# テストの実行テスト
echo "🧪 テスト実行のテスト..."
if npm run test:ci > /dev/null 2>&1; then
    echo "✅ テストが正常に実行されました"
else
    echo "❌ テストの実行に失敗しました"
    echo "💡 詳細を確認してください: npm run test:ci"
    exit 1
fi
echo ""

echo "🎉 すべてのチェックが完了しました！"
echo ""
echo "📚 使用可能なコマンド:"
echo "  npm test           - テスト実行"
echo "  npm run test:watch - ウォッチモードでテスト実行"
echo "  npm run test:ci    - CI環境でのテスト実行"
echo "  npm run pre-push   - push前チェック"
echo ""
echo "🚀 準備完了です！" 
