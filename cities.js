import {places as thunderPlaces,regions as thunderRegions} from './data.js';
import {addProfessionTrainers} from './professions.js';

// x/y are source map coordinates, h is illustrative model height. Sources and
// coordinate frames are retained separately from the compact visitor-facing UI.
const p=(id,name,person,en,category,icon,area,x,y,h,description,source='codex')=>({id,name,person,en,category,icon,area,x,y,h,description,source});
const r=(name,en,x,y,h=3)=>({name,en,x,y,h});
const note='地点主要依据经典旧世资料，尚未在“无限”正式服逐点核验。地图、建筑和高低差为轻量示意；请结合游戏内地图与卫兵指引使用。';
const definitions=[
  {
    id:'thunder-bluff',name:'雷霆崖',en:'THUNDER BLUFF',faction:'部落',continent:'KALIMDOR · MULGORE',motto:'愿大地母亲指引你的道路。',
    map:'assets/reference-map.webp',mapSlug:'thunder-bluff',places:thunderPlaces,regions:thunderRegions,
    target:[4,9,1],background:'#303b2d',description:'高地轮廓和吊桥连接参考游戏地图重绘，建筑外观与高低差经过简化。',note
  },
  {
    id:'orgrimmar',name:'奥格瑞玛',en:'ORGRIMMAR',faction:'部落',continent:'KALIMDOR · DUROTAR',motto:'力量与荣耀。',map:'assets/orgrimmar.webp',mapSlug:'orgrimmar',
    target:[0,5,0],background:'#44342a',description:'以峡谷中的各座山谷为骨架，保留力量谷、暗巷区、荣誉谷与智慧谷的位置关系。暗影裂口采用敞顶示意。',note,
    regions:[r('力量谷','VALLEY OF STRENGTH',50,79),r('智慧谷','VALLEY OF WISDOM',38,27,9),r('荣誉谷','VALLEY OF HONOR',74,8,5),r('暗巷区','THE DRAG',64,51),r('暗影裂口','CLEFT OF SHADOW',45,56),r('精神谷','VALLEY OF SPIRITS',35,94)],
    places:[
      p('flight','飞行点','多拉斯 · 双足飞龙管理员','Doras Wind Rider Master','flight','flight','力量谷 · 飞行塔',45.1,63.9,18,'在力量谷寻找高塔，沿坡道上到飞行平台。管理员不在塔底。','https://wowforever.gg/en/atlas/knowledge/npcs/doras-n3310/'),
      p('bank','银行','卡鲁斯 · 银行职员','Karus Bank','bank','bank','力量谷',49.6,69.1,3,'位于力量谷的主要服务区，靠近旅店与邮箱。'),
      p('auction','拍卖行','拍卖师格里夫','Auctioneer Grimful Auction House','auction','auction','力量谷',55.3,61.8,3,'位于力量谷东北侧，银行与拍卖行之间可沿谷底街道往返。'),
      p('inn','旅店','旅店老板格雷什卡','Innkeeper Gryshka','service','inn','力量谷',54.1,68.4,3,'进入力量谷后寻找东侧旅店，可绑定炉石。'),
      p('thrall','萨尔','部落大酋长','Thrall Warchief','npc','crown','智慧谷 · 格罗玛什堡',31.7,37.8,6,'前往西北方向的智慧谷，在格罗玛什堡内寻找。','https://forevermastery.com/en/npcs/4949'),
      p('hunter','猎人训练师','猎人职业训练','Ormak Grimshot Hunter Trainer','npc','bow','荣誉谷',66,18.5,3,'沿暗巷区向东北进入荣誉谷，再往谷地北侧寻找。'),
      p('warrior','战士训练师','战士职业训练','Sorek Warrior Trainer','npc','swords','荣誉谷 · 勇者大厅',80.4,32.4,3,'位于荣誉谷东南侧的勇者大厅内。'),
      p('warlock','术士训练师','术士职业训练','Grol dar Warlock Trainer','npc','flask','暗影裂口',48,45.9,1,'从暗巷区附近进入暗影裂口，训练师位于低处的洞穴区域。'),
      p('shaman','萨满祭司训练师','萨满祭司职业训练','Sagorne Creststrider Shaman Trainer','npc','spark','智慧谷',38.7,35.9,6,'进入智慧谷，在格罗玛什堡附近的训练师区域寻找。'),
      p('alchemy','炼金训练师','炼金术训练','Yelmak Alchemy Trainer','service','flask','暗巷区',56.8,33,3,'位于暗巷区北端的炼金商店。'),
      p('forge','锻造训练师','锻造训练与炉火','Saru Steelfury Blacksmith Forge','service','hammer','荣誉谷',82.3,23,3,'位于荣誉谷东侧的铁匠铺。'),
      p('mail','邮箱','收取与寄送邮件','Mailbox Mail','service','mail','力量谷 · 银行外',50.7,70.4,3,'位于力量谷银行外侧。')
    ]
  },
  {
    id:'undercity',name:'幽暗城',en:'UNDERCITY',faction:'部落',continent:'EASTERN KINGDOMS · TIRISFAL',motto:'愿黑暗女王庇护你。',map:'assets/undercity.webp',mapSlug:'undercity',
    target:[20,4,2],background:'#1f302d',description:'以敞顶方式展示地下环城结构，保留中央贸易区、环形运河和四个城区。北面的洛丹伦废墟与地下城分层表现。',note,
    regions:[r('贸易区','TRADE QUARTER',66,43,8),r('军事区','WAR QUARTER',48,23,3),r('魔法区','MAGIC QUARTER',85,24,3),r('盗贼区','ROGUES’ QUARTER',85,79,3),r('炼金房','THE APOTHECARIUM',46,78,3),r('皇家区','ROYAL QUARTER',57,99,3),r('洛丹伦废墟','RUINS OF LORDAERON',65,4,18)],
    places:[
      p('flight','飞行点','迈克尔·加勒特 · 蝙蝠管理员','Michael Garrett Bat Handler','flight','flight','贸易区 · 地下',63.3,48.6,4,'先进入地下贸易区，再寻找中央区域南侧的蝙蝠飞行管理员。','https://forevermastery.com/en/npcs/4551'),
      p('bank','银行','奥菲利亚·蒙塔古 · 银行职员','Ophelia Montague Bank','bank','bank','贸易区 · 中央平台',65.6,44.1,6,'银行位于地下城中央的圆形平台上，四周通向贸易区。'),
      p('auction','拍卖行','拍卖师凯恩','Auctioneer Cain Auction House','auction','auction','贸易区 · 北侧环廊',67.7,35.9,4,'拍卖师分布在内环周围；此标记指向北侧的一处拍卖窗口。'),
      p('inn','旅店','旅店老板诺曼','Innkeeper Norman','service','inn','贸易区 · 北侧',67.7,37.9,4,'位于地下贸易区北侧，靠近内环拍卖服务。'),
      p('lift-west','西侧升降梯','往返洛丹伦废墟','West Undervator Elevator','flight','lift','贸易区 · 西侧',60.6,44,4,'连接地面废墟与地下贸易区。等待梯厢停稳后进入。'),
      p('lift-east','东侧升降梯','往返洛丹伦废墟','East Undervator Elevator','flight','lift','贸易区 · 东侧',71.4,44.2,4,'由东侧升降梯往返地面与地下城。'),
      p('lift-south','南侧升降梯','往返洛丹伦废墟','South Undervator Elevator','flight','lift','贸易区 · 南侧',65.9,52.1,4,'位于中央贸易区南侧的升降梯入口。'),
      p('sylvanas','希尔瓦娜斯','被遗忘者领袖','Lady Sylvanas Windrunner Banshee Queen','npc','crown','皇家区',58.1,91.8,3,'沿环城道路前往西南侧炼金房，再经通道进入更深处的皇家区。','https://forevermastery.com/en/npcs/10181'),
      p('mage','法师训练师','法师职业训练','Anastasia Hartwell Mage Trainer','npc','spark','魔法区',85.1,10,3,'魔法区位于地下城东北侧；从内环进入该区后继续向北。'),
      p('warrior','战士训练师','战士职业训练','Christoph Walker Warrior Trainer','npc','swords','军事区',46.9,15.2,3,'军事区位于地下城西北侧。'),
      p('rogue','盗贼训练师','盗贼职业训练','Carolyn Ward Rogue Trainer','npc','swords','盗贼区',83.9,72.1,3,'盗贼区位于地下城东南侧，沿环城道路进入。'),
      p('alchemy','炼金训练师','炼金术训练','Doctor Herbert Halsey Alchemy Trainer','service','flask','炼金房',47.8,73.3,3,'位于地下城西南侧的炼金房，附近通向皇家区。')
    ]
  },
  {
    id:'stormwind',name:'暴风城',en:'STORMWIND',faction:'联盟',continent:'EASTERN KINGDOMS · ELWYNN',motto:'愿圣光与你同在。',map:'assets/stormwind.webp',mapSlug:'stormwind-city',
    target:[8,4,6],background:'#293f46',description:'以“无限”扩大后的地图为参考，包含西侧暴风港、运河与城区桥梁。建筑采用蓝顶石屋的简化表达。',
    note:'暴风城使用“无限”扩大后的地图范围及相应地图坐标，不直接套用旧版百分比。NPC 记录仍主要源自经典资料，尚未在“无限”正式服逐点核验。',
    regions:[r('贸易区','TRADE DISTRICT',63,85),r('法师区','MAGE QUARTER',46,96),r('教堂广场','CATHEDRAL SQUARE',52,57),r('旧城区','OLD TOWN',78,59),r('矮人区','DWARVEN DISTRICT',64,25),r('暴风要塞','STORMWIND KEEP',84,44,7),r('暴风港','STORMWIND HARBOR',20,48),r('花园','THE PARK',34,72)],
    places:[
      p('flight','飞行点','杜加尔·朗德瑞克 · 狮鹫管理员','Dungar Longdrink Gryphon Master','flight','flight','贸易区 · 狮鹫平台',71,72.5,10,'从贸易区沿坡道登上东侧的狮鹫平台。','https://forevermastery.com/en/npcs/category/stormwind-city'),
      p('bank','银行','牛顿·伯恩赛德 · 银行职员','Newton Burnside Bank','bank','bank','贸易区',63.9,81.1,3,'位于贸易区南侧的大型石质建筑内。'),
      p('auction','拍卖行','拍卖师贾克森','Auctioneer Jaxon Auction House','auction','auction','贸易区',61.2,70.7,3,'位于贸易区北侧，靠近运河方向的街道。'),
      p('inn','镶金玫瑰','旅店老板奥里森','Innkeeper Allison Gilded Rose','service','inn','贸易区',60.4,75.3,3,'贸易区内的旅店，可以绑定炉石。'),
      p('harbor','暴风港','港口与码头','Stormwind Harbor Auberdine Boat','flight','ship','暴风城 · 西岸',26.5,33.5,1,'沿西侧道路下到暴风港。前往奥伯丁的船只请在码头确认目的地；这里标注港区入口。','map-art'),
      p('tram','矿道地铁入口','往返铁炉堡','Deeprun Tram Ironforge','flight','train','矮人区',69.2,31.4,3,'在矮人区东北侧进入地铁通道，站台位于独立场景内。','map-art'),
      p('mage','法师训练师','法师职业训练','Maginor Dumas Mage Wizard Sanctum','npc','spark','法师区 · 巫师圣殿',49.3,87.8,12,'寻找法师区的高塔，沿塔内通道前往巫师圣殿。'),
      p('priest','牧师训练师','牧师职业训练','High Priestess Laurena Priest Cathedral','npc','spark','光明大教堂',49.5,44.6,5,'先到教堂广场，再进入北侧的光明大教堂。'),
      p('warrior','战士训练师','战士职业训练','Wu Shen Warrior Command Center','npc','swords','旧城区 · 指挥中心',80.6,59.9,3,'进入东侧旧城区，在指挥中心内寻找训练师。'),
      p('shaw','马迪亚斯·肖尔','军情七处领袖','Master Mathias Shaw SI 7','npc','crown','旧城区 · 军情七处',78.3,70.7,7,'进入旧城区南部的军情七处建筑，在楼上寻找。','https://pd.zroot.it/forever/map/eastern-kingdoms/stormwind-city'),
      p('engineering','工程训练师','工程学训练','Lilliam Sparkspindle Engineering','service','hammer','矮人区',62.1,30.3,3,'位于矮人区北侧的工程商店。'),
      p('mail','邮箱','收取与寄送邮件','Mailbox Mail','service','mail','贸易区',61.6,76.1,3,'位于贸易区旅店附近。')
    ]
  },
  {
    id:'ironforge',name:'铁炉堡',en:'IRONFORGE',faction:'联盟',continent:'EASTERN KINGDOMS · DUN MOROGH',motto:'愿你的炉火永不熄灭。',map:'assets/ironforge.webp',mapSlug:'ironforge',
    target:[0,4,0],background:'#302b29',description:'以敞顶方式展示山体内的环形城区，大锻炉、熔岩沟与通向各大厅的道路作为主要地标。',note,
    regions:[r('大锻炉','THE GREAT FORGE',49,50,5),r('平民区','THE COMMONS',28,82),r('秘法区','MYSTIC WARD',25,20),r('荒弃的洞穴','FORLORN CAVERN',48,2),r('探险者大厅','HALL OF EXPLORERS',69,14),r('侏儒区','TINKER TOWN',71,57),r('军事区','MILITARY WARD',70,97),r('矿道地铁','DEEPRUN TRAM',88,59)],
    places:[
      p('flight','飞行点','格莱斯·瑟登 · 狮鹫管理员','Gryth Thurden Gryphon Master','flight','flight','大锻炉 · 东侧',55.5,47.7,3,'沿环形道路来到大锻炉，在锻炉东侧寻找狮鹫管理员。','https://forevermastery.com/en/npcs/1573'),
      p('bank','银行','巴纳姆·石衣 · 银行职员','Barnum Stonemantle Vault Bank','bank','bank','平民区 · 铁炉堡金库',35,58.4,3,'位于平民区靠内侧的金库建筑内。'),
      p('auction','拍卖行','拍卖师红须','Auctioneer Redmuse Auction House','auction','auction','平民区',24.2,74.7,3,'进入主城后沿平民区道路寻找拍卖行，与银行分列街道两侧区域。'),
      p('inn','石火旅店','旅店老板洛雷·火酒','Innkeeper Firebrew Stonefire Tavern','service','inn','平民区 · 西侧',18.2,51.4,3,'位于平民区西侧的旅店，可以绑定炉石。'),
      p('magni','麦格尼·铜须','铁炉堡国王','King Magni Bronzebeard','npc','crown','王座厅',39.1,56.2,5,'在大锻炉西南侧寻找通向王座厅的入口。','https://forevermastery.com/en/npcs/2784'),
      p('mage','法师训练师','宾克 · 法师训练师','Bink Mage Hall of Mysteries','npc','spark','秘法区 · 秘法大厅',27.2,8.3,4,'前往西北方向的秘法区，进入北侧大厅。'),
      p('warrior','战士训练师','战士职业训练','Kelstrum Stonebreaker Warrior','npc','swords','军事区 · 武器大厅',67,90.1,4,'位于主城东南端的武器大厅内。'),
      p('forge','锻造训练师','锻造训练与铁砧','Bengus Deepforge Blacksmith','service','hammer','大锻炉',52.5,41.5,3,'位于中央大锻炉附近，炉火与铁砧也集中在这一带。'),
      p('engineering','工程训练师','工程学训练','Tinkmaster Overspark Engineering','service','hammer','侏儒区',69.5,50.3,3,'从大锻炉向东进入侏儒区，在机械装置与商店附近寻找。'),
      p('alchemy','炼金训练师','炼金术训练','Tally Berryfizz Alchemy','service','flask','侏儒区',66.6,55.7,3,'位于侏儒区南侧的商店。'),
      p('tram','矿道地铁入口','往返暴风城','Deeprun Tram Stormwind','flight','train','侏儒区 · 东侧通道',76.5,51.2,3,'从侏儒区向东进入通道，穿过入口后到达独立的地铁站。','map-art'),
      p('mail','邮箱','收取与寄送邮件','Mailbox Mail','service','mail','银行外',33.2,64.7,3,'位于铁炉堡金库外的街道旁。')
    ]
  },
  {
    id:'darnassus',name:'达纳苏斯',en:'DARNASSUS',faction:'联盟',continent:'KALIMDOR · TELDRASSIL',motto:'愿群星照亮你的道路。',map:'assets/darnassus.webp',mapSlug:'darnassus',
    target:[4,5,0],background:'#263747',description:'保留神殿花园的湖水、中央步道和东侧阶地，用巨树、紫色屋顶与月神殿表现暗夜精灵主城。',note,
    regions:[r('塞纳里奥区','CENARION ENCLAVE',35,2,8),r('工匠区','CRAFTSMEN’S TERRACE',61,5,5),r('战士区','WARRIOR’S TERRACE',67,43,7),r('贸易区','TRADESMEN’S TERRACE',63,76,5),r('神殿花园','TEMPLE GARDENS',32,60),r('月神殿','TEMPLE OF THE MOON',39,97,7)],
    places:[
      p('portal','鲁瑟兰村传送门','前往村内飞行点与码头','Rut theran Village Portal Flight Boat','flight','portal','神殿花园 · 西侧',30,41,3,'穿过粉色传送门到鲁瑟兰村，再寻找飞行管理员或码头。此处标记的是城内传送门。','https://www.wowhead.com/wotlk/zone=1657/darnassus'),
      p('bank','银行','加瑞斯 · 银行职员','Garryeth Bank','bank','bank','神殿花园 · 中央',39.6,42,3,'位于神殿花园中央的银行建筑，沿湖中的步道可到达。'),
      p('auction','拍卖行','拍卖师卡扎雷兹','Auctioneer Cazarez Auction House','auction','auction','贸易区 · 北侧',55.6,52.4,5,'位于贸易区北侧，靠近通往战士区与神殿花园的道路。'),
      p('inn','旅店','旅店老板塞琳娜','Innkeeper Saelienne','service','inn','工匠区',67.4,15.6,5,'位于东北方向的工匠区，旅店在阶地上的建筑内。'),
      p('tyrande','泰兰德·语风','艾露恩的高阶女祭司','Tyrande Whisperwind High Priestess','npc','crown','月神殿 · 上层',39.1,81.6,12,'前往南侧月神殿，进入神殿后沿坡道前往上层。','https://forevermastery.com/en/npcs/7999'),
      p('druid','德鲁伊训练师','德鲁伊职业训练','Mathrengyl Bearwalker Druid','npc','leaf','塞纳里奥区',35.4,8.4,8,'前往西北方向的塞纳里奥区，在巨树上的训练师区域寻找。'),
      p('hunter','猎人训练师','猎人职业训练','Jocaste Hunter Trainer','npc','bow','塞纳里奥区',40.4,8.5,8,'位于塞纳里奥区北部的树屋区域。'),
      p('warrior','战士训练师','战士职业训练','Arias ta Bladesinger Warrior','npc','swords','战士区',58.7,34.9,7,'战士区位于主城东侧，训练师在阶地北部。'),
      p('priest','牧师训练师','牧师职业训练','Astarii Starseeker Priest','npc','spark','月神殿',38.3,81,6,'进入南侧月神殿，在神殿内寻找牧师训练师。'),
      p('alchemy','炼金训练师','炼金术训练','Ainethil Alchemy Trainer','service','flask','工匠区',54.9,24,5,'位于工匠区西南侧的商店。'),
      p('riding','骑术训练师','贾萨姆 · 骑术训练师','Jartsam Riding Trainer','service','leaf','塞纳里奥区',38.7,15.8,5,'在塞纳里奥区的豹类坐骑区域附近寻找。'),
      p('mail','邮箱','收取与寄送邮件','Mailbox Mail','service','mail','银行旁',41.6,41.8,3,'位于中央银行附近，沿步道前往。')
    ]
  }
];
// Entrance anchors follow the supplied map art; they mark arrival areas, not
// client collision coordinates. Existing transport IDs stay valid for old links.
const entrances={
  orgrimmar:[
    p('gate-south','南部正门','来自杜隆塔尔','Main Gate South Entrance Durotar','entrance','gate','力量谷 · 南侧城门',50.5,91.5,3,'从杜隆塔尔北上，穿过南侧城门进入力量谷。银行、拍卖行和飞行塔都在这一带。','map-art'),
    p('gate-west','西侧城门','来自怒水河方向','Talon Gate West Entrance','entrance','gate','奥格瑞玛 · 西侧通道',16.5,61.5,3,'从城西方向经过城门，沿峡谷通道进入城内，再前往力量谷或精神谷。','map-art')
  ],
  undercity:[
    p('gate-main','洛丹伦正门','地面入口 · 通往升降梯','Lordaeron Main Gate Entrance','entrance','gate','地面 · 洛丹伦废墟',66,6,39,'先进入洛丹伦废墟，穿过庭院与王座厅，沿通道寻找升降梯。主城服务区位于地下。','map-art'),
    p('gate-sewer','下水道入口','西侧进城通道','Sewers West Entrance Tirisfal','entrance','gate','下层 · 西侧下水道',16.5,33.5,3,'从西侧下水道通道进城，沿可步行的侧道进入运河区，无须经过正门升降梯。','map-art')
  ],
  stormwind:[p('gate-main','英雄谷入口','来自艾尔文森林','Valley of Heroes Main Gate Entrance Elwynn','entrance','gate','暴风城 · 东南正门',73.5,91.5,3,'从艾尔文森林经过英雄谷进入暴风城，沿主路与桥梁前往贸易区。','map-art')],
  ironforge:[p('gate-main','铁炉堡大门','来自丹莫罗','Gates of Ironforge Main Gate Entrance Dun Morogh','entrance','gate','平民区 · 西南大门',18,82.5,3,'沿丹莫罗的山路上行，穿过西南大门进入平民区。','map-art')],
  darnassus:[p('gate-east','泰达希尔入口','来自多兰纳尔方向','Darnassus East Gate Entrance Teldrassil Dolanaar','entrance','gate','战士区 · 东门',88,39,3,'从泰达希尔内陆沿道路向西，经东侧大门进入战士区。','map-art')]
};
const entranceIds={'thunder-bluff':['lift-west','lift-north'],undercity:['lift-west','lift-east','lift-south'],stormwind:['tram','harbor'],ironforge:['tram'],darnassus:['portal']};
const uc=definitions.find(c=>c.id==='undercity');
uc.target=[20,15,2];uc.offset=[65,102,145];uc.zoom=.82;
uc.levels=['all','surface','upper','lower'];
uc.layerViews={surface:{target:[28,36,-14],zoom:1.15},upper:{target:[28,15,-5],zoom:2.2},lower:{target:[20,4,2],zoom:.9}};
uc.description='幽暗城按地面废墟、银行平台与上层环廊、下层运河及四区分层绘制。全景保留楼梯、坡道和电梯井；层级按钮可单独查看各部分。相对高度与连接路径经过简化。';
uc.regions=[
  {...r('上层环廊','UPPER WALKWAY',66,34,20),level:'upper'},
  {...r('银行平台','BANK PLATFORM',66,46.8,11),level:'upper'},
  ...uc.regions.filter(q=>!['贸易区','洛丹伦废墟'].includes(q.name)).map(q=>({...q,level:'lower'})),
  {...r('洛丹伦废墟','RUINS OF LORDAERON',65,3,40),level:'surface'}
];
const upperIds=['flight','bank','inn','lift-west','lift-east','lift-south'];
uc.places=uc.places.map(q=>{
  if(!upperIds.includes(q.id))return {...q,level:'lower',h:3,area:q.id==='auction'?'贸易区 · 下层拍卖环廊':`下层 · ${q.area}`,
    ...(q.id==='auction'?{description:'拍卖师分布在贸易区与运河之间的下层环廊；此处标记北侧窗口。飞行点和旅店位于更高的环廊。'}:{})};
  const next={...q,level:'upper',h:q.id==='bank'?11:19};
  if(q.id.startsWith('lift-'))Object.assign(next,{levels:['upper','surface'],levelHeights:{surface:39},area:`地面 ↕ 上层 · ${q.id==='lift-west'?'西侧':q.id==='lift-east'?'东侧':'南侧'}电梯`,description:'电梯连接地面废墟与地下上层环廊。到站后可沿楼梯前往银行平台和下层运河区。'});
  if(q.id==='flight')Object.assign(next,{area:'贸易区 · 上层环廊西南侧',description:'蝙蝠管理员在银行上方的环廊西南侧。从银行平台沿坡道上行后寻找；不要停留在下层运河。'});
  if(q.id==='bank')Object.assign(next,{area:'贸易区 · 中央银行平台',description:'银行平台高于下层城区，但低于飞行点所在的环廊。走上中央楼梯可到银行，再沿坡道继续上行。'});
  if(q.id==='inn')Object.assign(next,{area:'贸易区 · 上层环廊北侧',description:'旅店位于上层环廊北侧，与飞行点处于同一层。可从银行平台沿坡道上行。'});
  return next;
});
export const cities=definitions.map(c=>{
  const points=[...(entrances[c.id]||[]),...addProfessionTrainers(c)].map(point=>{
    const isEntrance=point.category==='entrance'||(entranceIds[c.id]||[]).includes(point.id);
    return {...point,entrance:isEntrance,source:point.source==='codex'?`https://forever-codex.com/map/${c.mapSlug}/`:point.source,
      ...(point.icon==='lift'?{aliases:`${point.aliases||''} 电梯 升降台 升降机 Elevator Lift`}:{}),
      ...(c.id==='undercity'&&point.id==='gate-main'?{level:'surface'}:{}),
      ...(c.id==='undercity'&&point.id==='gate-sewer'?{level:'lower'}:{})};
  });
  return {...c,places:points,mapSource:`https://warcraftforever.games/maps/${c.mapSlug}`,pointSource:`https://forever-codex.com/map/${c.mapSlug}/`};
});
export const getCity=id=>cities.find(c=>c.id===id)||cities[0];
export const placeOnLevel=(place,level)=>level==='all'||place.level===level||place.levels?.includes(level);
export const placeHeight=(place,level)=>place.levelHeights?.[level]??place.h;
