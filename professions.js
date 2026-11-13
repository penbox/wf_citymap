// Representative city trainers plus the existing Ironforge specialization NPC.
// Reference positions do not imply that one NPC teaches every rank.
const professions={
  alchemy:{name:'炼金',en:'Alchemy',icon:'flask',aliases:'炼金术 药水'},
  blacksmithing:{name:'锻造',en:'Blacksmithing',icon:'hammer',aliases:'铁匠 锻造师'},
  enchanting:{name:'附魔',en:'Enchanting',icon:'spark',aliases:'附魔师'},
  engineering:{name:'工程',en:'Engineering',icon:'gear',aliases:'工程学 工程师'},
  'gnomish-engineering':{name:'侏儒工程',en:'Gnomish Engineering',icon:'gear',aliases:'侏儒工程学 工程专精'},
  herbalism:{name:'草药学',en:'Herbalism',icon:'leaf',aliases:'草药 采药 采集草药'},
  leatherworking:{name:'制皮',en:'Leatherworking',icon:'hide',aliases:'皮革 制皮师'},
  mining:{name:'采矿',en:'Mining',icon:'pickaxe',aliases:'挖矿 矿工 矿石 熔炼'},
  skinning:{name:'剥皮',en:'Skinning',icon:'hide',aliases:'扒皮 剥皮师'},
  tailoring:{name:'裁缝',en:'Tailoring',icon:'needle',aliases:'缝纫 裁缝师 布甲'},
  cooking:{name:'烹饪',en:'Cooking',icon:'pot',aliases:'做饭 厨师 烹饪师'},
  fishing:{name:'钓鱼',en:'Fishing',icon:'fish',aliases:'垂钓 渔夫'},
  'first-aid':{name:'急救',en:'First Aid',icon:'bandage',aliases:'绷带 医生 FirstAid'}
};

// [profession, NPC, map x, map y, area, schematic height, orientation hint]
const records={
  'thunder-bluff':[
    ['alchemy','Bena Winterhoof',46.6,33.2,'中央高地 · 中层',16,'在中层北侧的炼金商店寻找。'],
    ['blacksmithing','Karn Stonehoof',39.4,55.1,'中央高地 · 下层',12,'在下层西侧的铁匠铺寻找，附近有炉火和铁砧。'],
    ['enchanting','Mot Dawnstrider',44.6,38.5,'中央高地 · 中层',16,'位于中央高地中层的附魔商店。'],
    ['herbalism','Komin Winterhoof',50,40.4,'中央高地 · 中层',16,'沿中层道路前往东侧的草药商店。'],
    ['leatherworking','Una',41.5,42.6,'中央高地 · 中层',16,'在中层西侧的皮甲商店寻找制皮训练师。'],
    ['mining','Brek Stonehoof',34.4,57.9,'中央高地 · 下层',12,'位于下层西侧的石蹄地质学店，靠近西南升降梯方向。'],
    ['skinning','Mooranta',44.4,43.2,'中央高地 · 中层',16,'位于中层皮甲商店附近，与制皮训练区相邻。'],
    ['tailoring','Tepa',44.5,45.4,'中央高地 · 中层',16,'在中层的裁缝商店寻找。'],
    ['cooking','Aska Mistrunner',50.7,53.1,'中央高地 · 上层',20,'前往上层的阿斯卡厨房，不要停留在下层银行一带。'],
    ['fishing','Kah Mistrunner',56.1,46.4,'中央高地 · 上层',20,'在上层的渔具店寻找钓鱼训练师。'],
    ['first-aid','Pand Stonebinder',29.7,21.2,'灵魂高地 · 地表帐篷',19,'进入灵魂高地表面的治疗帐篷；训练师不在下方的灵魂之池洞穴内。']
  ],
  orgrimmar:[
    ['alchemy','Yelmak',56.8,33,'暗巷区',3,'位于暗巷区北端的炼金商店。'],
    ['blacksmithing','Saru Steelfury',82.3,23,'荣誉谷',3,'在荣誉谷东侧的铁匠铺寻找。'],
    ['enchanting','Godan',53.9,38.7,'暗巷区',3,'沿暗巷区道路进入附魔商店。'],
    ['engineering','Nogg',76,25.4,'荣誉谷',3,'在荣誉谷东部的诺格机械店寻找，附近也有其他工程训练师。'],
    ['herbalism','Jandi',55.6,39.5,'暗巷区',3,'位于暗巷区的草药商店，靠近附魔商店。'],
    ['leatherworking','Karolek',62.8,44.1,'暗巷区',3,'在暗巷区东侧的制皮商店寻找。'],
    ['mining','Makaru',73.1,26.1,'荣誉谷',3,'前往荣誉谷的采矿商店，位置靠近工程与锻造训练区。'],
    ['skinning','Thuwd',63.4,45.4,'暗巷区',3,'位于暗巷区制皮商店附近。'],
    ['tailoring','Magar',63.6,49.9,'暗巷区',3,'位于暗巷区南段的裁缝商店。'],
    ['cooking','Zamja',57.4,54,'暗巷区 · 南端',3,'在暗巷区南端的烹饪区域寻找。'],
    ['fishing','Lumak',69.8,29.2,'荣誉谷 · 水池旁',3,'在荣誉谷南侧的水池附近寻找。'],
    ['first-aid','Arnok',34.2,84.6,'精神谷',3,'前往城南的精神谷，在急救训练区域寻找。']
  ],
  undercity:[
    ['alchemy','Doctor Herbert Halsey',47.8,73.3,'下层 · 炼金房',3,'沿下层环城道路进入西南侧炼金房。'],
    ['blacksmithing','Basil Frye',60.2,29.1,'下层 · 军事区',3,'在军事区靠近内环的铁匠铺寻找。'],
    ['enchanting','Lavinia Crowe',62.5,61.8,'下层 · 炼金房内环',3,'位于炼金房靠近环城道路的附魔商店。'],
    ['engineering','Franklin Lloyd',76.1,74,'下层 · 盗贼区',3,'进入东南侧盗贼区，在工程商店寻找。'],
    ['herbalism','Martha Alliestar',54,49.5,'下层 · 炼金房内环',3,'在下层西侧的草药商店寻找，靠近炼金房方向。'],
    ['leatherworking','Arthur Moore',70.2,57.4,'下层 · 盗贼区内环',3,'在盗贼区靠近环城道路的皮革商店寻找。'],
    ['mining','Brom Killian',56,37.5,'下层 · 军事区内环',3,'在下层西北侧的采矿商店寻找。'],
    ['skinning','Killian Hagey',70.2,59.2,'下层 · 盗贼区内环',3,'位于盗贼区的皮革商店附近。'],
    ['tailoring','Josef Gregorian',70.8,30.7,'下层 · 魔法区内环',3,'在魔法区靠近环城道路的裁缝商店寻找。'],
    ['cooking','Eunice Burch',62.1,44.9,'下层 · 贸易区',3,'烹饪训练师在贸易区下层。请从银行平台下楼，不要在飞行点所在的上环寻找。'],
    ['fishing','Armand Cromwell',80.7,31.3,'下层 · 魔法区运河旁',3,'在魔法区附近的运河边寻找。'],
    ['first-aid','Mary Edras',73.2,55.1,'下层 · 盗贼区内环',3,'沿下层内环前往盗贼区，在急救摊位寻找。']
  ],
  stormwind:[
    ['alchemy','Lilyssia Nightbreeze',55.7,86.1,'法师区',3,'前往法师区东南侧的炼金商店。'],
    ['blacksmithing','Therum Deepforge',63.7,37,'矮人区',3,'在矮人区的铁匠铺寻找，附近有炉火与铁砧。'],
    ['enchanting','Lucan Cordell',52.9,74.5,'运河 · 法师区北侧',3,'在法师区北侧、靠近运河的附魔商店寻找。'],
    ['engineering','Lilliam Sparkspindle',62.1,30.3,'矮人区',3,'位于矮人区北侧的工程商店。'],
    ['herbalism','Tannysa',54.3,84.1,'法师区',3,'位于法师区的草药商店附近。'],
    ['leatherworking','Simon Tanner',71.7,63,'旧城区',3,'在旧城区南侧的皮革商店寻找。'],
    ['mining','Gelman Stonehand',59.3,37.8,'矮人区',3,'前往矮人区西侧的采矿商店。'],
    ['skinning','Maris Granger',72.1,62.2,'旧城区',3,'位于旧城区皮革商店附近，与制皮训练师相邻。'],
    ['tailoring','Georgio Bolero',53.1,81.3,'法师区',3,'在法师区东北侧的裁缝商店寻找。'],
    ['cooking','Stephen Ryback',78.2,53.1,'旧城区',3,'前往旧城区的烹饪训练区域。'],
    ['fishing','Arnold Leland',55,69.6,'贸易区 · 运河旁',3,'在贸易区西北侧的运河边寻找钓鱼训练师。'],
    ['first-aid','Shaina Fuller',53,44.7,'教堂广场 · 光明大教堂',5,'进入光明大教堂，在急救训练区域寻找。']
  ],
  ironforge:[
    ['alchemy','Tally Berryfizz',66.6,55.7,'侏儒区',3,'位于侏儒区南侧的炼金商店。'],
    ['blacksmithing','Bengus Deepforge',52.5,41.5,'大锻炉',3,'在中央大锻炉附近寻找，炉火与铁砧也集中在这一带。'],
    ['enchanting','Gimble Thistlefuzz',59.8,45.4,'大锻炉 · 东侧',3,'在大锻炉东侧的附魔商店寻找。'],
    ['engineering','Springspindle Fizzlegear',68.5,43.5,'侏儒区',3,'位于侏儒区北侧的工程商店，可咨询常规工程训练。'],
    ['gnomish-engineering','Tinkmaster Overspark',69.5,50.3,'侏儒区 · 工程专精',3,'这位 NPC 提供侏儒工程专精相关服务。学习常规工程技能请先找同区的 Springspindle Fizzlegear。'],
    ['herbalism','Reyna Stonebranch',55.9,59.1,'大锻炉 · 南侧',3,'沿大锻炉南侧环路寻找草药训练师。'],
    ['leatherworking','Fimble Finespindle',40.2,33.7,'大锻炉 · 西北侧',3,'在大锻炉西北侧的皮革商店寻找。'],
    ['mining','Geofram Bouldertoe',50,26.3,'大锻炉 · 北侧',3,'位于大锻炉北侧的采矿商店。'],
    ['skinning','Balthus Stoneflayer',39.9,32.5,'大锻炉 · 西北侧',3,'位于皮革商店附近，与制皮训练师相邻。'],
    ['tailoring','Jormund Stonebrow',43.1,29.4,'大锻炉 · 北侧',3,'在大锻炉北侧的裁缝商店寻找。'],
    ['cooking','Daryl Riknussun',60.1,36.4,'大锻炉 · 东北侧',3,'在大锻炉东北侧的烹饪区域寻找。'],
    ['fishing','Grimnur Stonebrand',48.1,6.9,'荒弃的洞穴',3,'进入北侧荒弃的洞穴，在水边寻找钓鱼训练师。'],
    ['first-aid','Nissa Firestone',55.1,58.3,'大锻炉 · 南侧',3,'位于大锻炉南侧的急救训练区域。']
  ],
  darnassus:[
    ['alchemy','Ainethil',54.9,24,'工匠区',5,'位于工匠区西南侧的炼金商店。'],
    ['enchanting','Taladan',58.4,13.1,'工匠区',5,'在工匠区北侧的附魔商店寻找。'],
    ['herbalism','Firodren Mooncaller',47.9,68,'神殿花园',3,'沿神殿花园的步道向南，在月神殿北侧附近寻找。'],
    ['leatherworking','Telonis',64.4,21.5,'工匠区',5,'位于工匠区东南侧的皮革商店。'],
    ['skinning','Eladriel',64.1,22.3,'工匠区',5,'位于工匠区皮革商店附近。'],
    ['tailoring',"Me'lynn",63.4,22.4,'工匠区',5,'在工匠区东南侧的裁缝商店寻找。'],
    ['cooking','Alegorn',49,21.2,'工匠区',5,'在工匠区西侧的烹饪区域寻找。'],
    ['fishing','Astaia',47.9,56.6,'神殿花园 · 湖畔',3,'沿神殿花园湖边步道寻找钓鱼训练师。'],
    ['first-aid','Dannelor',51.7,12.2,'工匠区',5,'在工匠区北部的急救训练区域寻找。']
  ]
};

export function addProfessionTrainers(city){
  const source=['orgrimmar','darnassus'].includes(city.id)
    ?`https://pd.zroot.it/forever/map/kalimdor/${city.id}`
    :`https://forever-codex.com/map/${city.mapSlug}/`;
  const trainers=(records[city.id]||[]).map(([profession,npc,x,y,area,h,description])=>{
    const info=professions[profession];
    const id=profession==='blacksmithing'?'forge':profession==='gnomish-engineering'?'engineering':city.id==='ironforge'&&profession==='engineering'?'engineering-basic':profession;
    return {id,name:`${info.name}训练师`,person:npc,
      en:`${npc} ${info.en} Trainer`,aliases:info.aliases,profession:profession==='gnomish-engineering'?'engineering':profession,category:'profession',icon:info.icon,area,x,y,h,description,source,
      ...(profession==='gnomish-engineering'?{specialization:'gnomish',roleSource:'https://warcraft.wiki.gg/wiki/Engineering_trainers'}:{}),
      ...(city.id==='undercity'?{level:'lower'}:{}),
      ...(city.id==='thunder-bluff'&&profession==='first-aid'?{areaSource:'https://news.blizzard.com/en-gb/article/23178672/wow-classic-city-tour-thunder-bluff'}:{})};
  });
  const byId=new Map(trainers.map(t=>[t.id,t])),existingIds=new Set(city.places.map(p=>p.id));
  // Replace existing alchemy/forge/engineering records in place, preserving links.
  const merged=city.places.map(point=>{
    const trainer=byId.get(point.id);if(!trainer)return point;
    return {...point,...trainer,aliases:`${trainer.aliases} ${point.person} ${point.en}`};
  });
  return [...merged,...trainers.filter(t=>!existingIds.has(t.id))];
}
