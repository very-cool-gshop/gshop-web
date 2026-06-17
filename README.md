# GShop Web

GShop 電商平台的前台應用，串接自訂 REST API 後端，支援商品瀏覽、購物車與結帳流程。

## 技術棧

| 項目 | 版本 |
|------|------|
| [Nuxt](https://nuxt.com) | 4 |
| [Nuxt UI](https://ui.nuxt.com) | v4 |
| TypeScript | — |
| Node.js | 24 (Alpine) |

## 功能

- **首頁** — 分類導覽入口
- **分類頁** — 商品列表，支援庫存篩選
- **商品頁** — 商品詳情、規格選擇、加入購物車
- **購物車** — 側邊 Modal，即時更新
- **結帳** — 訂單確認流程
- **會員** — 登入 / 登出、個人頁面
- **路由守衛** — 未登入自動導向登入頁

## 專案結構

```
app/
├── pages/
│   ├── index.vue           # 首頁
│   ├── category/[handle]   # 分類頁
│   ├── product/[handle]    # 商品頁
│   ├── checkout.vue        # 結帳
│   ├── login.vue           # 登入
│   └── user.vue            # 個人頁面
├── components/
│   ├── Header.vue
│   ├── Footer.vue
│   └── cart/               # 購物車元件
├── composables/
│   ├── useApiFetch.ts      # 封裝 API 請求
│   ├── useApiCart.ts       # 購物車狀態管理
│   └── useAuth.ts          # 登入狀態
├── api/                    # API 呼叫函式
├── layouts/                # default / auth 佈局
└── middleware/auth.ts      # 路由守衛
```

## 環境設定

複製 `.env.example` 為 `.env`：

```env
NUXT_PUBLIC_API_BASE=http://localhost:8080
```

## 開發

```bash
npm install
npm run dev
```

預設跑在 `http://localhost:3003`。

其他指令：

```bash
npm run build       # 正式建置
npm run typecheck   # TypeScript 型別檢查
npm run lint        # ESLint
npm run format      # Prettier 格式化
```

## 部署

### Docker

```bash
docker build -t gshop-web .
docker run -p 3003:3003 gshop-web
```

### CI/CD（GitHub Actions）

推送到 `main` 分支後自動執行：

1. 建置 Docker Image
2. 推送至 GCP Artifact Registry（`asia-east1`）
3. 對 GKE 叢集執行 `kubectl rollout restart`

需在 GitHub Repository 設定以下 Secrets：

| Secret | 說明 |
|--------|------|
| `GCP_SA_KEY` | GCP Service Account JSON 金鑰 |

## 授權

[MIT](./LICENSE)
