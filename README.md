# ☁️ AWS CLF ハンズオンカリキュラム

AWS Certified Cloud Practitioner (CLF) 取得を目指す方向けの、インタラクティブな学習カリキュラムサイトです。

🌐 **公開URL**: `https://<あなたのGitHubユーザー名>.github.io/aws-curriculum/`

---

## 📚 収録コース

| コース | 内容 | 時間 |
|---|---|---|
| 📚 IT用語マスター | ネットワーク・サーバー・セキュリティ等44用語 | 2〜3時間 |
| 🚀 AWS初心者入門 | VPC→EC2→nginx Hello World | 45分 |
| 🏗️ AWS中級 | S3・IAM・ECS/Fargate・CloudFront | 3〜4時間 |
| 🔐 踏み台サーバー | SSH・SSM・JIT Node Access・EIC | 2時間 |
| ⚡ Spot Instance | コスト最適化・フリート・Auto Scaling | 3.5時間 |

---

## 🚀 GitHub Pagesへの公開手順

### 1. リポジトリを作成してコードをプッシュ

```bash
# GitHubで「aws-curriculum」という名前のリポジトリを作成してから実行
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/<ユーザー名>/aws-curriculum.git
git branch -M main
git push -u origin main
```

### 2. GitHub Pagesを有効化

1. リポジトリの **Settings** → **Pages**
2. **Source** を **「GitHub Actions」** に変更して保存

### 3. 自動デプロイ確認

`main` ブランチへのpushで自動ビルド&デプロイ。  
Actionsタブで進捗を確認 → `https://<ユーザー名>.github.io/aws-curriculum/`

---

## リポジトリ名を変更する場合

`vite.config.js` の `base` を変更：

```js
base: '/あなたのリポジトリ名/',
```

---

## ローカル開発

```bash
npm install
npm run dev      # http://localhost:5173/aws-curriculum/
npm run build
npm run preview
```

---

Tech: React 19 + Vite + React Router v7 + GitHub Actions + GitHub Pages
