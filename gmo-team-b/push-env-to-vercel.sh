#!/bin/bash

# .env.localファイルの内容をVercelの環境変数にプッシュするスクリプト

echo "Vercelの環境変数に.env.localの内容をプッシュしています..."

# .env.localファイルから各行を読み取り、Vercelの環境変数に設定
while IFS='=' read -r key value; do
    # 空行やコメント行をスキップ
    if [[ -n "$key" && ! "$key" =~ ^# ]]; then
        echo "設定中: $key"
        # 値から引用符を削除
        value=$(echo "$value" | sed 's/^"//;s/"$//')
        # Vercelの環境変数に設定（production環境）
        echo "$value" | vercel env add "$key" production
    fi
done < .env.local

echo "環境変数の設定が完了しました！" 