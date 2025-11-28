# Design Document

## Overview

ポケポケトレードプラットフォームは、ユーザーが安全にカードをトレードできるウェブアプリケーションです。このシステムは以下の主要機能を提供します：

- ポケポケユーザー ID による簡単なユーザー登録
- ユーザーのカードコレクション管理（欲しいカード・出せるカード）
- 具体的なトレード提案の作成と検索
- トレード提案に紐づくチャット機能
- 悪質ユーザーを排除するブラックリスト機能

MVP として、コア機能に焦点を当て、シンプルで拡張可能なアーキテクチャを採用します。

## Architecture

### Technology Stack

**フロントエンド:**

- Angular with TypeScript
- Angular Router for navigation
- Tailwind CSS for styling
- Vite for build tool
- Bun as package manager
- Vitest for unit tests
- Playwright for E2E tests

**バックエンド:**

- Bun runtime
- Hono (lightweight web framework)
- TypeScript
- PostgreSQL for data persistence
- Prisma ORM
- JWT for authentication
- Vitest for unit tests

**Code Quality:**

- Biome (formatter/linter)

**デプロイ:**

- Vercel (フロントエンド)
- Railway or Render (バックエンド + データベース)

### System Architecture

```
┌─────────────────┐
│   Angular SPA   │
│   (Frontend)    │
└────────┬────────┘
         │ HTTPS/REST
         │
┌────────▼────────┐
│   Hono API      │
│   (Backend)     │
└────────┬────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │
│  (via Prisma)   │
└─────────────────┘
```

### API Design

RESTful API を採用し、以下のエンドポイントを提供：

**認証:**

- POST /api/auth/register - ユーザー登録
- POST /api/auth/login - ログイン
- GET /api/auth/me - 現在のユーザー情報取得

**ユーザー:**

- GET /api/users/:userId - ユーザープロフィール取得
- GET /api/users/:userId/trade-offers - ユーザーのトレード提案一覧

**カードコレクション:**

- GET /api/users/me/cards - 自分のカードコレクション取得
- POST /api/users/me/cards/wanted - 欲しいカードを追加
- POST /api/users/me/cards/offered - 出せるカードを追加
- DELETE /api/users/me/cards/:cardId - カードを削除
- PUT /api/users/me/cards/:cardId - カード数量を更新

**トレード提案:**

- GET /api/trade-offers - トレード提案検索
- GET /api/trade-offers/:offerId - トレード提案詳細取得
- POST /api/trade-offers - トレード提案作成
- DELETE /api/trade-offers/:offerId - トレード提案削除

**チャット:**

- GET /api/trade-offers/:offerId/messages - トレード提案のメッセージ取得
- POST /api/trade-offers/:offerId/messages - メッセージ送信

**管理者:**

- GET /api/admin/blacklist - ブラックリスト取得
- POST /api/admin/blacklist - ユーザーをブラックリストに追加
- DELETE /api/admin/blacklist/:userId - ブラックリストから削除

## Components and Interfaces

### Frontend Components (Angular)

**Pages:**

- `LoginComponent` - ログイン/登録ページ
- `ProfileComponent` - ユーザープロフィールページ
- `TradeOffersComponent` - トレード提案検索・一覧ページ
- `TradeOfferDetailComponent` - トレード提案詳細・チャットページ
- `CreateTradeOfferComponent` - トレード提案作成ページ
- `AdminComponent` - 管理者ページ（ブラックリスト管理）

**Components:**

- `CardListComponent` - カード一覧表示
- `CardSelectorComponent` - カードコレクションから選択
- `TradeOfferCardComponent` - トレード提案カード表示
- `ChatBoxComponent` - チャット表示・送信
- `SearchBarComponent` - カード検索バー

**Services:**

- `AuthService` - 認証 API 呼び出し
- `UserService` - ユーザー API 呼び出し
- `CardCollectionService` - カードコレクション API 呼び出し
- `TradeOfferService` - トレード提案 API 呼び出し
- `MessageService` - メッセージ API 呼び出し
- `AdminService` - 管理者 API 呼び出し

### Backend Modules (Hono)

**Routes:**

- `authRoutes` - 認証エンドポイント
- `userRoutes` - ユーザーエンドポイント
- `cardCollectionRoutes` - カードコレクションエンドポイント
- `tradeOfferRoutes` - トレード提案エンドポイント
- `messageRoutes` - チャットエンドポイント
- `adminRoutes` - 管理者エンドポイント

**Services:**

- `AuthService` - 認証ロジック
- `UserService` - ユーザー操作
- `CardCollectionService` - カードコレクション操作
- `TradeOfferService` - トレード提案操作
- `MessageService` - メッセージ操作
- `BlacklistService` - ブラックリスト操作

**Middleware:**

- `authMiddleware` - JWT 認証チェック
- `adminMiddleware` - 管理者権限チェック
- `blacklistMiddleware` - ブラックリストチェック
- `errorHandler` - エラーハンドリング

## Data Models

### Prisma Schema

```prisma
model User {
  id              String            @id @default(uuid())
  pokepokeUserId  String            @unique
  isAdmin         Boolean           @default(false)
  isBlacklisted   Boolean           @default(false)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  cardCollections CardCollection[]
  tradeOffers     TradeOffer[]
  messages        Message[]
}

model CardCollection {
  id        String   @id @default(uuid())
  userId    String
  cardName  String
  cardType  String   // 'wanted' | 'offered'
  quantity  Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model TradeOffer {
  id        String   @id @default(uuid())
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user  User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  cards TradeOfferCard[]
  messages Message[]

  @@index([userId])
}

model TradeOfferCard {
  id           String   @id @default(uuid())
  tradeOfferId String
  cardName     String
  cardType     String   // 'wanted' | 'offered'
  quantity     Int      @default(1)
  createdAt    DateTime @default(now())

  tradeOffer TradeOffer @relation(fields: [tradeOfferId], references: [id], onDelete: Cascade)

  @@index([tradeOfferId])
  @@index([cardName])
}

model Message {
  id           String   @id @default(uuid())
  tradeOfferId String
  senderId     String
  content      String
  createdAt    DateTime @default(now())

  tradeOffer TradeOffer @relation(fields: [tradeOfferId], references: [id], onDelete: Cascade)
  sender     User       @relation(fields: [senderId], references: [id], onDelete: Cascade)

  @@index([tradeOfferId])
}
```

### TypeScript Interfaces

```typescript
interface User {
  id: string;
  pokepokeUserId: string;
  isAdmin: boolean;
  isBlacklisted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CardCollection {
  id: string;
  userId: string;
  cardName: string;
  cardType: "wanted" | "offered";
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TradeOffer {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  cards?: TradeOfferCard[];
}

interface TradeOfferCard {
  id: string;
  tradeOfferId: string;
  cardName: string;
  cardType: "wanted" | "offered";
  quantity: number;
  createdAt: Date;
}

interface Message {
  id: string;
  tradeOfferId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: ユーザー登録の成功

_For any_ 有効なポケポケユーザー ID、その ID で登録を行うと新しいユーザーアカウントが作成され、その ID でログインできる
**Validates: Requirements 1.1**

### Property 2: 重複登録の防止

_For any_ 既に登録済みのポケポケユーザー ID、その ID で再度登録を試みると拒否され、エラーメッセージが表示される
**Validates: Requirements 1.2**

### Property 3: 登録後のリダイレクト

_For any_ ユーザー、登録完了後にプロフィールページにリダイレクトされる
**Validates: Requirements 1.3**

### Property 4: 無効な ID の拒否

_For any_ 無効な形式のポケポケユーザー ID、その ID での登録は拒否され、バリデーションエラーが表示される
**Validates: Requirements 1.4**

### Property 5: ブラックリストユーザーの登録拒否

_For any_ ブラックリストに登録されたポケポケユーザー ID、その ID での登録は拒否され、エラーが表示される
**Validates: Requirements 1.5**

### Property 6: カードコレクションへの追加

_For any_ ユーザーとカード、そのカードを欲しいカードまたは出せるカードコレクションに追加すると、後でそのカードを取得できる
**Validates: Requirements 2.1, 2.2**

### Property 7: カードコレクションからの削除

_For any_ ユーザーのカードコレクションに存在するカード、そのカードを削除すると、その後の取得でそのカードは含まれない
**Validates: Requirements 2.3**

### Property 8: カードコレクションの完全表示

_For any_ ユーザー、カードコレクションを表示すると、追加した全てのカード（欲しいカードと出せるカード）が表示される
**Validates: Requirements 2.4**

### Property 9: カード数量の更新

_For any_ ユーザーのカードコレクションに存在するカード、その数量を更新すると、次回取得時に更新された数量が反映される
**Validates: Requirements 2.5**

### Property 10: トレード提案の作成と保存

_For any_ ユーザーと有効なカードリスト、欲しいカードと出せるカードを指定してトレード提案を作成すると、そのトレード提案が保存され取得できる
**Validates: Requirements 3.1, 3.3**

### Property 11: カードコレクションからの選択

_For any_ トレード提案、追加されるカードは全てユーザーのカードコレクションに存在するカードである
**Validates: Requirements 3.2**

### Property 12: トレード提案の削除

_For any_ ユーザーのトレード提案、そのトレード提案を削除すると、その後の取得でそのトレード提案は含まれない
**Validates: Requirements 3.4**

### Property 13: トレード提案の完全表示

_For any_ ユーザー、自分のトレード提案を表示すると、作成した全てのアクティブなトレード提案が表示される
**Validates: Requirements 3.5**

### Property 14: カード検索の正確性

_For any_ カード名、そのカード名で検索すると、そのカードを出せるカードとして含む全てのトレード提案（ブラックリストユーザーを除く）が返される
**Validates: Requirements 4.1**

### Property 15: ブラックリストユーザーの除外

_For any_ 検索結果、ブラックリストに登録されたユーザーのトレード提案は含まれない
**Validates: Requirements 4.2**

### Property 16: トレード提案詳細の完全表示

_For any_ トレード提案、その詳細を表示すると、欲しいカードと出せるカードの両方が全て表示される
**Validates: Requirements 4.3**

### Property 17: 検索結果の作成者情報

_For any_ 検索結果のトレード提案、各トレード提案には作成者のポケポケユーザー ID が含まれる
**Validates: Requirements 4.4**

### Property 18: ユーザープロフィールのトレード提案表示

_For any_ ユーザー、そのユーザーのプロフィールを表示すると、そのユーザーの全てのトレード提案が表示される
**Validates: Requirements 4.5**

### Property 19: ブラックリストへの追加

_For any_ ユーザー、管理者がそのユーザーをブラックリストに追加すると、そのユーザーの isBlacklisted フラグが true になる
**Validates: Requirements 5.1**

### Property 20: ブラックリストユーザーのログイン拒否

_For any_ ブラックリストに登録されたユーザー、そのユーザーがログインを試みるとアクセスが拒否され、BAN メッセージが表示される
**Validates: Requirements 5.2**

### Property 21: ブラックリストの完全表示

_For any_ 管理者、ブラックリストを表示すると、ブラックリストに登録された全てのユーザーがポケポケユーザー ID と共に表示される
**Validates: Requirements 5.3**

### Property 22: ブラックリスト登録時のトレード提案非表示

_For any_ ユーザー、そのユーザーがブラックリストに登録されると、そのユーザーの全てのトレード提案が検索結果から除外される
**Validates: Requirements 5.4**

### Property 23: ブラックリスト解除時の復元

_For any_ ブラックリストに登録されたユーザー、管理者がそのユーザーをブラックリストから削除すると、そのユーザーはログインでき、トレード提案が検索結果に表示される
**Validates: Requirements 5.5**

### Property 24: プロフィールのカードコレクション表示

_For any_ ユーザー、自分のプロフィールを表示すると、全ての欲しいカードと出せるカードが表示される
**Validates: Requirements 6.2, 6.3**

### Property 25: プロフィールのトレード提案表示

_For any_ ユーザー、自分のプロフィールを表示すると、全てのアクティブなトレード提案が表示される
**Validates: Requirements 6.5**

### Property 26: メッセージの保存と関連付け

_For any_ トレード提案とメッセージ、そのトレード提案のチャットにメッセージを送信すると、そのメッセージはトレード提案に関連付けられて保存される
**Validates: Requirements 7.2**

### Property 27: メッセージの時系列表示

_For any_ トレード提案、そのトレード提案のチャットを表示すると、関連する全てのメッセージが時系列順（作成日時順）で表示される
**Validates: Requirements 7.3**

### Property 28: ブラックリストユーザーのメッセージ送信防止

_For any_ ブラックリストに登録されたユーザー、そのユーザーがチャットでメッセージを送信しようとすると、送信が拒否される
**Validates: Requirements 7.4**

### Property 29: チャットアクセス制御

_For any_ トレード提案、そのトレード提案の作成者または過去にメッセージを送信したユーザーのみがチャット履歴にアクセスできる
**Validates: Requirements 7.5**

## Error Handling

### Client-Side Errors (4xx)

**400 Bad Request:**

- 無効なリクエストボディ
- 必須フィールドの欠落
- データ型の不一致

**401 Unauthorized:**

- JWT トークンの欠落または無効
- トークンの有効期限切れ

**403 Forbidden:**

- ブラックリストユーザーのアクセス
- 管理者権限が必要な操作
- 他のユーザーのリソースへの不正アクセス

**404 Not Found:**

- 存在しないリソースへのアクセス
- 削除済みのトレード提案へのアクセス

**409 Conflict:**

- 重複するポケポケユーザー ID での登録
- 既に存在するカードの追加

### Server-Side Errors (5xx)

**500 Internal Server Error:**

- データベース接続エラー
- 予期しないサーバーエラー

**503 Service Unavailable:**

- データベースメンテナンス中
- サービス一時停止

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Error Handling Strategy

1. **バリデーション:** リクエストデータは全てバリデーションを行い、不正なデータは早期に拒否
2. **ログ記録:** 全てのエラーはサーバーログに記録
3. **ユーザーフレンドリーなメッセージ:** エラーメッセージは日本語で分かりやすく表示
4. **セキュリティ:** 内部実装の詳細は公開しない
5. **リトライ:** 一時的なエラーの場合はリトライを推奨

## Testing Strategy

### Unit Testing

**テストフレームワーク:** Vitest

**対象:**

- Service 層の各メソッド
- バリデーション関数
- ユーティリティ関数
- Angular コンポーネントのロジック

**重要なテストケース:**

- ユーザー登録時の重複チェック
- ブラックリストユーザーのアクセス制御
- カードコレクションの追加・削除・更新
- トレード提案の作成・削除
- メッセージの保存と取得

### Property-Based Testing

**テストフレームワーク:** fast-check (JavaScript/TypeScript 用のプロパティベーステストライブラリ)

**設定:**

- 各プロパティベーステストは最低 100 回の反復実行を行う
- ランダムなテストデータを生成してプロパティを検証

**タグ付け規則:**

- 各プロパティベーステストには、設計ドキュメントの正確性プロパティへの参照をコメントで記載
- フォーマット: `// Feature: pokepoke-trade-platform, Property {number}: {property_text}`

**対象プロパティ:**

- Property 1-29: 上記の全ての正確性プロパティをプロパティベーステストで実装

**ジェネレータ戦略:**

- 有効なポケポケユーザー ID: 英数字の組み合わせ（4-20 文字）
- 無効なポケポケユーザー ID: 空文字、特殊文字のみ、長すぎる文字列
- カード名: 実在するポケポケカード名のリストからランダム選択
- メッセージ内容: 1-500 文字のランダムな文字列

### Integration Testing

**対象:**

- API エンドポイントの統合テスト
- データベースとの連携テスト
- 認証フローの統合テスト

**重要なシナリオ:**

- ユーザー登録からトレード提案作成までのフロー
- トレード提案検索からチャット開始までのフロー
- 管理者によるブラックリスト管理フロー

### End-to-End Testing

**テストフレームワーク:** Playwright

**対象:**

- ユーザーの主要なユースケース
- UI 操作からバックエンドまでの完全なフロー

**重要なシナリオ:**

- 新規ユーザー登録とプロフィール設定
- トレード提案の作成と検索
- チャットでのコミュニケーション

## Security Considerations

### Authentication

- JWT (JSON Web Token) を使用した認証
- トークンの有効期限: 24 時間
- リフレッシュトークンは実装しない（MVP）

### Authorization

- ミドルウェアによる認証チェック
- 管理者権限の検証
- リソースの所有者チェック

### Data Protection

- パスワードは保存しない（ポケポケユーザー ID のみ）
- HTTPS 通信の強制
- SQL インジェクション対策（Prisma による自動対策）
- XSS 対策（入力のサニタイズ）

### Rate Limiting

- API リクエストのレート制限
- ブルートフォース攻撃の防止

## Performance Considerations

### Database Optimization

- 適切なインデックスの設定（Prisma スキーマで定義）
- N+1 クエリ問題の回避
- コネクションプーリング

### Caching Strategy

- MVP では実装しない
- 将来的に Redis を使用したキャッシング検討

### Pagination

- トレード提案一覧: ページネーション実装（1 ページ 20 件）
- メッセージ一覧: ページネーション実装（1 ページ 50 件）

## Deployment Strategy

### Environment Variables

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
PORT=3000
NODE_ENV=production
```

### CI/CD

- GitHub Actions を使用
- プッシュ時に自動テスト実行
- main ブランチへのマージ時に自動デプロイ

### Monitoring

- エラーログの記録
- API レスポンスタイムの監視
- データベース接続状態の監視

## Future Enhancements

MVP 完了後の拡張機能候補：

1. **通知機能:** 新しいメッセージやトレード提案のマッチング通知
2. **評価システム:** ユーザーの信頼性評価
3. **トレード履歴:** 完了したトレードの記録
4. **画像アップロード:** カードの画像を添付
5. **高度な検索:** 複数カードの組み合わせ検索
6. **お気に入り機能:** トレード提案のブックマーク
7. **リアルタイムチャット:** WebSocket を使用したリアルタイム通信
