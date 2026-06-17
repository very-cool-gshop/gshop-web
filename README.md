# GShop Web

使用 Nuxt 4 與 Nuxt UI 建立的電商前台，串接自訂 REST API 後端。

## 技術棧

- [Nuxt 4](https://nuxt.com)
- [Nuxt UI v4](https://ui.nuxt.com)
- TypeScript

## 功能

- 依分類瀏覽商品，支援庫存篩選
- 商品詳細頁
- 購物車
- 使用者登入 / 登出
- 結帳流程

## 安裝

```bash
npm install
```

複製 `.env.example` 為 `.env`，並設定 `NUXT_PUBLIC_API_BASE` 為後端 API 的網址。

## 開發

```bash
npm run dev
```

預設跑在 `http://localhost:3003`。

## 建置

```bash
npm run build
```

或使用 Docker：

```bash
docker build -t gshop-web .
docker run -p 3003:3003 gshop-web
```