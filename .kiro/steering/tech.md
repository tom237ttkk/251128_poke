# 技術スタック

## フロントエンド

- **フレームワーク:** Next.js with TypeScript
- **ルーティング:** Next.js App Router
- **スタイリング:** Tailwind CSS
- **ビルドツール:** Vite
- **パッケージマネージャー:** Bun
- **テスト:** Vitest (unit), Playwright (E2E)

## バックエンド

- **ランタイム:** Bun
- **フレームワーク:** Hono (lightweight web framework)
- **言語:** TypeScript
- **データベース:** PostgreSQL
- **ORM:** Prisma
- **認証:** JWT
- **テスト:** Vitest (unit)

## コード品質

- **フォーマッター/リンター:** Biome

## 共通コマンド

### 開発

```bash
# フロントエンド開発サーバー起動
cd apps/web
bun run dev

# バックエンド開発サーバー起動
cd apps/api
bun run dev
```

### テスト

```bash
# ユニットテスト実行
bun test

# E2E テスト実行
bun run test:e2e

# プロパティベーステスト実行
bun run test:property
```

### ビルド

```bash
# フロントエンドビルド
cd apps/web
bun run build

# バックエンドビルド
cd apps/api
bun run build
```

### データベース

```bash
# Prisma マイグレーション生成
cd apps/api
bunx prisma migrate dev

# Prisma スキーマ同期
bunx prisma db push

# Prisma Studio 起動
bunx prisma studio
```

### コード品質

```bash
# Biome フォーマット
bun run format

# Biome リント
bun run lint

# Markdown チェック（任意）
npx prettier --check "**/*.md"
npx markdownlint **/*.md
```

## 環境変数

### バックエンド (.env)

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
PORT=3000
NODE_ENV=development
REDIS_URL=redis://localhost:6379
REDIS_CHANNEL=trade:messages
```

`REDIS_URL` は任意。設定すると SSE の新着メッセージ配信が Redis pub/sub 経由でも中継され、複数 API インスタンス構成でも配信できる。`REDIS_CHANNEL` は省略時 `trade:messages`。

## プロパティベーステスト規則

- fast-check を使用
- 各テストは最低 100 回の反復実行
- タグ付けフォーマット: `// Feature: pokepoke-trade-platform, Property {number}: {property_text}`
- 設計ドキュメントの正確性プロパティと対応させる
