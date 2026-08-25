// 旅行社紙本「飯店班機一覽表」補充／修正資料
// 9/5 CI074 為原旅行團返台班機，旅客已確認放棄，不搭乘；後續依自助行程繼續。
Object.assign(window.TRIP_DATA.days, {
  "2026-08-25": {
    title: "台北出發",
    subtitle: "20:10 桃園機場第一航廈集合・23:10 CI073",
    events: [
      { start: "19:20", title: "機場接送出發", detail: "出門前確認護照、手機、行李。", important: true, tags: ["接送"] },
      { start: "20:10", title: "桃園機場 T1 集合", route: "第一航廈・中華航空團體櫃台", detail: "領隊：吳昭蓉小姐｜台灣電話 0937-253-750", map: "桃園國際機場第一航廈", important: true, tags: ["集合", "重要"] },
      { start: "23:10", title: "CI073 台北 → Amsterdam", route: "TPE → AMS", detail: "8/26 07:40 抵達 Amsterdam（+1 日）。座位 30A、30B。", important: true, tags: ["航班", "CI073"] }
    ],
    must: ["20:10 前到桃園機場第一航廈中華航空團體櫃台", "領隊吳昭蓉：0937-253-750", "護照與隨身行李不要放進托運行李"]
  },
  "2026-08-26": {
    title: "Amsterdam → 冰島 Hveragerði",
    subtitle: "CI073 抵達後轉 FI501 前往 Keflavík",
    stay: "Greenhouse Hotel｜Austurmörk 6, 810 Hveragerði｜+354 464 7336",
    events: [
      { start: "07:40", title: "CI073 抵達 Amsterdam", route: "Amsterdam Schiphol Airport", map: "Amsterdam Airport Schiphol", important: true, tags: ["轉機"] },
      { start: "14:10", end: "15:25", title: "FI501 Amsterdam → Keflavík", route: "AMS → KEF", detail: "抵達冰島後依領隊安排前往 Hveragerði。", important: true, tags: ["航班", "FI501"] },
      { title: "今晚：Greenhouse Hotel", detail: "Austurmörk 6, 810 Hveragerði, Iceland\n電話：+354 464 7336", map: "Greenhouse Hotel Hveragerdi Iceland", tags: ["住宿"] }
    ],
    must: ["Amsterdam 轉機搭 FI501 14:10", "今晚住 Greenhouse Hotel（Hveragerði）"]
  },
  "2026-08-27": {
    title: "冰島黃金圈 → Hella",
    subtitle: "團體行程",
    stay: "Strakta Hotel Hella｜4 Rangárflatir, 850 Hella｜+354 531 8010",
    events: [
      { title: "今日團體行程", route: "Hveragerði → 冰島黃金圈 → Hella", detail: "各景點集合時間依領隊當天通知。", important: true, tags: ["團體行程"] },
      { title: "今晚：Strakta Hotel Hella", detail: "4 Rangárflatir, 850 Hella, Iceland\n電話：+354 531 8010", map: "Strakta Hotel Hella Iceland", tags: ["住宿"] }
    ],
    must: ["今日路線：Hveragerði → 黃金圈 → Hella", "集合時間以領隊通知為準"]
  },
  "2026-08-28": {
    title: "南岸瀑布・Vík・冰河湖",
    subtitle: "Hella → Jökulsárlón 一帶",
    stay: "Hotel Jökulsárlón Glacier Lagoon｜Reynivellir, Efribaer, 781 Suðursveit｜+354 449 7000",
    events: [
      { title: "今日團體行程", route: "Hella → Seljalandsfoss → Skógafoss → Vík → 羽毛峽谷 → Jökulsárlón 冰河湖", detail: "各景點停留／集合時間依領隊通知。", important: true, tags: ["團體行程"] },
      { title: "今晚：Hotel Jökulsárlón Glacier Lagoon", detail: "Reynivellir, Efribaer, 781 Suðursveit, Iceland\n電話：+354 449 7000", map: "Hotel Jokulsarlon Glacier Lagoon Iceland", tags: ["住宿"] }
    ],
    must: ["今日重點：兩大瀑布、Vík、羽毛峽谷、Jökulsárlón 冰河湖"]
  },
  "2026-08-29": {
    title: "冰河湖・蝙蝠山・東部峽灣",
    subtitle: "冰島東部",
    stay: "Hotel 1001 Nott｜701 Egilsstaðir｜+354 853 7700",
    events: [
      { title: "今日團體行程", route: "Jökulsárlón 冰河湖 → 蝙蝠山 → 東部峽灣", detail: "各景點集合時間依領隊通知。", important: true, tags: ["團體行程"] },
      { title: "今晚：Hotel 1001 Nott", detail: "701 Egilsstaðir, Iceland\n電話：+354 853 7700", map: "Hotel 1001 Nott Egilsstadir Iceland", tags: ["住宿"] }
    ],
    must: ["今日路線：冰河湖 → 蝙蝠山 → 東部峽灣"]
  },
  "2026-08-30": {
    title: "東部峽灣 → Akureyri",
    subtitle: "峽谷・Mývatn・眾神瀑布",
    stay: "Hotel Kea by Keahotels｜Hafnarstræti, Akureyri｜+354 460 2000",
    events: [
      { title: "今日團體行程", route: "東部峽灣 → Stuðlagil 峽谷 → Mývatn 米湖 → Goðafoss 眾神瀑布 → Akureyri", detail: "各景點集合時間依領隊通知。", important: true, tags: ["團體行程"] },
      { title: "今晚：Hotel Kea by Keahotels", detail: "Hafnarstræti, Akureyri, Iceland\n電話：+354 460 2000", map: "Hotel Kea by Keahotels Akureyri Iceland", tags: ["住宿"] }
    ],
    must: ["今日路線：Stuðlagil → 米湖 → 眾神瀑布 → Akureyri"]
  },
  "2026-08-31": {
    title: "Akureyri → Borgarnes",
    subtitle: "經 Reykholt",
    stay: "Hotel Hamar｜Hamarsvöllur 310, 310 Borgarnes｜+354 433 6600",
    events: [
      { title: "今日團體行程", route: "Akureyri → Reykholt → Borgarnes", detail: "各站集合時間依領隊通知。", important: true, tags: ["團體行程"] },
      { title: "今晚：Hotel Hamar", detail: "Hamarsvöllur 310, 310 Borgarnes, Iceland\n電話：+354 433 6600", map: "Hotel Hamar Borgarnes Iceland", tags: ["住宿"] }
    ],
    must: ["今日路線：Akureyri → Reykholt → Borgarnes"]
  },
  "2026-09-01": {
    title: "Snæfellsnes 半島 → Reykjavík",
    subtitle: "Borgarnes・Búðir・斯奈山半島",
    stay: "Fosshotel Reykjavík｜Þórunnartún 1, Reykjavík｜+354 531 9000",
    events: [
      { title: "今日團體行程", route: "Borgarnes → Búðir → Snæfellsnes 斯奈山半島 → Reykjavík", detail: "各站集合時間依領隊通知。", important: true, tags: ["團體行程"] },
      { title: "今晚：Fosshotel Reykjavík", detail: "Þórunnartún 1, Reykjavík, Iceland\n電話：+354 531 9000", map: "Fosshotel Reykjavik Iceland", tags: ["住宿"] }
    ],
    must: ["今日路線：Borgarnes → Búðir → 斯奈山半島 → Reykjavík"]
  },
  "2026-09-02": {
    title: "Reykjavík・Sky Lagoon",
    subtitle: "天空之湖溫泉",
    stay: "Konvin Hotel - Keflavik Airport｜Keilisbraut 762, 235 Keflavík｜+354 426 5000",
    events: [
      { title: "今日團體行程", route: "Reykjavík → Sky Lagoon 天空之湖溫泉 → Reykjavík／Keflavík", detail: "溫泉與移動集合時間依領隊通知。", important: true, tags: ["團體行程", "溫泉"] },
      { title: "今晚：Konvin Hotel - Keflavik Airport", detail: "Keilisbraut 762, 235 Keflavík, Iceland\n電話：+354 426 5000", map: "Konvin Hotel Keflavik Airport Iceland", tags: ["住宿"] }
    ],
    must: ["今日有 Sky Lagoon 溫泉", "明早搭 FI506，今晚住 Keflavík 機場附近"]
  },
  "2026-09-03": {
    title: "Keflavík → Amsterdam",
    subtitle: "FI506 10:50 → 16:05",
    stay: "Anantara Grand Hotel Krasnapolsky Amsterdam｜Dam 9, 1012 JS Amsterdam｜+31 20 499 0163",
    events: [
      { start: "10:50", end: "16:05", title: "FI506 Keflavík → Amsterdam", route: "KEF → AMS", detail: "抵達 Amsterdam 後前往 Anantara Grand Hotel。", important: true, tags: ["航班", "FI506"] },
      { title: "入住 Anantara Grand Hotel Krasnapolsky", detail: "Dam 9, 1012 JS Amsterdam, Netherlands\n電話：+31 20 499 0163", map: "Anantara Grand Hotel Krasnapolsky Amsterdam", important: true, tags: ["住宿"] }
    ],
    must: ["FI506 10:50 起飛", "抵達 Amsterdam 後入住 Anantara"]
  }
});

// 9/4 仍住 Anantara；9/5 原團回程已放棄，接續自助段。
if (window.TRIP_DATA.days["2026-09-04"]) {
  window.TRIP_DATA.days["2026-09-04"].stay = "Anantara Grand Hotel Krasnapolsky Amsterdam｜Dam 9, 1012 JS Amsterdam｜+31 20 499 0163";
}
if (window.TRIP_DATA.days["2026-09-05"]) {
  window.TRIP_DATA.days["2026-09-05"].events.unshift({
    title: "原團 CI074 回台班機：不搭乘",
    detail: "旅行社原安排 AMS/TPE CI074 11:00／06:15+1；已確定放棄回程機票，後續照自助行程前往羊角村。",
    tags: ["已確認", "不搭乘"]
  });
  window.TRIP_DATA.days["2026-09-05"].must.unshift("CI074 已放棄，不需前往機場；照自助行程走");
}

// 將領隊聯絡資訊加入 Checklist（若尚未存在）。
const firstSection = window.TRIP_DATA.checklistSections && window.TRIP_DATA.checklistSections[0];
if (firstSection && !firstSection.items.some(x => x.id === "group-leader")) {
  firstSection.items.push({ id: "group-leader", text: "領隊電話已存入手機", note: "吳昭蓉 0937-253-750" });
}
