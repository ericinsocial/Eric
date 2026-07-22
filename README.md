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
- `calculator/index.html`：互動式「廣告結果回推試算器」，獨立頁面（沿用共用 `style.css` 的設計變數，但元件樣式與邏輯獨立成 `calculator/calculator.css`／`calculator/calculator.js`，避免拖慢其他頁面）。

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

- **首頁 Hero（2.0 版型）**：視覺主從關係重新排序為「Logo（品牌識別）→ `Eric` / `陳昱華`（縮小為簽名式副標）→ 核心標語『看見本質／做出更好的選擇』（全頁最大、最醒目的文字，套用金屬光澤掃光）→ 四個獨立專業標籤（`.hero-tags`／`.hero-tag`，可換行為兩排）→「加入 LINE」「了解專業領域」兩個按鈕」。人物照不再包在卡片容器內（無邊框／陰影／圓角色塊），手機版為滿版大圖置頂、桌機版為右欄直接鋪滿，僅用 `object-fit: cover` ＋ `object-position` 控制裁切重心。Hero 高度改為約 `85svh`，下方不留大片空白。已移除自我描述句與 Hero 的「直接來電」按鈕（電話仍保留在聯絡頁）。「了解專業領域」是純錨點連結（`href="#services"`），靠 `html { scroll-behavior: smooth }` 平滑捲動，不經過 JavaScript。Hero 底部新增極輕微、極緩慢（2.4 秒循環）浮動的向下箭頭捲動提示（`.scroll-hint`），`prefers-reduced-motion` 時自動停止。
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
- Logo 以既有 `logo白.png` 呈現，維持原始長寬比；2.0 版型將 Logo 放大約 25–28%（手機版寬度約 96–150px／`max-height` 54px，桌機版寬度約 120–150px），使其在導覽列中更像品牌識別標記而非小圖示，同時 Header 高度僅小幅增加，維持既有導覽列比例。
- 配色改為沉穩的炭灰藍背景（`--bg #0d1117`）、暖白主文字、灰米色次要文字，強調色為克制的舊金／香檳金（`--accent #b59a68`），移除霓虹、紫色漸層與過度玻璃擬態效果。
- 中文內文採 Noto Sans TC／PingFang TC／Microsoft JhengHei；首頁標語與品牌語句使用 Noto Serif TC 襯線字體，其餘介面維持無襯線。
- 手機首頁採單欄置中版面，人物照、姓名、標語與主要按鈕可在 390×844 首屏內同時顯示；桌機採左右兩欄版面（左側文字與按鈕、右側人物照），並使用上方導覽列。
- 介面短句已移除句尾句號；四個專業項目、品牌語句與聯絡頁說明皆已中文化並移除英文分類副標。
- 主要／次要按鈕視覺權重明確區分：主要按鈕（「加入 LINE」）為實心強調金底色＋深色文字（對比度較白色文字高，`--bg` on `--accent`）；次要按鈕（「了解專業領域」等）為透明底＋金色外框＋金色文字，不再與主要按鈕同色同重量。此規則同時套用於首頁 Hero 與聯絡頁的按鈕（皆共用 `.primary-action`／`.secondary-action`）。

## 字體層級

考量中高齡使用者的可讀性，全站正文／說明／按鈕文字不低於 `1rem`，行高不低於 `1.6`。首頁 Hero 於 2.0 版型將視覺主從關係反轉：姓名縮小為簽名式副標，首頁標語成為全頁最大文字：

| 元素 | 手機 | 桌機 |
| --- | --- | --- |
| 姓名 `Eric`（h1，`.hero-name`） | `clamp(1.05rem, 4vw, 1.25rem)`（簽名式副標） | `clamp(1.15rem, 1.6vw, 1.4rem)` |
| 中文姓名 | `.82rem` | 同左 |
| 首頁標語（`.home-tagline`，全頁最大文字） | `clamp(2.3rem, 10.5vw, 3.1rem)` | `clamp(3.1rem, 5.2vw, 5.2rem)` |
| 分頁標題（h2） | `clamp(1.55rem, 5.5vw, 1.85rem)` | `clamp(1.9rem, 3vw, 2.6rem)` |
| 卡片標題 `.service-title` | `1.35rem` / 700 | 同左 |
| 正文（全域 `p`） | `1.05rem` / line-height 1.85 | `1.1rem` / line-height 1.85 |
| 按鈕 | `1.05rem` / 600 | 同左 |
| 底部導覽（例外，圖示型輔助文字） | `0.85rem` | — |
| 主要內文區最大寬度 | `38rem`（`.narrow p`／`.about-panel p`／`.contact-copy p`） | 同左 |

按鈕最小觸控高度維持 `min-height: 48px`。

## 動態效果

低調金屬光澤＋克制互動，維持既有沉穩配色，僅使用 CSS `transform`／`opacity`／`background-position`／`filter` 與輕量 `IntersectionObserver`，未引入外部動畫函式庫。套用範圍如下：

- **金屬光澤掃光**（`.shine-text`，`style.css`）：2.0 版型已從首頁 `Eric` 姓名主標移至首頁標語「看見本質／做出更好的選擇」（現為視覺焦點），與品牌語句「只差一卦」共用同一組 6 秒緩慢循環 `background-position` 掃光，非高飽和霓虹閃爍。
- **Logo 進場**（`.brand-logo`，`style.css`）：頁面載入時播放一次（`animation-fill-mode: both`，非 `infinite`），輕微上移＋亮度回落，不會重複播放。
- **捲動進場**（`.reveal`／`.reveal.visible`，`style.css` ＋ `setupReveal()`，`script.js`）：各主要區塊淡入＋輕微上移（0.6s），透過 `IntersectionObserver` 觸發，`unobserve` 後不重播。
- **服務卡片 hover 回饋**（`.service-card`，`style.css`）：hover／focus 時整張卡片輕微上移＋邊框轉強調色＋「了解更多 →」位移，`transform`／`border-color` 動畫，無翻轉、無旋轉。
- **首頁捲動提示**（`.scroll-hint`／`.scroll-arrow`，`style.css`）：Hero 底部極輕微（`opacity: .5`）、極緩慢（2.4 秒循環）的向下箭頭上下浮動（`translateY` 5px 內），不搶視覺焦點；`prefers-reduced-motion` 時動畫停止。
- **導覽列 scrollspy 底線**（`.nav-indicator`，`style.css` ＋ `setupNavScrollSpy()`，`script.js`）：以 `IntersectionObserver` 監看首頁／專業／關於／聯絡四個區塊，依目前捲動位置更新桌機上方導覽與手機底部導覽的 active 狀態與底線位置（`transform`／`width` 平滑過渡，非瞬間跳色）。
- **首頁照片微視差**（`setupHeroParallax()`，`script.js`）：捲動時人物照以約 0.08 倍速位移，幅度輕微，透過 `requestAnimationFrame` 節流；偵測到 `prefers-reduced-motion: reduce` 時直接不註冊此監聽器。
- **按鈕微互動**（`.primary-action`／`.secondary-action`，`style.css`）：按壓時輕微縮放回饋，hover 時有一道斜向掃光通過，皆為 `transform`／偽元素動畫，不影響版面。

2.0 版型同時**移除**了詳情頁圖片 Placeholder 的 hover 縮放效果（原 `.image-placeholder:hover { transform: scale(1.015) }`），全站不再有任何圖片縮放／zoom 動效，僅保留進場淡入與 hover 位移／變色。

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

`CACHE_NAME` 升版為 `eric-card-v8`（本輪 `index.html`／`style.css`／`services/marketing/index.html`／`calculator/calculator.js`／`calculator/calculator.css` 皆有異動，需讓已安裝過舊版 Service Worker 的使用者拿到新內容），快取清單維持 `./calculator/index.html`／`./calculator/calculator.css`／`./calculator/calculator.js`，舊版快取會在 `activate` 事件中被清除。

## 廣告結果回推試算器（`calculator/`）

一個完整的互動式「Interactive Marketing Funnel Calculator」，不是傳統問卷：從使用者真正想要的商業結果（新客戶數，或現有預算）開始，一路回推完整的商業漏斗（曝光→點擊→瀏覽→閱讀→CTA→聯絡→名單→〔預約→到場〕→成交），而不是直接問「你需要什麼服務」。全部使用 Vanilla HTML／CSS／JavaScript，沒有任何第三方套件，視覺完全沿用首頁既有的深色設計語言（`:root` 顏色變數、`--serif`／`--sans` 字型、`.primary-action`／`.secondary-action` 按鈕樣式）。

### 入口整合

試算器已正式整合進 `services/marketing/`（行銷專門頁），是該頁的主要互動內容，不是孤立頁面：

- **行銷頁 Hero 首屏**：文案改為「你想得到多少新客戶？」，主要 CTA「免費試算我的廣告成果」（`href="#marketing-funnel-calculator"`，靠 `html { scroll-behavior: smooth }` 平滑捲動到同頁的試算器入口區塊）、次要 CTA「查看行銷服務」（`href="#marketing-services"`，捲動到「我可以協助什麼」區塊），按鈕下方有「免費試算｜不用留下電話｜約 3 分鐘完成」說明。
- **試算器入口區塊**：新增 `<section id="marketing-funnel-calculator">`，位置在 Hero 圖片之後、「我可以協助什麼」之前（符合「主要差異化內容」應在首屏後、一般服務介紹前的順序）。內容包含小標題、說明文字、重用既有 `renderFlowDiagram()` 元件呈現的漏斗預覽（曝光→點擊→瀏覽→名單→成交），以及連到 `calculator/` 的「開始試算我的廣告成果」按鈕（`.cta-button` 元件）。由於試算器本身規模較大（獨立的完整互動流程），採用「同頁明確入口＋連到獨立路由」而非把整套精算引擎複製進行銷頁。
- **中段第二入口**：在「代表性專案」之後、結語之前，加入「不知道應該先做廣告、網站、短影音，還是轉換追蹤？」搭配「開始免費試算」按鈕，同樣連到 `calculator/`，避免使用者錯過首屏按鈕。
- **手機版固定入口**：`.marketing-float-cta`（僅行銷頁、僅手機版），顯示「免費試算廣告成果」，用 `IntersectionObserver` 監看 `#marketing-funnel-calculator` 區塊，捲動到試算器入口後自動淡出；固定於既有 `.bottom-nav` 上方（`bottom: calc(78px + env(safe-area-inset-bottom))`），兩者不重疊。
- **首頁次要入口**：`index.html` 的「專業領域」區塊、四張服務卡片下方加入 `.calc-promo` 提示卡（「不知道廣告預算該抓多少？」／「免費試算」），連到 `services/marketing/index.html#marketing-funnel-calculator`，讓使用者不需要先知道行銷頁網址。
- **導覽列**：首頁與四個詳情頁既有的「專業」導覽項目本來就會導向服務清單（含品牌行銷卡片），已是行銷頁的有效入口，因此**沒有**新增名稱相近的導覽項目。
- **試算完成後的銜接**：試算器結果頁的行動區塊改為「想知道你的目標與預算是否合理？」＋「加入 LINE 詢問 Eric」（主要按鈕，`target="_blank"` 開啟 LINE）、「複製完整分析」與「重新開始試算」（次要按鈕），複製成功的提示文字改為「已複製，加入 LINE 後直接貼上即可」。

### 流程與分支邏輯

- **Hero**：「你想得到多少新客戶？」＋一顆「開始試算」CTA。
- **Step 1（起點選擇）**：① 已知目標客戶數（路徑 A）／② 已知預算（路徑 B）／③ 想做完整評估（路徑 C＝A＋B 合併，並額外用現有預算反推可得客戶數作為對照）。
- **路徑 A**：目標客戶數 → 客單價 → 成交方式（決定後續漏斗形狀）→ 實際成交率（直接覆寫 `close` 轉換率，比預設值更貼近使用者真實狀況）。
- **路徑 B**：每月預算 → 廣告目的（同樣決定漏斗形狀）。
- **共用問題**（不分路徑都會問）：真正看到廣告的人／真正決定的人／目前有哪些素材／目前追蹤哪些數據／目前最大困擾——這些答案會直接影響結果頁的瓶頸分析與建議順序，不是固定文案。
- 漏斗形狀依「成交方式」或「廣告目的」動態決定：直接購買（曝光→…→CTA→成交，跳過聯絡／名單／預約／到場）、LINE／表單／報價／品牌曝光（曝光→…→聯絡→名單→成交）、預約到店／預約諮詢／預約目的（完整 10 段含預約與到場）。

### 計算引擎

漏斗參數集中在 `calculator.js` 的 `FUNNEL_PRESETS`（保守／合理／理想三組，皆可透過進階模式的 slider 個別覆寫，且與 `mode` 切換即時重新計算），每一段轉換都同時算出「人數／轉換率／流失人數」。正向（由預算或曝光往後推到成交）與反向（由目標客戶數往前推到曝光）计算共用同一組 `computeChainForward`／`computeChainCounts`，確保兩種輸入模式使用同一套邏輯。預算同時以 CPC（`clicks × cpc`）與 CPM（`exposure ÷ 1000 × cpm`）兩種方式估算並排顯示，不假設兩者必然一致，讓使用者能自行比較；同時計算 CAC（客戶取得成本）與 ROAS（需要客單價才能計算，路徑 B 若無客單價則顯示「需提供客單價」而非硬湊數字）。

### 瓶頸分析／改善順序／推薦服務

三者共用同一套「弱項排序」（`rankWeakStages`：比較使用者目前轉換率與「合理」預設值的落差），確保「瓶頸分析」點出的問題、「建議改善順序」的步驟、「適合我的服務」的推薦彼此邏輯一致，而不是各自獨立的固定文案；同時混入使用者在共用問題中的作答（困擾、缺少的素材、缺少的追蹤、決策者與受眾是否不同）。推薦服務目前對應到既有的 `services/marketing/` 頁面（Meta 廣告／Landing Page／短影音／AI 自動化／SEO／品牌行銷顧問等，依弱項對應、去重後最多顯示三項）。

### 互動細節

- 每題一張卡片，`Enter`／`→` 前進，`←`／`Esc` 返回（在 Step 1 按 `Esc` 會回到 Hero），文字輸入框中的方向鍵不會被攔截（保留游標移動）。
- 卡片切換、數字 Count Up（`requestAnimationFrame` 手刻，非套件）、漏斗長條寬度動畫皆尊重 `prefers-reduced-motion`，停用時直接顯示最終數值。
- 調整「進階模式」的 slider 只會局部重新渲染結果區塊（漏斗／預算／瓶頸／建議／推薦服務），slider 本身所在的區塊不會被整個銷毀重建，避免拖曳到一半失焦或畫面閃爍。
- 「複製完整分析」使用 `navigator.clipboard.writeText()`，並提供 `document.execCommand("copy")` 的隱藏 textarea 後備方案；複製內容為純文字（漏斗數字＋預算＋瓶頸＋建議，已移除 HTML 標籤），可直接貼到 LINE。

## GitHub Pages 部署

1. 將本專案推送到 GitHub repository。
2. 進入 repository 的 **Settings → Pages**。
3. Source 選擇目前分支與根目錄 `/`。
4. 儲存後等待 GitHub Pages 完成部署。

若使用自訂網域，請同步更新 `index.html` 中的 canonical 與 Open Graph 圖片路徑。

## 圖片資產與人工確認

- 本專案目前只直接引用 Repository 既有圖片：`logo白.png` 與 `Eric形象照.jpg`。
- `index.html` 以 `<img>` 直接引用 `./logo白.png` 作為 Header 品牌識別 Logo；四個服務詳情頁的 Header 維持與首頁相同的深色樣式，以相對路徑 `../../logo白.png` 引用同一張圖片，不需要任何濾鏡調整。
- `index.html` 以 `<img>` 直接引用 `./Eric形象照.jpg` 作為首頁 Hero 人物主視覺，2.0 版型已移除外層卡片容器（無邊框／陰影／圓角色塊），只透過 CSS 的 `object-fit: cover` 與 `object-position` 控制裁切重心與呈現比例。頁面中的兩個 `<img>` 節點（`.mobile-portrait` 與 `.portrait-stage`）透過 CSS media query 互斥顯示，同一時間畫面上只會出現一張，非重複素材。四個服務詳情頁僅在 `og:image` 引用該圖片（絕對網址），頁面內文未使用真實圖片，商品／案例／情境圖的位置一律以 `.image-placeholder` 純 CSS 虛線色塊呈現（詳見「圖片 Placeholder」一節），未生成、下載或使用任何圖庫圖片頂替。
- 未建立、複製、重新命名、裁切或轉換任何圖片檔案；未新增 favicon、apple-touch-icon、maskable icon、縮圖、WebP 或其他圖片占位檔。
- `manifest.webmanifest` 暫不宣告 icons；正式 PWA Icon 尚待提供。
- `service-worker.js` 僅快取已存在的 `./logo白.png`、`./Eric形象照.jpg` 與四個真實存在的服務詳情頁路徑，避免加入不存在的路徑。
