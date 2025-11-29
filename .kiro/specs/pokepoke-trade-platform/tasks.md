# Implementation Plan

- [ ] 1. プロジェクト構造とツールのセットアップ

  - モノレポ構造でフロントエンド（Angular）とバックエンド（Hono）を作成
  - Bun をパッケージマネージャーとして設定
  - Biome を formatter/linter として設定
  - 基本的なディレクトリ構造を作成
  - _Requirements: 全体_

- [ ] 2. バックエンド基盤の構築

  - Hono アプリケーションの初期化
  - Prisma のセットアップとデータベース接続
  - 環境変数の設定
  - _Requirements: 全体_

- [ ] 2.1 Prisma スキーマの実装

  - User, CardCollection, TradeOffer, TradeOfferCard, Message モデルを定義
  - インデックスとリレーションを設定
  - マイグレーションを実行
  - _Requirements: 全体_

- [ ]\* 2.2 Property 6 のプロパティベーステスト

  - **Property 6: カードコレクションへの追加**
  - **Validates: Requirements 2.1, 2.2**

- [ ] 2.3 認証ミドルウェアの実装

  - JWT 生成と検証機能
  - authMiddleware（認証チェック）
  - adminMiddleware（管理者権限チェック）
  - blacklistMiddleware（ブラックリストチェック）
  - _Requirements: 1.1, 5.2, 7.4_

- [ ]\* 2.4 Property 1, 2, 5, 20 のプロパティベーステスト

  - **Property 1: ユーザー登録の成功**
  - **Property 2: 重複登録の防止**
  - **Property 5: ブラックリストユーザーの登録拒否**
  - **Property 20: ブラックリストユーザーのログイン拒否**
  - **Validates: Requirements 1.1, 1.2, 1.5, 5.2**

- [ ] 3. 認証機能の実装

  - AuthService の実装（ユーザー登録、ログイン）
  - 認証エンドポイントの実装（POST /api/auth/register, POST /api/auth/login, GET /api/auth/me）
  - ポケポケユーザー ID のバリデーション
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]\* 3.1 Property 4 のプロパティベーステスト

  - **Property 4: 無効な ID の拒否**
  - **Validates: Requirements 1.4**

- [ ] 4. ユーザー機能の実装

  - UserService の実装
  - ユーザーエンドポイントの実装（GET /api/users/:userId, GET /api/users/:userId/trade-offers）
  - _Requirements: 4.5, 6.1_

- [ ]\* 4.1 Property 18 のプロパティベーステスト

  - **Property 18: ユーザープロフィールのトレード提案表示**
  - **Validates: Requirements 4.5**

- [ ] 5. カードコレクション機能の実装

  - CardCollectionService の実装
  - カードコレクションエンドポイントの実装（GET /api/users/me/cards, POST /api/users/me/cards/wanted, POST /api/users/me/cards/offered, DELETE /api/users/me/cards/:cardId, PUT /api/users/me/cards/:cardId）
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]\* 5.1 Property 7, 8, 9 のプロパティベーステスト

  - **Property 7: カードコレクションからの削除**
  - **Property 8: カードコレクションの完全表示**
  - **Property 9: カード数量の更新**
  - **Validates: Requirements 2.3, 2.4, 2.5**

- [ ] 6. トレード提案機能の実装

  - TradeOfferService の実装
  - トレード提案エンドポイントの実装（GET /api/trade-offers, GET /api/trade-offers/:offerId, POST /api/trade-offers, DELETE /api/trade-offers/:offerId）
  - トレード提案のステータス管理（active/closed への更新、検索結果からのクローズ提案除外）
  - カードコレクションからの選択ロジック
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]\* 6.1 Property 10, 11, 12, 13 のプロパティベーステスト

  - **Property 10: トレード提案の作成と保存**
  - **Property 11: カードコレクションからの選択**
  - **Property 12: トレード提案の削除**
  - **Property 13: トレード提案の完全表示**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

- [ ] 7. トレード提案検索機能の実装

  - 検索ロジックの実装（カード名による検索）
  - ブラックリストユーザーのフィルタリング
  - ページネーション機能（検索対象は active のトレード提案）
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]\* 7.1 Property 14, 15, 16, 17 のプロパティベーステスト

  - **Property 14: カード検索の正確性**
  - **Property 15: ブラックリストユーザーの除外**
  - **Property 16: トレード提案詳細の完全表示**
  - **Property 17: 検索結果の作成者情報**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [ ] 8. チャット機能の実装

  - MessageService の実装
  - チャットエンドポイントの実装（GET /api/trade-offers/:offerId/messages, POST /api/trade-offers/:offerId/messages）
  - メッセージの時系列表示
  - アクセス制御（作成者または参加者のみ）
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

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

  - Angular プロジェクトの初期化（Vite を使用）
  - Tailwind CSS のセットアップ
  - Angular Router の設定
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
