# プロジェクト構成

## ディレクトリ構造

```
.
├── .kiro/
│   ├── specs/              # 仕様・要件・タスク（トピックごとにサブディレクトリ）
│   │   └── pokepoke-trade-platform/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   └── steering/           # プロダクト/組織/技術の方針や決定記録
│       ├── product.md
│       ├── tech.md
│       └── structure.md
├── apps/
│   ├── api/                # バックエンド API
│   │   ├── src/
│   │   │   ├── routes/     # API エンドポイント
│   │   │   ├── services/   # ビジネスロジック
│   │   │   ├── middleware/ # 認証・エラーハンドリング等
│   │   │   ├── types/      # TypeScript 型定義
│   │   │   └── index.ts    # エントリーポイント
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── tests/          # テストファイル
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                # フロントエンド Web アプリ
│       ├── src/
│       │   ├── app/
│       │   │   ├── pages/      # ページコンポーネント
│       │   │   ├── components/ # 再利用可能なコンポーネント
│       │   │   ├── services/   # API 呼び出しサービス
│       │   │   └── app.routes.ts
│       │   ├── assets/     # 静的ファイル
│       │   └── main.ts     # エントリーポイント
│       ├── tests/          # テストファイル
│       ├── package.json
│       └── tsconfig.json
├── AGENTS.md               # リポジトリガイドライン
└── README.md
```

## モジュール配置規則

### バックエンド (apps/api)

- **routes/**: RESTful API エンドポイント定義
  - `authRoutes.ts`, `userRoutes.ts`, `tradeOfferRoutes.ts` など
- **services/**: ビジネスロジックとデータアクセス
  - `AuthService.ts`, `UserService.ts`, `TradeOfferService.ts` など
- **middleware/**: 横断的関心事
  - `authMiddleware.ts`, `adminMiddleware.ts`, `blacklistMiddleware.ts`, `errorHandler.ts`
- **types/**: 共通型定義
  - `User.ts`, `TradeOffer.ts`, `Message.ts` など
- **prisma/**: データベーススキーマとマイグレーション

### フロントエンド (apps/web)

- **pages/**: ルートに対応するページコンポーネント
  - `LoginComponent`, `ProfileComponent`, `TradeOffersComponent` など
- **components/**: 再利用可能な UI コンポーネント
  - `CardListComponent`, `ChatBoxComponent`, `SearchBarComponent` など
- **services/**: バックエンド API との通信
  - `AuthService`, `UserService`, `TradeOfferService` など

## 命名規則

- **ファイル名:** kebab-case (例: `trade-offer.service.ts`)
- **クラス名:** PascalCase (例: `TradeOfferService`)
- **関数名:** camelCase (例: `createTradeOffer`)
- **定数:** UPPER_SNAKE_CASE (例: `MAX_CARDS_PER_OFFER`)

## インポート順序

1. 外部ライブラリ (Angular, Hono, Prisma など)
2. 内部モジュール (services, types など)
3. 相対パス (同じディレクトリ内のファイル)

## ドキュメント配置

- 仕様・要件: `.kiro/specs/<トピック名>/`
- 方針・決定記録: `.kiro/steering/`
- 画像等のアセット: 各トピック直下の `assets/` ディレクトリ
- 相対パスで参照: `![図](./assets/diagram.png)`
