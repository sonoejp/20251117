# Family Planner - 育児計画管理アプリ 👨‍👩‍👧‍👦

育児中の複雑なスケジュールを一元管理する計画特化アプリです。

## 特徴

### 📅 多様な表示モード
- **カレンダービュー**: 月間カレンダーで予定を一覧表示
- **ガントチャート**: かわいいタイムラインビューで複数の予定を視覚的に管理
- **リストビュー**: カテゴリ別に整理された詳細なリスト表示

### 🎨 カテゴリ管理
予定を7つのカテゴリで色分け管理：
- 🏥 **病院**: 健診、予防接種、通院など
- 🏫 **学校・保育園**: 行事、面談、参観日など
- 🎨 **趣味**: 自分の趣味活動
- 📚 **習い事**: 子供の習い事
- 🎉 **イベント**: 行事、パーティーなど
- 👥 **友人**: 友人との予定
- 📝 **試験**: 子供や自分の試験

### 💾 データ管理
- LocalStorageで自動保存
- 家族メンバー管理
- 予定の追加・編集・削除

### 📱 PWA対応
- モバイルアプリのようにインストール可能
- オフラインでも動作
- レスポンシブデザイン

## 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS v4
- **日付処理**: date-fns
- **アイコン**: lucide-react
- **PWA**: マニフェストファイル対応

## セットアップ

### インストール
```bash
npm install
```

### 開発サーバー起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

### プレビュー
```bash
npm run preview
```

## Google Calendar連携について

現在、基本的なUIとローカルストレージでのデータ管理が実装されています。

Google Calendar連携を追加する場合は、以下の手順が必要です：

### 1. Google Cloud Consoleでプロジェクトを作成
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. Google Calendar APIを有効化

### 2. OAuth 2.0認証情報を作成
1. 「認証情報」→「認証情報を作成」→「OAuth クライアント ID」
2. アプリケーションの種類: ウェブアプリケーション
3. 承認済みのJavaScript生成元: `http://localhost:5173`（開発時）
4. 承認済みのリダイレクトURI: `http://localhost:5173`（開発時）

### 3. 環境変数を設定
`.env`ファイルを作成：
```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

### 4. Google Calendar API統合コードを追加
以下のライブラリをインストール：
```bash
npm install @react-oauth/google gapi-script
```

詳細な実装については、[Google Calendar API ドキュメント](https://developers.google.com/calendar/api/guides/overview)を参照してください。

## デプロイ

### Vercelへのデプロイ（推奨）

1. [Vercel](https://vercel.com/)にサインアップ
2. GitHubリポジトリと連携
3. 自動的にビルド・デプロイされます

```bash
# Vercel CLIを使用する場合
npm install -g vercel
vercel
```

### その他のホスティング

- **Netlify**: `npm run build`後、`dist`フォルダをデプロイ
- **GitHub Pages**: GitHub Actionsでビルド・デプロイ
- **Firebase Hosting**: Firebase CLIを使用

## ライセンス

MIT

## 開発者

育児中の方々のために作られた計画管理アプリです。
