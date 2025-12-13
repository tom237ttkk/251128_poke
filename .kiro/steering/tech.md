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
```

## プロパティベーステスト規則

- fast-check を使用
- 各テストは最低 100 回の反復実行
- タグ付けフォーマット: `// Feature: pokepoke-trade-platform, Property {number}: {property_text}`
- 設計ドキュメントの正確性プロパティと対応させる
