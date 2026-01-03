# Implementation Plan (2 ストリーム並列用)

## Stream A: Backend (API / Hono)

- [x] A1. バックエンド基盤セットアップ（元 Step2）
  - Hono 初期化、Prisma セットアップ、環境変数雛形
  - _Requirements: 全体_
- [x] A2. Prisma スキーマ実装（元 Step2.1）
  - User, CardCollection, TradeOffer, TradeOfferCard, Message 定義とリレーション
  - マイグレーション実行
  - _Requirements: 全体_
- [x] A3. 認証ミドルウェア（元 Step2.3）
  - JWT 生成/検証、auth/admin/blacklist middleware
  - _Requirements: 1.1, 5.2, 7.4_
- [x] A4. 認証機能（元 Step3, 3.1）
  - AuthService と /api/auth/register, /login, /me
  - ポケポケ ID バリデーション
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
- [x] A5. ユーザー/カード/トレード API（元 Step4, 5, 6）
  - UserService, CardCollectionService, TradeOfferService
  - CRUD・ステータス管理・コレクション選択ロジック
  - _Requirements: 2.x, 3.x, 4.5, 6.1_
- [x] A6. 検索・ブラックリスト・チャット API（元 Step7, 8）
  - 検索ロジック、ブラックリスト反映、チャットメッセージ保存/取得
  - _Requirements: 4.x, 7.x_
- [ ] A7. プロパティベーステスト（元 Step2.2, 2.4, 3.1*, 4.1*, 5.1*, 6.1*, 7.1\*）
  - Property 1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20 を該当 API 実装とセットで追加
  - fast-check で 100 回以上

## Stream B: Frontend (Web / Next.js)

- [ ] B1. フロント基盤
  - ルーティング（app.routes）、レイアウト骨組み、デザイン基準（Tailwind/スタイル変数）
  - API base URL 設定
- [ ] B2. 認証フロー UI
  - ログイン/登録フォーム、状態管理、エラーハンドリング
  - バックエンド A4 の契約に従う
- [ ] B3. プロフィール/コレクション UI
  - 欲しい/出せるカード表示・追加・削除・数量更新
  - _Requirements: 2.x, 6.x_
- [ ] B4. トレード提案 UI
  - 作成/一覧/詳細/削除、ステータス表示
  - _Requirements: 3.x, 4.5_
- [ ] B5. 検索 UI
  - カード名検索、ページネーション、ブラックリスト除外表示
  - _Requirements: 4.1–4.4_
- [ ] B6. チャット UI
  - 提案単位のチャット画面、時系列表示、送信フォーム
  - SSE で新着メッセージをリロードなしで反映
  - _Requirements: 7.x_
- [ ] B7. テスト

  - Vitest (+ React Testing Library) コンポーネント統合テスト
  - Playwright E2E（ログイン → 検索 → 提案閲覧のゴールデンパス）
  - API スタブ/モックでバックエンド未完時も進行可能

- [ ]\* 8.1 Property 26, 27, 28, 29 のプロパティベーステスト

  - **Property 26: メッセージの保存と関連付け**
  - **Property 27: メッセージの時系列表示**
  - **Property 28: ブラックリストユーザーのメッセージ送信防止**
  - **Property 29: チャットアクセス制御**
  - **Validates: Requirements 7.2, 7.3, 7.4, 7.5**

- [ ] 9. 管理者機能の実装

  - BlacklistService の実装
  - 管理者エンドポイントの実装（GET /api/admin/blacklist, POST /api/admin/blacklist, DELETE /api/admin/blacklist/:userId）
  - ブラックリスト追加時のトレード提案非表示処理
  - ブラックリスト解除時の復元処理
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]\* 9.1 Property 19, 21, 22, 23 のプロパティベーステスト

  - **Property 19: ブラックリストへの追加**
  - **Property 21: ブラックリストの完全表示**
  - **Property 22: ブラックリスト登録時のトレード提案非表示**
  - **Property 23: ブラックリスト解除時の復元**
  - **Validates: Requirements 5.1, 5.3, 5.4, 5.5**

- [ ] 10. エラーハンドリングの実装

  - エラーハンドリングミドルウェア
  - 統一されたエラーレスポンス形式
  - バリデーションエラーの処理
  - _Requirements: 全体_

- [ ] 11. チェックポイント - バックエンドテスト確認

  - すべてのテストが通ることを確認
  - 質問があればユーザーに確認

- [ ] 12. フロントエンド基盤の構築

  - Next.js プロジェクトの初期化
  - Tailwind CSS のセットアップ
  - Next.js App Router の設定
  - 環境変数の設定
  - _Requirements: 全体_

- [ ] 13. 認証サービスとガードの実装

  - AuthService の実装（API 呼び出し）
  - JWT トークンの保存と管理
  - AuthGuard の実装（ルート保護）
  - AdminGuard の実装（管理者ルート保護）
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]\* 13.1 Property 3 のプロパティベーステスト

  - **Property 3: 登録後のリダイレクト**
  - **Validates: Requirements 1.3**

- [ ] 14. ログイン・登録ページの実装

  - LoginComponent の実装
  - 登録フォームとバリデーション
  - ログインフォーム
  - エラーメッセージ表示
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 15. プロフィールページの実装

  - ProfileComponent の実装
  - カードコレクション表示（CardListComponent）
  - カード追加・削除機能
  - トレード提案一覧表示
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]\* 15.1 Property 24, 25 のプロパティベーステスト

  - **Property 24: プロフィールのカードコレクション表示**
  - **Property 25: プロフィールのトレード提案表示**
  - **Validates: Requirements 6.2, 6.3, 6.5**

- [ ] 16. カードコレクション管理機能の実装

  - CardCollectionService の実装（API 呼び出し）
  - CardSelectorComponent の実装
  - カード追加・削除・更新の UI
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ] 17. トレード提案作成ページの実装

  - CreateTradeOfferComponent の実装
  - カードコレクションからの選択 UI
  - 欲しいカード・出せるカードの指定
  - トレード提案の保存
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 18. トレード提案検索・一覧ページの実装

  - TradeOffersComponent の実装
  - SearchBarComponent の実装
  - TradeOfferCardComponent の実装
  - ページネーション機能（検索結果は active のトレード提案のみ）
  - _Requirements: 4.1, 4.2, 4.4_

- [ ] 19. トレード提案詳細・チャットページの実装

  - TradeOfferDetailComponent の実装
  - ChatBoxComponent の実装
  - メッセージ送信機能
  - メッセージ一覧表示（時系列）
  - _Requirements: 4.3, 7.1, 7.2, 7.3, 7.5_

- [ ] 20. 管理者ページの実装

  - AdminComponent の実装
  - ブラックリスト一覧表示
  - ユーザーのブラックリスト追加・削除機能
  - _Requirements: 5.1, 5.3, 5.5_

- [ ] 21. エラーハンドリングとユーザーフィードバック

  - エラーメッセージの表示
  - ローディング状態の表示
  - 成功メッセージの表示
  - _Requirements: 全体_

- [ ]\* 22. E2E テストの実装

  - Playwright のセットアップ
  - ユーザー登録からトレード提案作成までのフロー
  - トレード提案検索からチャット開始までのフロー
  - 管理者によるブラックリスト管理フロー
  - _Requirements: 全体_

- [ ] 23. 最終チェックポイント
  - すべてのテストが通ることを確認
  - 質問があればユーザーに確認
