// Positions use the game's 0–100 map coordinates. Heights are illustrative scene
// units only, never gameplay measurements. See SOURCES.md for per-record provenance.
export const categories = [
  {id:'all',name:'全部'}, {id:'entrance',name:'入口'}, {id:'flight',name:'交通'}, {id:'bank',name:'银行'},
  {id:'auction',name:'拍卖行'}, {id:'profession',name:'专业',title:'专业训练师'}, {id:'service',name:'服务'}, {id:'npc',name:'NPC'}
];
export const palette = {entrance:'#b9d2a3',flight:'#a9c6ac',bank:'#e3c67e',auction:'#dfab72',profession:'#b8c8d8',service:'#a3b8c8',npc:'#c6add3'};
export const places = [
  {id:'flight',name:'飞行点',person:'塔尔 · 双足飞龙管理员',en:'Tal Wind Rider Master',category:'flight',icon:'flight',area:'中央图腾塔 · 塔顶',x:46.8,y:49.9,h:32,description:'找到城中央最高的图腾塔，进入塔内，沿盘旋坡道登上飞行平台。',source:'codex'},
  {id:'bank',name:'银行',person:'切斯姆 · 银行职员',en:'Chesmu Bank',category:'bank',icon:'bank',area:'中央高地 · 下层',x:47.1,y:57.9,h:12,description:'位于中央高地下层，图腾塔的南侧。银行外可以找到邮箱。',source:'codex'},
  {id:'auction',name:'拍卖行',person:'拍卖师古雷姆',en:'Auctioneer Gullem Auction House',category:'auction',icon:'auction',area:'中央高地 · 下层',x:38.9,y:50.2,h:12,description:'位于图腾塔西侧的下层区域，寻找面向街道的拍卖窗口。',source:'codex'},
  {id:'inn',name:'雷霆崖旅店',person:'旅店老板帕拉',en:'Innkeeper Pala Inn',category:'service',icon:'inn',area:'中央高地 · 下层',x:45.8,y:64.7,h:12,description:'中央高地南端的大型帐篷建筑，可以绑定炉石、购买食物和饮料。',source:'codex'},
  {id:'lift-west',name:'西南升降梯',person:'通往莫高雷',en:'Southwest Mesa Elevator Lift',category:'flight',icon:'lift',area:'中央高地 · 西南崖边',x:31.7,y:65.9,h:12,description:'连接莫高雷地面与主城下层。站在崖边平台等候升降梯到达。',source:'codex'},
  {id:'lift-north',name:'东北升降梯',person:'通往莫高雷',en:'Northeast Mesa Elevator Lift',category:'flight',icon:'lift',area:'中央高地 · 中层北侧',x:54.2,y:26.9,h:16,description:'位于中层北侧的崖边。可以在这里乘升降梯往返莫高雷地面。',source:'codex'},
  {id:'cairne',name:'凯恩·血蹄',person:'牛头人大酋长',en:'Cairne Bloodhoof High Chieftain',category:'npc',icon:'crown',area:'中央高地 · 上层',x:60.3,y:51.7,h:20,description:'位于中央高地东侧的上层大厅。先走上通往上层的坡道，再前往大厅内寻找。',source:'cairne'},
  {id:'druid',name:'德鲁伊训练师',person:'图拉克·符文图腾',en:'Turak Runetotem Druid Trainer',category:'npc',icon:'leaf',area:'长者高地',x:76.5,y:27.2,h:22,description:'通过中央高地东侧的吊桥前往长者高地，在大帐篷附近寻找训练师。',source:'codex'},
  {id:'shaman',name:'萨满祭司训练师',person:'贝拉姆·逐星',en:'Beram Skychaser Shaman Trainer',category:'npc',icon:'spark',area:'灵魂高地',x:22,y:18.8,h:19,description:'通过西北方向的吊桥前往灵魂高地，训练师位于高地表面的大帐篷附近。',source:'codex'},
  {id:'hunter',name:'猎人训练师',person:'卡瑞·雷角',en:'Kary Thunderhorn Hunter Trainer',category:'npc',icon:'bow',area:'猎人高地',x:58.5,y:88.3,h:16,description:'前往南侧的猎人高地，在高地南端的长屋附近寻找。',source:'codex'},
  {id:'warrior',name:'战士训练师',person:'托姆·狂暴图腾',en:'Torm Ragetotem Warrior Trainer',category:'npc',icon:'swords',area:'猎人高地',x:57.2,y:87.4,h:16,description:'位于猎人高地南端，与猎人训练师同在长屋区域。',source:'codex'},
  {id:'zamah',name:'药剂师扎玛',person:'皇家药剂师协会',en:'Apothecary Zamah Pools of Vision',category:'npc',icon:'flask',area:'灵魂高地下方 · 灵魂之池',x:23,y:20.9,h:12,description:'位于灵魂高地下方的洞穴内。先找到通往灵魂之池的洞口，再进入洞穴；不要停留在高地表面。',source:'zamah'},
  {id:'mail',name:'邮箱',person:'收取与寄送邮件',en:'Mailbox Mail',category:'service',icon:'mail',area:'中央高地 · 银行外',x:45.2,y:59.4,h:12,description:'位于下层银行外侧，靠近城中主要服务区域。',source:'codex'},
  {id:'forge',name:'锻造训练师',person:'卡恩·石蹄',en:'Karn Stonehoof Blacksmith Forge Anvil',category:'service',icon:'hammer',area:'中央高地 · 下层',x:39.4,y:55.1,h:12,description:'在下层西侧的铁匠铺附近，可学习锻造并使用炉火和铁砧。',source:'codex'},
  {id:'alchemy',name:'炼金训练师',person:'本娜·冬蹄',en:'Bena Winterhoof Alchemy Trainer',category:'service',icon:'flask',area:'中央高地 · 中层',x:46.6,y:33.2,h:16,description:'位于中央高地北部的中层区域，进入炼金商店寻找。',source:'codex'},
  {id:'weapon',name:'武器大师',person:'安塞瓦',en:'Ansekhwa Weapon Master',category:'service',icon:'swords',area:'中央高地 · 下层',x:40.9,y:62.7,h:12,description:'位于中央高地下层南部，可以学习可用的武器技能。',source:'codex'}
];
export const regions = [
  {name:'灵魂高地',en:'SPIRIT RISE',x:23,y:5,h:19},
  {name:'长者高地',en:'ELDER RISE',x:77,y:16,h:22},
  {name:'猎人高地',en:'HUNTER RISE',x:58,y:99,h:16},
  {name:'中央高地',en:'CENTRAL RISES',x:42,y:75,h:12}
];
export const toWorld = (x,y,h=0) => [(x-50)*1.8,h,(y-50)*1.2];
