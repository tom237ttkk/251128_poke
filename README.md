# ポケポケトレードプラットフォーム

ポケポケユーザーが欲しいカードと出せるカードを整理し、安全にトレードを進めるための Web プラットフォームです。ポケポケユーザー ID を用いた登録、カードコレクション管理、トレード提案、チャット、管理者によるブラックリスト機能などを段階的に実装していきます。

## リポジトリ構成

```
.
├── .kiro/
│   ├── specs/              # 仕様・要件・タスク
│   │   └── pokepoke-trade-platform/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   └── steering/           # プロダクト/技術方針
│       ├── product.md
│       ├── tech.md
│       └── structure.md
└── README.md
```

- バックエンド（apps/api）: Hono + Prisma を想定した API。routes、services、middleware、types ディレクトリを中心に構成します。
- フロントエンド（apps/web）: Angular + Vite ベースの Web アプリ。pages、components、services で UI とデータ取得を分離します。

## 主要ドキュメント

- 要件: `.kiro/specs/pokepoke-trade-platform/requirements.md`
- 設計: `.kiro/specs/pokepoke-trade-platform/design.md`
- タスク・実装順序: `.kiro/specs/pokepoke-trade-platform/tasks.md`
- プロダクト/技術方針: `.kiro/steering/`

## 開発メモ

- 初期タスクは tasks.md のステップ 1（プロジェクト構造とツールのセットアップ）から着手します。
- 変更は必ず `main` からブランチを切り、Conventional Commits でコミットします。
