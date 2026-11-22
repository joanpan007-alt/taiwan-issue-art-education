# docs/ — GitHub Pages 部署用

`index.html` 是「台灣議題本位藝術與教育平台」的完整單檔網站，抽自線上版本 `1795358191-f446`（2026-11-22）。自足、無後端，只外連 Google Fonts。

## 怎麼開成網站（由你操作）
1. 這個倉庫目前是 **Private**。GitHub Pages 在免費方案下需要倉庫為 **Public** 才能發佈（私有倉庫的 Pages 需付費方案）。
2. 到 repo 的 **Settings → Pages**，Source 選 **Deploy from a branch**，分支選 **main**、資料夾選 **/docs**，儲存。
3. 幾分鐘後網址會是 `https://joanpan007-alt.github.io/taiwan-issue-art-education/`。

## 更新
此檔是某一時間點的快照。線上平台更新後，要重新把最新的 `index.html` 覆蓋到這裡再 push，Pages 才會跟著更新（可日後加進排程自動推）。

## 公開前請先決定（重要）
開 Pages（或把 repo 改 Public）等於把內容公開，包含：
- 案例的 `editNote`（編輯備註）與 `statusWhy`（查證說明）會顯示在頁面上。
- 13 個「待查證」案例會被看到。
- 授權：repo 目前沒有 LICENSE。
`.nojekyll` 讓 Pages 不跑 Jekyll，避免檔案被處理掉。
