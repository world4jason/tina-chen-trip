# 長輩旅行行程助手

來源：`冰島奧捷.xlsx`

## 功能
- 「現在」：顯示前 1 小時到未來 2 小時的重要行程，另外顯示下一件排定事項。
- 「每天」：逐日查看行程與交通銜接。
- 「Checklist」：手機本機儲存打勾狀態。
- PWA：第一次開啟後可快取離線瀏覽。
- 大字、手機優先、無登入。

## 部署到 Vercel
這是一個純靜態站台，不需要 npm / build。

1. 建立 Git repository 並把此資料夾內容放在 repository root。
2. 在 Vercel `New Project` 匯入 repository。
3. Framework Preset 選 `Other`。
4. Build Command 留空，Output Directory 留空，直接 Deploy。

也可用 Vercel CLI 在此資料夾執行 `vercel`。

## 修改行程
所有行程資料集中在 `trip-data.js`。
