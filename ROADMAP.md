 📱 MindLog - AI日記アプリ 全体設計書

  🎯 アプリ概要

  コンセプト

  日々の出来事や気持ちを記録し、AIがあなたの性格や好みを理解して、パーソナライズされたアドバイスを提供する日記アプリ

  ターゲットユーザー

  - 日記を続けたい人
  - 自己理解を深めたい人
  - 悩みを相談したい人
  - パーソナライズされた提案が欲しい人

  ---
  🚀 ロードマップ

  🟢 MVP (Minimum Viable Product) - 1日目

  目標: 日記を書いて、AIに質問できる状態を作る

  Phase 1: プロジェクトセットアップ（30分）

  - リポジトリ作成
  - フロントエンド・バックエンド初期化
  - 基本設定（TypeScript, ESLint, etc.）

  Phase 2: データベース＆バックエンド（2〜3時間）

  - DynamoDB テーブル設計・作成
  - 日記 CRUD API 実装
    - POST /api/diaries - 日記作成
    - GET /api/diaries - 日記一覧取得
    - GET /api/diaries/:id - 日記詳細取得
    - PUT /api/diaries/:id - 日記更新
    - DELETE /api/diaries/:id - 日記削除
  - SAM template 作成・デプロイ

  学べること:
  - DynamoDB テーブル設計
  - REST API 設計
  - CRUD 操作の実装

  Phase 3: フロントエンド（日記機能）（2〜3時間）

  - 日記入力画面
  - 日記一覧画面
  - 日記詳細・編集画面
  - フォームバリデーション

  学べること:
  - React Hook Form
  - 状態管理
  - UI/UX 設計

  Phase 4: AI チャット機能（2〜3時間）

  - OpenAI API セットアップ
  - AI チャット API 実装
    - POST /api/ai/chat - AIとチャット
  - チャット画面 UI
  - ストリーミング表示

  学べること:
  - OpenAI API の使い方
  - Server-Sent Events
  - ストリーミングレスポンス
  - チャット UI 実装

  MVP 完成！ 🎉

  ---
  🟡 機能拡張 - 2日目

  Phase 5: パーソナライズ強化（2〜3時間）

  - 過去の日記を効率的に取得
  - プロンプトエンジニアリング改善
  - 気分による分析
  - よく使う言葉の分析

  学べること:
  - プロンプトエンジニアリング
  - データ分析ロジック
  - コンテキストの最適化

  Phase 6: UI/UX 改善（2〜3時間）

  - カレンダービュー
  - 気分の統計表示
  - 日記の検索機能
  - ダークモード

  学べること:
  - 高度な UI コンポーネント
  - データ可視化

  ---
  🔵 高度な機能 - 3日目以降（オプション）

  Phase 7: RAG パターン実装（3〜4時間）

  - OpenAI Embeddings API でベクトル化
  - ベクトル検索の実装
  - 関連する日記を効率的に取得

  学べること:
  - RAG (Retrieval-Augmented Generation)
  - ベクトル検索
  - 最先端の AI 技術

  Phase 8: 認証機能（2〜3時間）

  - Cognito セットアップ
  - ログイン・サインアップ
  - ユーザーごとのデータ管理

  学べること:
  - 認証フロー
  - マルチテナント設計

  Phase 9: 追加機能（各1〜2時間）

  - 画像アップロード（日記に写真を添付）
  - タグ機能
  - エクスポート機能（PDF/JSON）
  - リマインダー機能

  ---
  🏗️ 技術スタック

  フロントエンド

  - Next.js 15 (App Router)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - React Hook Form
  - Zod (バリデーション)

  バックエンド

  - Hono (API フレームワーク)
  - AWS Lambda
  - API Gateway
  - TypeScript

  データベース

  - DynamoDB
    - Diaries テーブル
    - (将来) ChatHistory テーブル

  AI

  - OpenAI API
    - GPT-3.5-turbo (MVP)
    - GPT-4 (オプション)
    - Embeddings API (Phase 7)

  インフラ

  - AWS SAM
  - CloudFormation
  - (将来) CloudFront + S3

  ---
  📁 プロジェクト構成

  mindlog/
  ├── frontend/
  │   ├── app/
  │   │   ├── (auth)/          # 認証ページ（Phase 8）
  │   │   ├── (protected)/     # 保護されたページ
  │   │   │   ├── page.tsx              # ホーム（日記一覧）
  │   │   │   ├── diary/
  │   │   │   │   ├── new/page.tsx     # 日記作成
  │   │   │   │   └── [id]/page.tsx    # 日記詳細
  │   │   │   └── chat/page.tsx        # AI チャット
  │   │   ├── layout.tsx
  │   │   └── page.tsx         # ランディングページ
  │   ├── components/
  │   │   ├── diary/
  │   │   │   ├── DiaryForm.tsx
  │   │   │   ├── DiaryList.tsx
  │   │   │   └── DiaryCard.tsx
  │   │   ├── chat/
  │   │   │   ├── ChatInterface.tsx
  │   │   │   ├── MessageBubble.tsx
  │   │   │   └── StreamingText.tsx
  │   │   └── ui/              # shadcn/ui コンポーネント
  │   ├── hooks/
  │   │   ├── useDiaries.ts
  │   │   └── useAIChat.ts
  │   ├── lib/
  │   │   └── api.ts           # API クライアント
  │   └── types/
  │       └── diary.ts
  │
  ├── backend/
  │   ├── src/
  │   │   ├── handler.ts       # Lambda エントリーポイント
  │   │   ├── routes/
  │   │   │   ├── diaryRoute.ts
  │   │   │   └── aiRoute.ts
  │   │   ├── services/
  │   │   │   ├── diaryService.ts
  │   │   │   └── aiService.ts
  │   │   ├── repositories/
  │   │   │   └── diaryRepository.ts
  │   │   ├── utils/
  │   │   │   ├── openai.ts
  │   │   │   └── logger.ts
  │   │   └── types/
  │   │       └── diary.ts
  │   ├── template.yaml        # SAM テンプレート
  │   └── package.json
  │
  ├── docs/
  │   ├── architecture.md      # アーキテクチャ設計
  │   ├── api.md              # API 仕様書
  │   └── database.md         # DB 設計書
  │
  └── README.md

  ---
  📊 データ設計

  Diaries テーブル

  {
    PK: userId#${userId}           // パーティションキー
    SK: diary#${diaryId}          // ソートキー

    // データ
    diaryId: string;              // ULID
    userId: string;               // ユーザーID
    title?: string;               // タイトル（オプション）
    content: string;              // 本文（必須）
    mood?: "happy" | "sad" | "neutral" | "excited" | "tired";
    date: string;                 // YYYY-MM-DD
    tags?: string[];              // タグ（Phase 9）
    imageUrl?: string;            // 画像URL（Phase 9）
    createdAt: string;            // ISO 8601
    updatedAt: string;            // ISO 8601
  }

  GSI (Global Secondary Index):
  - dateIndex: userId + date (ソートキー)
    - 日付順に取得

  ---
  🔌 API 設計

  日記 API
  ┌────────┬──────────────────┬──────────────┐
  │ Method │     Endpoint     │     説明     │
  ├────────┼──────────────────┼──────────────┤
  │ POST   │ /api/diaries     │ 日記作成     │
  ├────────┼──────────────────┼──────────────┤
  │ GET    │ /api/diaries     │ 日記一覧取得 │
  ├────────┼──────────────────┼──────────────┤
  │ GET    │ /api/diaries/:id │ 日記詳細取得 │
  ├────────┼──────────────────┼──────────────┤
  │ PUT    │ /api/diaries/:id │ 日記更新     │
  ├────────┼──────────────────┼──────────────┤
  │ DELETE │ /api/diaries/:id │ 日記削除     │
  └────────┴──────────────────┴──────────────┘
  AI API
  ┌────────┬──────────────┬─────────────────────┐
  │ Method │   Endpoint   │        説明         │
  ├────────┼──────────────┼─────────────────────┤
  │ POST   │ /api/ai/chat │ AI とチャット (SSE) │
  └────────┴──────────────┴─────────────────────┘
  ---
  🎯 各フェーズで学べること

  Phase 1-3: バックエンド＆フロントエンド基礎

  - ✅ プロジェクトセットアップ
  - ✅ DynamoDB 設計
  - ✅ REST API 実装
  - ✅ CRUD 操作
  - ✅ フォーム処理
  - ✅ 状態管理

  Phase 4: AI 統合

  - ✅ OpenAI API
  - ✅ Server-Sent Events
  - ✅ ストリーミングレスポンス
  - ✅ チャット UI

  Phase 5-6: 機能拡張

  - ✅ プロンプトエンジニアリング
  - ✅ データ分析
  - ✅ UI/UX 改善

  Phase 7-9: 高度な機能

  - ✅ RAG パターン
  - ✅ ベクトル検索
  - ✅ 認証
  - ✅ ファイルアップロード

  ---
  📈 開発の進め方

  今日やること（Day 1）

  1. Phase 1: プロジェクトセットアップ
  2. Phase 2: バックエンド実装
  3. Phase 3: フロントエンド（日記機能）
  4. Phase 4: AI チャット機能

  目標: MVP 完成（日記を書いて、AI に質問できる）

  明日以降

  - Phase 5-9 から好きなものを選んで実装
  - 自分で機能を考えて追加してもOK
