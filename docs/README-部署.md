# docs/ — GitHub Pages 部署用

`index.html` 是「台灣議題本位藝術與教育平台」的完整單檔網站，抽自線上版本 `1795358191-f446`（2026-11-22）。自足、無後端，只外連 Google Fonts。

**公開版調整（2026-11-22）**：已清空每筆案例的 `editNote`（編輯備註）內容——該欄位本來就沒顯示在頁面上，但文字仍嵌在原始碼裡，故在公開版移除，避免被看原始碼或搜尋到。`statusWhy`（查證說明）保留顯示。並加入搜尋用的 meta description。原始（含 editNote）版本仍可從線上平台版本歷史取得。

## 怎麼開成網站（由你操作）
1. 這個倉庫目前是 **Private**。GitHub Pages 免費方案需倉庫為 **Public** 才能發佈。
2. **Settings → Pages**，Source 選 **Deploy from a branch**，分支 **main**、資料夾 **/docs**，儲存。
3. 幾分鐘後網址為 `https://joanpan007-alt.github.io/taiwan-issue-art-education/`。預設允許 Google 收錄。

## 更新
此檔是某一時間點的快照。平台更新後，要重新抽取、重做公開版（清 editNote）再覆蓋 push，Pages 才會跟著更新。

## 尚未決定
授權（LICENSE）：目前無。沒有授權時，別人看得到但不能合法再利用。
