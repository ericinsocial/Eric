# Eric Chen｜詠真堂 個人電子名片網站

這是一個可直接部署至 GitHub Pages 的個人品牌入口，整合品牌行銷、占卜預測、珠寶礦石與潛意識探索四個面向，首頁為單頁式電子名片，並附有四個獨立的服務詳情頁。

## 檔案結構

- `index.html`：首頁結構、SEO、Open Graph、導覽與主要區塊。
- `style.css`：首頁深色系視覺設計＋四個服務詳情頁的亮色「編輯閱讀」風格，共用同一份檔案。
- `script.js`：服務卡片資料與渲染、Service Worker 註冊、捲動進場效果、導覽列 scrollspy／底線、首頁照片微視差，以及四個詳情頁共用的區塊渲染函式（`renderInsightCard`／`renderTagList`／`renderTwinCards`／`renderNoticeBox`／`renderServiceCTA`／`renderAccordion`／`renderFlowDiagram`／`renderPriceCard`／`renderPlaceholder`／`renderPlaceholderGrid`）。
- `manifest.webmanifest`：PWA 擴充預留設定。
- `services/marketing/index.html`：服務詳情頁「品牌行銷」。
- `services/divination/index.html`：服務詳情頁「占卜預測」。
- `services/jewelry/index.html`：服務詳情頁「珠寶礦石」。
- `services/subconscious/index.html`：服務詳情頁「潛意識探索」。

## 修改聯絡資料

LINE 連結與電話號碼直接以純 HTML `<a>` 寫死在 `index.html`（首頁 Hero 與聯絡頁各一組），不經過 JavaScript，確保連結永遠可用：

- LINE：`https://line.me/ti/p/x0qtal5f5A`
- 電話：`tel:0920148119`（畫面一律顯示為按鈕文字「直接來電」，不在任何位置以純文字裸露顯示電話號碼）

若需更換 LINE 或電話，請直接搜尋並修改 `index.html` 中對應的 `href`。目前僅提供 LINE 與電話兩種聯絡方式，未加入 Email、Instagram、Facebook 等尚無資料的項目。

## 仍需替換的資料

- 五個頁面（首頁＋四個服務詳情頁）的圖片 Placeholder 區塊：純 CSS／HTML 做出的虛線空白色塊，標示了用途、建議比例與 alt 文字，尚待換上真實照片（詳見「圖片 Placeholder」一節）。
- 正式 PWA Icon 尚待提供；目前不宣告 icon，避免新增不存在或占位圖片路徑。

## 功能

- 手機優先的 RWD 單頁設計。
- 首頁與聯絡頁提供固定的 LINE 加好友與直接撥號按鈕（純連結，無 JavaScript 攔截）。
- 克制的捲動進場、hover 與點擊狀態。
- `prefers-reduced-motion` 支援。
- 可直接以靜態檔案部署，無需建置工具或資料庫。

## 內容結構

- **首頁 Hero**：只保留 `Eric` / `陳昱華`、核心標語、專業摘要（品牌行銷｜占卜預測｜珠寶礦石｜潛意識探索），以及「加入 LINE」「了解專業領域」兩個按鈕；已移除自我描述句與 Hero 的「直接來電」按鈕（電話仍保留在聯絡頁）。「了解專業領域」是純錨點連結（`href="#services"`），靠 `html { scroll-behavior: smooth }` 平滑捲動，不經過 JavaScript。
- **定位區塊**：文案改為完全站在訪客角度的短句（「當問題變得複雜…」），不再提及 Eric 本人。
- **專業頁**：四張單層、整張可直接點擊的卡片（品牌行銷、占卜預測、珠寶礦石、潛意識探索），內容為編號、放大加粗的標題、一句簡短說明與「了解更多 →」，直接連結至對應服務詳情頁；不再需要「先翻面再點擊」兩次操作。
- **關於頁**：具體背景介紹（行銷經理／內容企劃／專案規劃者，工作橫跨科技、XR、教育、軍警模擬訓練與國際展覽）取代抽象理念句，並以 `.capability-list` 條列四項核心能力。
- **聯絡頁**：標題與說明文字、大型「加入 LINE」與「直接來電」按鈕、服務地區（台北｜新北｜新竹）；未顯示任何假 Email、Instagram 或社群資料。

## 已移除的功能

- **儲存聯絡人（vCard 下載）／分享**：延續前輪，HTML 節點與對應 JS 函式已完整刪除，非僅視覺隱藏。
- **服務卡片翻轉**：`.service-card-inner`／`-front`／`-back`、`rotateY` 相關 CSS，以及 `setupServiceFlip()`／`is-flipped` 切換邏輯已從 `style.css`／`script.js` 完整刪除（非隱藏）。卡片改為單層、整張包在 `<a>` 內，不再需要 JS 攔截 click 判斷「翻面」或「跳轉」。
- **電話號碼重複顯示**：全站電話一律以「直接來電」按鈕呈現，不在任何位置以純文字裸露顯示電話號碼。

## 服務名稱定案

| 舊名稱 | 最終名稱 |
| --- | --- |
| 塔羅與易經／塔羅易經 | 占卜預測 |
| 品牌與行銷 | 品牌行銷 |
| 珠寶與礦石 | 珠寶礦石 |
| 個人探索 | 潛意識探索 |

已掃描全專案（`index.html`、`script.js`、`manifest.webmanifest`、四個服務詳情頁），將所有作為「服務分類名稱」使用的舊名稱改為最終名稱，涵蓋：首頁專業摘要、定位段落、專業領域卡片標題與卡片翻轉背面連結文字、關於頁自我介紹（兩處）、聯絡頁說明文字、`<meta name="description">`、`manifest.webmanifest` 的 `description`、四個服務詳情頁的 `<title>`／page label／`<meta>`。

「塔羅」「易經」作為具體占卜方法／工具名稱時保留原字，唯一保留處：`services/divination/index.html` 內文「透過塔羅、易經或交叉判讀整理局勢」與對應的 `<meta name="description">`，因為那裡描述的是占卜使用的具體方法，不是服務分類名稱。

## 專業領域卡片可點擊性強化

- 卡片標題改用 `.service-title`（1.35rem／700／`--text-primary`），與編號 `.service-index`、說明文字 `.service-preview` 形成明確的顏色與字級落差。
- 卡片內文字結尾固定顯示「了解更多 →」（`.service-more-link`），無需 hover 也清楚可見；hover／focus 時整張卡片上移＋邊框轉為強調色，連結文字同步位移。
- `.service-card` 本身就是 `<a>` 標籤並加上 `cursor: pointer`，手機與桌機使用同一套「直接點擊」邏輯，沒有翻轉、沒有 hover／點擊兩種不同互動路徑。

## 視覺與版面

- 全站以正體中文為主，僅保留人名 `Eric`、平台功能名稱 `LINE`，以及必要 SEO metadata 中的英文姓名。
- Header 導覽（桌機上方）、底部導覽（手機）與 HTML 中 `<section>` 的實際排列順序三者一致，皆為「首頁 → 專業 → 關於 → 聯絡」。
- Logo 以既有 `logo白.png` 呈現，維持原始長寬比：手機版寬度約 76–92px、桌機版寬度約 96–118px，不隨螢幕加大而過度放大。
- 配色改為沉穩的炭灰藍背景（`--bg #0d1117`）、暖白主文字、灰米色次要文字，強調色為克制的舊金／香檳金（`--accent #b59a68`），移除霓虹、紫色漸層與過度玻璃擬態效果。
- 中文內文採 Noto Sans TC／PingFang TC／Microsoft JhengHei；首頁標語與品牌語句使用 Noto Serif TC 襯線字體，其餘介面維持無襯線。
- 手機首頁採單欄置中版面，人物照、姓名、標語與主要按鈕可在 390×844 首屏內同時顯示；桌機採左右兩欄版面（左側文字與按鈕、右側人物照），並使用上方導覽列。
- 介面短句已移除句尾句號；四個專業項目、品牌語句與聯絡頁說明皆已中文化並移除英文分類副標。

## 字體層級（本輪全面放大一級）

考量中高齡使用者的可讀性，全站正文／說明／按鈕文字不低於 `1rem`，行高不低於 `1.6`：

| 元素 | 手機 | 桌機 |
| --- | --- | --- |
| 姓名 `Eric`（h1） | `clamp(2.2rem, 10vw, 3rem)` | `clamp(3.5rem, 6vw, 5.8rem)`（維持不變） |
| 中文姓名 | `1.05rem` | 同左 |
| 首頁標語 | `clamp(1.5rem, 6.2vw, 1.9rem)` / line-height 1.5 | `clamp(1.8rem, 2.6vw, 2.6rem)` |
| 分頁標題（h2） | `clamp(1.55rem, 5.5vw, 1.85rem)` | `clamp(1.9rem, 3vw, 2.6rem)` |
| 卡片標題 `.service-title` | `1.35rem` / 700 | 同左 |
| 正文（全域 `p`） | `1.05rem` / line-height 1.85 | `1.1rem` / line-height 1.85 |
| 按鈕 | `1.05rem` / 600 | 同左 |
| 底部導覽（例外，圖示型輔助文字） | `0.85rem` | — |
| 主要內文區最大寬度 | `38rem`（`.narrow p`／`.about-panel p`／`.contact-copy p`） | 同左 |

按鈕最小觸控高度維持 `min-height: 48px`。

## 動態效果

低調金屬光澤＋克制互動，維持既有沉穩配色，僅使用 CSS `transform`／`opacity`／`background-position`／`filter` 與輕量 `IntersectionObserver`，未引入外部動畫函式庫。套用範圍如下：

- **金屬光澤掃光**（`.shine-text`，`style.css`）：套用在首頁 `Eric` 姓名主標與品牌語句「只差一卦」，6 秒緩慢循環的 `background-position` 掃光，非高飽和霓虹閃爍。
- **Logo 進場**（`.brand-logo`，`style.css`）：頁面載入時播放一次（`animation-fill-mode: both`，非 `infinite`），輕微上移＋亮度回落，不會重複播放。
- **捲動進場**（`.reveal`／`.reveal.visible`，`style.css` ＋ `setupReveal()`，`script.js`）：各主要區塊淡入＋輕微上移（0.6s），透過 `IntersectionObserver` 觸發，`unobserve` 後不重播。
- **服務卡片 hover 回饋**（`.service-card`，`style.css`）：hover／focus 時整張卡片輕微上移＋邊框轉強調色＋「了解更多 →」位移，`transform`／`border-color` 動畫，無翻轉、無旋轉。
- **詳情頁圖片 Placeholder 縮放**（`.image-placeholder:hover`，`style.css`）：hover 時極輕微放大（`scale(1.015)`），僅用於情境圖／案例圖片位置，幅度刻意壓低避免掉幀觀感。
- **導覽列 scrollspy 底線**（`.nav-indicator`，`style.css` ＋ `setupNavScrollSpy()`，`script.js`）：以 `IntersectionObserver` 監看首頁／專業／關於／聯絡四個區塊，依目前捲動位置更新桌機上方導覽與手機底部導覽的 active 狀態與底線位置（`transform`／`width` 平滑過渡，非瞬間跳色）。
- **首頁照片微視差**（`setupHeroParallax()`，`script.js`）：捲動時人物照以約 0.08 倍速位移，幅度輕微，透過 `requestAnimationFrame` 節流；偵測到 `prefers-reduced-motion: reduce` 時直接不註冊此監聽器。
- **按鈕微互動**（`.primary-action`／`.secondary-action`，`style.css`）：按壓時輕微縮放回饋，hover 時有一道斜向掃光通過，皆為 `transform`／偽元素動畫，不影響版面。

### `prefers-reduced-motion` 保護

`style.css` 內的 `@media (prefers-reduced-motion: reduce)` 區塊將所有動畫／過場時間壓縮為 `.01ms`、`animation-iteration-count` 強制為 `1`，並將 `.hero-portrait` 的 `transform` 鎖定為 `none`；`script.js` 的 `setupHeroParallax()` 另外在啟動時以 `window.matchMedia("(prefers-reduced-motion: reduce)")` 判斷，成立時完全不掛載捲動監聽器（而非只是讓 CSS 蓋掉效果）。

## 四個服務詳情頁

四個服務各有一個獨立的靜態頁面（真實資料夾＋`index.html`，非 hash panel／query string），GitHub Pages 可直接運作、可分享、重新整理不會壞：

| 服務 | 路徑 | 主題色 |
| --- | --- | --- |
| 品牌行銷 | `services/marketing/` | `#B44537`／`#F1DDD7` |
| 占卜預測 | `services/divination/` | `#66528C`／`#E8E1F0` |
| 珠寶礦石 | `services/jewelry/` | `#3F7163`／`#DDEBE5` |
| 潛意識探索 | `services/subconscious/` | `#45647A`／`#DCE6EC` |

### 兩段式版面：深色 Hero ＋ 米白正文

每頁最上方是 `<section class="service-hero">`（`--bg`／`--text-primary`，與首頁同一套深色變數），內含「← 返回專業領域」、page label、H1 與 1–2 行輔助文字；Hero 結束後才進入米白正文（`.service-page` 的 `#F7F5F0`／`#1B1B1B`／`#5E5A55` 系統）。**Header 全站（含四個詳情頁）維持深色樣式不變**，不再有先前版本的淺色 Header／Logo `filter: invert()` 覆寫；手機底部導覽同樣維持深色，未套用亮色覆寫。各頁主題色（`--service-accent`／`--service-accent-soft`，以行內 `style` 設在 `<body>`）只用在 page label、H3、accordion 的「+」icon、按鈕邊框等點綴位置，不做整片染色背景。

### 共用元件（`script.js`）

四頁共用 `style.css`／`script.js`，用共用函式產生重複結構，各頁只傳入自己的文字與資料，不需複製貼上 HTML：

- `renderInsightCard()` — 「大字論點→內文→結論」的觀念卡片
- `renderTagList()` — 簡潔條列的關鍵字標籤（占卜方法、客製流程細項）
- `renderTwinCards()` — 兩張並列的情境卡片（潛意識探索頁）
- `renderNoticeBox()` — 免責聲明提示框
- `renderServiceCTA()` — 底部 CTA 區塊（含按鈕，按頁面傳入不同組合）
- `renderAccordion()` — 可展開收合的手風琴（品牌行銷頁六大分類），內建點擊事件綁定
- `renderFlowDiagram()` — 橫向（手機自動改直向）步驟流程圖
- `renderPriceCard()` — 極簡方案卡（占卜預測頁的一對一預約方案）
- `renderPlaceholder()` / `renderPlaceholderGrid()` — 圖片 Placeholder（單張或多張網格）

H1、開場文字、強調句、H2 段落標題等一次性內容直接寫成靜態 HTML（保留正常標點，符合第二節「正式文章」例外），確保無 JavaScript 時內容仍完整可讀；上述元件則以 `<div id="mount-xxx" class="reveal-block">` 佔位，頁面各自的行內 `<script>` 在 `DOMContentLoaded` 時呼叫共用函式填入內容。

### 各頁內容摘要

- **品牌行銷**：Hero「為什麼好的產品，卻一直賣不好？」→ 情境圖 Placeholder → 六大分類手風琴（品牌與行銷策略／數位行銷與網站／內容與 AI 影音／影音與直播製作／線下廣告與活動／展覽與參展統籌，預設收合）→ 「洞察→策略→內容→製作→投放→執行→分析」流程圖 → 4 個代表性專案 Placeholder → 核心結論 → CTA（主要「討論行銷需求」／次要「直接來電」）。
- **占卜預測**：Hero「論運，不論命」→ 情境圖 Placeholder（木桌、易經書、古錢、茶、自然光，非水晶球／黑紫煙霧路線）→ 開場說明 → 占卜方法標籤列（塔羅牌、易經卜卦等 10 項）→「先問一卦」Oracle 導流區塊（Mockup Placeholder ＋「免費體驗易經 Oracle」按鈕，`target="_blank"` 另開分頁連到 `https://ericinsocial.github.io/I-Ching-Oracle/`）→ 一對一占卜預測方案卡（60 分鐘／NT$2,000／五項內容／「預約占卜」按鈕）→ 免責聲明提示框。
- **珠寶礦石**：既有文案結構保留，新增「客製可以怎麼進行」標籤列（礦石選擇邏輯、手圍與配戴習慣、風格搭配、金屬配件、成品細節、保養方式）與 5 格作品細節 Placeholder（微距礦石、手串材質、金屬配件、手腕實戴、包裝）；CTA 改為「開始客製」＋「返回專業領域」。
- **潛意識探索**：內容逐句檢查用詞（探索、整理、理解、看見模式、覺察、對話），確認沒有出現「治療」「診斷」「保證療癒」等醫療／心理治療用語；免責聲明提示框逐字保留不變；CTA 改為「開始探索」＋「返回專業領域」。

### 免責聲明提示框（`.notice-box`，逐字保留、責任邊界不可刪除）

- `services/divination/index.html`：置於占卜預測方案卡之後，文字「占卜可協助整理風險與選項，但不取代專業投資、法律或醫療意見」。
- `services/subconscious/index.html`：置於核心結論之後、CTA 之前，文字「不進行心理疾病診斷，不取代心理治療或精神醫療。若出現嚴重憂鬱、自傷想法、創傷反應或其他高風險狀況，應尋求合格心理師或醫療專業協助」。

### 圖片 Placeholder

純 CSS／HTML 做出的虛線空白色塊（`.image-placeholder`），未產生任何圖片檔案。每個位置皆標示用途、建議比例、桌面寬度／手機裁切、alt 文字：

| 頁面 | Placeholder |
| --- | --- |
| 品牌行銷 | Hero Image（16:9）＋ 4 個代表性專案（4:3：品牌網站／展覽 3D 圖／活動現場／影片畫面） |
| 占卜預測 | Hero Image（16:9）＋ Oracle 網站 Mockup（16:10 或 9:19.5） |
| 珠寶礦石 | 5 格作品細節（1:1 或 4:5） |
| 潛意識探索 | 未新增（既有文案結構保留，未特別要求須新增意境圖） |

### CTA 對照表

| 頁面 | 主要 CTA | 次要 CTA |
| --- | --- | --- |
| 首頁 | 加入 LINE | 了解專業領域（錨點捲動至 `#services`） |
| 品牌行銷 | 討論行銷需求 | 直接來電 |
| 占卜預測 | 預約占卜（方案卡按鈕） | 免費體驗 Oracle（另開分頁，先問一卦區塊按鈕） |
| 珠寶礦石 | 開始客製 | 返回專業領域 |
| 潛意識探索 | 開始探索 | 返回專業領域 |

### 首頁卡片串接

`script.js` 的 `services[].href` 對應四個路徑，卡片內固定顯示「了解更多 →」，整張卡片就是 `<a>`，點擊直接導向對應頁面，不再需要 JavaScript 攔截 click 事件判斷「翻面」或「跳轉」。

### SEO

首頁與四個詳情頁的 `canonical`／`og:image` 皆已改為 `https://ericinsocial.github.io/Eric/...` 絕對網址（`og:image` 對中文檔名 `Eric形象照.jpg`做了 URL 百分比編碼），不再殘留 `example.com` 佔位網域；四個詳情頁各自擁有對應內容的 `<title>`／meta description／`og:title`／`og:description`，未共用同一組。

### Service Worker

`CACHE_NAME` 升版為 `eric-card-v5`（因四個詳情頁內容大幅重寫，需讓已安裝過舊版 Service Worker 的使用者拿到新內容），快取清單維持四個詳情頁路徑（`./services/marketing/index.html` 等），舊版快取會在 `activate` 事件中被清除。

## GitHub Pages 部署

1. 將本專案推送到 GitHub repository。
2. 進入 repository 的 **Settings → Pages**。
3. Source 選擇目前分支與根目錄 `/`。
4. 儲存後等待 GitHub Pages 完成部署。

若使用自訂網域，請同步更新 `index.html` 中的 canonical 與 Open Graph 圖片路徑。

## 圖片資產與人工確認

- 本專案目前只直接引用 Repository 既有圖片：`logo白.png` 與 `Eric形象照.jpg`。
- `index.html` 以 `<img>` 直接引用 `./logo白.png` 作為 Header 品牌識別 Logo；四個服務詳情頁的 Header 維持與首頁相同的深色樣式，以相對路徑 `../../logo白.png` 引用同一張圖片，不需要任何濾鏡調整。
- `index.html` 以 `<img>` 直接引用 `./Eric形象照.jpg` 作為首頁 Hero 人物主視覺，並只透過 CSS 的 `object-fit`、`object-position`、尺寸與圓角控制呈現。頁面中的兩個 `<img>` 節點（`.mobile-portrait` 與 `.portrait-stage`）透過 CSS media query 互斥顯示，同一時間畫面上只會出現一張，非重複素材。四個服務詳情頁僅在 `og:image` 引用該圖片（絕對網址），頁面內文未使用真實圖片，商品／案例／情境圖的位置一律以 `.image-placeholder` 純 CSS 虛線色塊呈現（詳見「圖片 Placeholder」一節），未生成、下載或使用任何圖庫圖片頂替。
- 未建立、複製、重新命名、裁切或轉換任何圖片檔案；未新增 favicon、apple-touch-icon、maskable icon、縮圖、WebP 或其他圖片占位檔。
- `manifest.webmanifest` 暫不宣告 icons；正式 PWA Icon 尚待提供。
- `service-worker.js` 僅快取已存在的 `./logo白.png`、`./Eric形象照.jpg` 與四個真實存在的服務詳情頁路徑，避免加入不存在的路徑。
