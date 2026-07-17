# Eric Chen｜詠真堂 個人電子名片網站

這是一個可直接部署至 GitHub Pages 的單頁式個人品牌入口，整合品牌行銷顧問、塔羅與易經、珠寶礦石與個人探索四個面向。

## 檔案結構

- `index.html`：頁面結構、SEO、Open Graph、導覽與主要區塊。
- `style.css`：視覺設計、RWD、互動狀態與 reduced-motion 支援。
- `script.js`：服務卡片資料、Service Worker 註冊與捲動進場效果。
- `manifest.webmanifest`：PWA 擴充預留設定。

## 修改聯絡資料

LINE 連結與電話號碼直接以純 HTML `<a>` 寫死在 `index.html`（首頁 Hero 與聯絡頁各一組），不經過 JavaScript，確保連結永遠可用：

- LINE：`https://line.me/ti/p/x0qtal5f5A`
- 電話：`tel:0920148119`（畫面顯示為 `0920 148 119`）

若需更換 LINE 或電話，請直接搜尋並修改 `index.html` 中對應的 `href`（及聯絡頁按鈕上顯示的號碼文字）。目前僅提供 LINE 與電話兩種聯絡方式，未加入 Email、Instagram、Facebook 等尚無資料的項目。

## 仍需替換的資料

- `index.html` 的 canonical 網址，目前為 `https://example.com/`。
- 正式 PWA Icon 尚待提供；目前不宣告 icon，避免新增不存在或占位圖片路徑。

## 功能

- 手機優先的 RWD 單頁設計。
- 首頁與聯絡頁提供固定的 LINE 加好友與直接撥號按鈕（純連結，無 JavaScript 攔截）。
- 克制的捲動進場、hover 與點擊狀態。
- `prefers-reduced-motion` 支援。
- 可直接以靜態檔案部署，無需建置工具或資料庫。

## 內容結構

- **首頁**：`Eric` / `陳昱華`、核心標語、專業摘要（品牌行銷｜塔羅易經｜珠寶礦石）、兩行簡介，以及「加入 LINE」「直接來電」兩個主要按鈕。
- **專業頁**：四張卡片（品牌與行銷、塔羅與易經、珠寶與礦石、潛意識探索），每張包含編號、標題、兩行說明與一組小型服務標籤。
- **關於頁**：完整自我介紹（六段，保留正常標點）與三張精簡的方法卡片（看見本質／整理問題／形成行動），品牌語句區塊移至關於頁之後、聯絡頁之前。
- **聯絡頁**：標題與說明文字、大型「加入 LINE」按鈕與可點擊的電話號碼（`0920 148 119`）、服務地區（台北｜新北｜新竹）；未顯示任何假 Email、Instagram 或社群資料。

## 已移除的功能

- **儲存聯絡人（vCard 下載）**：HTML 節點與對應的 `downloadVCard` 函式已從 `index.html`／`script.js` 完整刪除，非僅視覺隱藏。
- **分享（Header 文字連結／聯絡頁「分享電子名片」）**：HTML 節點、`shareCard`／`setupShareButtons` 函式與 Web Share API／複製連結邏輯已完整刪除；連帶移除只服務於這兩項功能的 `toast` 提示元件與其 CSS。
- **電話號碼重複顯示**：聯絡頁原本「直接來電」按鈕下方又顯示一行純文字電話號碼，現已合併為單一元素——電話按鈕本身即顯示可點擊的 `0920 148 119`。

## 視覺與版面

- 全站以正體中文為主，僅保留人名 `Eric`、平台功能名稱 `LINE`，以及必要 SEO metadata 中的英文姓名。
- Header 導覽（桌機上方）、底部導覽（手機）與 HTML 中 `<section>` 的實際排列順序三者一致，皆為「首頁 → 專業 → 關於 → 聯絡」。
- Logo 以既有 `logo白.png` 呈現，維持原始長寬比：手機版寬度約 76–92px、桌機版寬度約 96–118px，不隨螢幕加大而過度放大。
- 配色改為沉穩的炭灰藍背景（`--bg #0d1117`）、暖白主文字、灰米色次要文字，強調色為克制的舊金／香檳金（`--accent #b59a68`），移除霓虹、紫色漸層與過度玻璃擬態效果。
- 中文內文採 Noto Sans TC／PingFang TC／Microsoft JhengHei；首頁標語與品牌語句使用 Noto Serif TC 襯線字體，其餘介面維持無襯線。
- 手機首頁採單欄置中版面，人物照、姓名、標語與主要按鈕可在 390×844 首屏內同時顯示；桌機採左右兩欄版面（左側文字與按鈕、右側人物照），並使用上方導覽列。
- 介面短句已移除句尾句號；四個專業項目、品牌語句與聯絡頁說明皆已中文化並移除英文分類副標。

## GitHub Pages 部署

1. 將本專案推送到 GitHub repository。
2. 進入 repository 的 **Settings → Pages**。
3. Source 選擇目前分支與根目錄 `/`。
4. 儲存後等待 GitHub Pages 完成部署。

若使用自訂網域，請同步更新 `index.html` 中的 canonical 與 Open Graph 圖片路徑。

## 圖片資產與人工確認

- 本專案目前只直接引用 Repository 既有圖片：`logo白.png` 與 `Eric形象照.jpg`。
- `index.html` 以 `<img>` 直接引用 `./logo白.png` 作為 Header 品牌識別 Logo。
- `index.html` 以 `<img>` 直接引用 `./Eric形象照.jpg` 作為首頁 Hero 人物主視覺，並只透過 CSS 的 `object-fit`、`object-position`、尺寸與圓角控制呈現。頁面中的兩個 `<img>` 節點（`.mobile-portrait` 與 `.portrait-stage`）透過 CSS media query 互斥顯示，同一時間畫面上只會出現一張，非重複素材。
- 未建立、複製、重新命名、裁切或轉換任何圖片檔案；未新增 favicon、apple-touch-icon、maskable icon、縮圖、WebP 或其他圖片占位檔。
- `manifest.webmanifest` 暫不宣告 icons；正式 PWA Icon 尚待提供。
- `service-worker.js` 僅快取已存在的 `./logo白.png` 與 `./Eric形象照.jpg`，避免加入不存在的圖片路徑。
