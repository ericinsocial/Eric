# Eric Chen｜詠真堂 個人電子名片網站

這是一個可直接部署至 GitHub Pages 的單頁式個人品牌入口，整合品牌行銷顧問、塔羅與易經、珠寶礦石與個人探索四個面向。

## 檔案結構

- `index.html`：頁面結構、SEO、Open Graph、導覽與主要區塊。
- `style.css`：視覺設計、RWD、互動狀態與 reduced-motion 支援。
- `script.js`：個人資料設定、服務卡片、聯絡按鈕、分享與 vCard 下載功能。
- `manifest.webmanifest`：PWA 擴充預留設定。

## 修改個人資料

所有可替換的聯絡資訊集中在 `script.js` 最上方的 `profile` 物件：

```js
const profile = {
  nameEn: "Eric Chen",
  nameZh: "陳昱華",
  brand: "詠真堂",
  brandEn: "YONG ZHEN TANG",
  phone: "",
  email: "",
  lineUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  websiteUrl: "",
  bookingUrl: ""
};
```

欄位留空時，對應的聯絡按鈕會自動隱藏。填入電話、Email、LINE、Instagram、Facebook、個人網站或預約連結後，頁面會自動產生可點擊入口。

## 仍需替換的資料

- `script.js` 的電話、Email、LINE、Instagram、Facebook、個人網站與預約連結。
- `index.html` 的 canonical 網址，目前為 `https://example.com/`。
- 正式 PWA Icon 尚待提供；目前不宣告 icon，避免新增不存在或占位圖片路徑。

## 功能

- 手機優先的 RWD 單頁設計。
- 空白聯絡欄位自動隱藏。
- Web Share API 分享目前網址；不支援時自動複製網址。
- vCard 聯絡人下載。
- 克制的捲動進場、hover 與點擊狀態。
- `prefers-reduced-motion` 支援。
- 可直接以靜態檔案部署，無需建置工具或資料庫。

## GitHub Pages 部署

1. 將本專案推送到 GitHub repository。
2. 進入 repository 的 **Settings → Pages**。
3. Source 選擇目前分支與根目錄 `/`。
4. 儲存後等待 GitHub Pages 完成部署。

若使用自訂網域，請同步更新 `index.html` 中的 canonical 與 Open Graph 圖片路徑。

## 圖片資產與人工確認

- 本專案目前只直接引用 Repository 既有圖片：`logo白.png` 與 `Eric形象照.jpg`。
- `index.html` 以 `<img>` 直接引用 `./logo白.png` 作為 Header、首頁與品牌語句落款 Logo。
- `index.html` 以 `<img>` 直接引用 `./Eric形象照.jpg` 作為首頁 Hero 人物主視覺，並只透過 CSS 的 `object-fit`、`object-position`、尺寸與圓角控制呈現。
- 未建立、複製、重新命名、裁切或轉換任何圖片檔案；未新增 favicon、apple-touch-icon、maskable icon、縮圖、WebP 或其他圖片占位檔。
- `manifest.webmanifest` 暫不宣告 icons；正式 PWA Icon 尚待提供。
- `service-worker.js` 僅快取已存在的 `./logo白.png` 與 `./Eric形象照.jpg`，避免加入不存在的圖片路徑。
