# Hackathon Web アプリケーション

## 概要

React + Vite（フロントエンド）、Flask（バックエンド）、MUI（mui-icon, mui-material）を使用した Web アプリケーションです。

## セットアップ手順

### 1. リポジトリのクローン

```sh
git clone https://github.com/Maika-Miura/hackathon-2025.git
cd hackathon-2025
```

### 2. フロントエンド（React + Vite）

```sh
cd frontend
npm install
npm run dev
```

### 3. バックエンド（Flask）

```sh
cd ../backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run
```

### 4. GitHub への push/pull

- 変更を反映する場合：

```sh
git add .
git commit -m "変更内容"
git push origin main
```

- 最新の変更を取得する場合：

```sh
git pull origin main
```

## 使い方

- `frontend` ディレクトリで `npm install` → `npm run dev`
- `backend` ディレクトリで `pip install -r requirements.txt` → `flask run`

## 注意事項

- Python 仮想環境は各自作成してください（`python3 -m venv venv`）。
- Flask サーバーはデフォルトで http://localhost:5000 で起動します。
- フロントエンドは http://localhost:5173 で起動します。
