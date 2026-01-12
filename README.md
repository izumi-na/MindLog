# MindLog

📱 MindLog - AI日記アプリ

## 概要

日々の出来事や気持ちを記録し、AIが利用者の性格や好みを理解して、パーソナライズされたアドバイスを提供する日記アプリ

## ターゲットユーザー

  - 自己理解を深めたい人
  - 悩みを相談したい人
  - パーソナライズされた提案が欲しい人

## 主な機能

- 日記登録機能
- AIによる提案機能

## 技術スタック

### フロントエンド

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

### バックエンド

- Hono (API フレームワーク)
- AWS Lambda (Node.js 24 + TypeScript)
- API Gateway
- AWS SAM (アプリケーション層の IaC)

### インフラ

- AWS (Cognito, S3, CloudFront, Lambda, API Gateway, DynamoDB)
- **Terraform + SAM ハイブリッド構成**
  - Terraform: 長期インフラ（Cognito, S3, CloudFront）
  - SAM: アプリケーション層（Lambda, API Gateway, DynamoDB）
- GitHub Actions (CI/CD)

### AI

- OpenAI API

## プロジェクト構成

```
MindLog/
├── frontend/        # Next.js フロントエンド
├── backend/         # SAM プロジェクト (Lambda + API Gateway + DynamoDB)
│   ├── src/
│   ├── template.yaml
│   └── samconfig.toml
├── terraform/       # 長期インフラ（Cognito, S3, CloudFront）
├── .github/         # GitHub Actions
└── README.md        # このファイル
```

## 開発コマンド


### ルートで実行
```bash
# フォーマット
pnpm format
# リント
pnpm lint
```

### バックエンド
```bash
# 型チェック
pnpm type-check
# ビルド
pnpm sam:build:dev
# デプロイ（開発環境）
sam deploy --config-env dev
```

### フロントエンド
```bash
# 開発サーバー起動
pnpm dev
```

## ライセンス

UNLICENSED
