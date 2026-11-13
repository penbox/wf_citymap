import { categories, palette } from './data.js';
import {getCity,placeOnLevel,placeHeight} from './cities.js';
import { icon } from './icons.js';

const $=id=>document.getElementById(id);
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
const viewport=$('viewport'),markerLayer=$('markers'),regionLayer=$('region-labels');
const hashState=()=>new URLSearchParams(location.hash.slice(1));
let currentCity=getCity(hashState().get('city')),places=currentCity.places,regions=currentCity.regions;
let category='all',query='',selected=null,view='perspective',viewer=null,showNames=true,shareTimer,activeLevel='all';
let referenceZoom=1,referencePan={x:0,y:0},drag=null;
const markerEls=new Map(),regionEls=[];
const normalize=value=>value.trim().toLocaleLowerCase().replace(/[·\s]/g,'');
function visiblePlaces(){return places.filter(p=>(category==='all'||(category==='entrance'?p.entrance:p.category===category))&&(!query||normalize([p.name,p.person,p.area,p.en,p.aliases||'',p.entrance?'入口 城门 进城 Entrance':''].join(' ')).includes(normalize(query))));}
const pointColor=p=>palette[p.entrance?'entrance':p.category];
const pointIcon=p=>p.icon==='lift'?'lift':p.entrance?'gate':p.icon;
const scenePoint=p=>p?{...p,h:placeHeight(p,activeLevel)}:null;
const pointArea=p=>p.levelHeights?.surface?(activeLevel==='surface'?`地面 · ${p.name}上站`:`上层 · ${p.name}下站`):p.area;
for(const cat of categories){
  const b=document.createElement('button');b.className='filter';b.dataset.category=cat.id;b.textContent=cat.name;b.setAttribute('aria-pressed',String(category===cat.id));
  if(cat.title){b.title=cat.title;b.setAttribute('aria-label',cat.title)}
  b.addEventListener('click',()=>{category=cat.id;filter()});document.querySelector('.filters').append(b);
}
function rebuildMapDOM(){
markerLayer.replaceChildren();regionLayer.replaceChildren();markerEls.clear();regionEls.length=0;
for(const p of places){
  const b=document.createElement('button');b.className=`marker${p.entrance?' is-entrance':''}`;b.dataset.place=p.id;b.style.setProperty('--pin-color',pointColor(p));b.setAttribute('aria-label',`${p.name}，${p.area}${p.entrance?'，主城入口':''}`);b.setAttribute('aria-pressed','false');
  b.innerHTML=`<span class="pin-name">${p.name}${p.entrance&&!/门|入口/.test(p.name)?' · 入口':''}</span><span class="pin">${icon(pointIcon(p))}</span>`;
  b.addEventListener('click',()=>selectPlace(p));markerLayer.append(b);markerEls.set(p.id,b);
}
regions.forEach(r=>{const el=document.createElement('div');el.className='region-label';el.innerHTML=`${r.name}<small lang="en">${r.en}</small>`;regionLayer.append(el);regionEls.push(el)});
}

function locationURL(place){const url=new URL(location.href);const params=new URLSearchParams({city:currentCity.id});if(activeLevel!=='all')params.set('level',activeLevel);if(place)params.set('place',place.id);url.hash=params.toString();return url}
function syncLevelControls(){
  $('level-switch').hidden=!currentCity.levels;
  document.querySelectorAll('#level-switch [data-level]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.level===activeLevel)));
  viewport.dataset.level=activeLevel;
}
function setLevel(level,writeHistory=true){
  activeLevel=currentCity.levels?.includes(level)?level:'all';viewer?.setLevel(activeLevel);syncLevelControls();
  if(selected&&!placeOnLevel(selected,activeLevel))selectPlace(null,false);else selectPlace(selected,false);
  updateMarkers();if(writeHistory)history.replaceState(null,'',locationURL(selected));
}
document.querySelectorAll('#level-switch [data-level]').forEach(b=>b.addEventListener('click',()=>setLevel(b.dataset.level)));

function selectCity(id,placeId=null,writeHistory=true,level='all'){
  const next=getCity(id),changed=next.id!==currentCity.id;
  selected=null;viewer?.select(null);currentCity=next;places=next.places;regions=next.regions;
  category='all';query='';$('search').value='';referenceZoom=1;referencePan={x:0,y:0};drag=null;
  clearTimeout(shareTimer);$('share-label').textContent='分享地点';
  activeLevel=next.levels?.includes(level)?level:'all';
  document.querySelectorAll('.city-navigation [data-city]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.city===next.id)));
  $('city-name').textContent=next.name;$('city-region').textContent=next.continent;
  $('city-en').textContent=next.en;$('city-faction').textContent=next.faction;$('city-faction').classList.toggle('alliance',next.faction==='联盟');
  $('city-motto').textContent=next.motto;$('city-description').textContent=next.description;$('city-note').textContent=next.note;
  $('city-map-source').href=next.mapSource;$('city-point-source').href=next.pointSource;
  $('city-map-source').textContent=`Warcraft Forever · ${next.name}地图 ↗`;
  const image=$('reference').querySelector('img');image.src=next.map;image.alt=`${next.name}游戏地图，北面朝上。`;image.style.transform='';
  document.title=`${next.name} · 艾泽拉斯旅行手册`;document.querySelector('.map-shell').setAttribute('aria-label',`${next.name}地图`);
  rebuildMapDOM();if(changed)viewer?.setCity(next);viewer?.setLevel(activeLevel);syncLevelControls();filter();selectPlace(places.find(p=>p.id===placeId)||null,false);
  viewport.dataset.city=next.id;
  if(writeHistory)history.pushState(null,'',locationURL(selected));
}
document.querySelectorAll('.city-navigation [data-city]').forEach(b=>b.addEventListener('click',()=>selectCity(b.dataset.city)));

function filter(){
  document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
  const filtered=visiblePlaces();
  if(selected&&!filtered.includes(selected))selectPlace(null);
  $('places').replaceChildren();
  for(const p of filtered){
    const b=document.createElement('button');b.className='place';b.dataset.place=p.id;b.setAttribute('aria-pressed',String(selected?.id===p.id));
    b.innerHTML=`<span class="place-icon" style="--pin-color:${pointColor(p)}">${icon(pointIcon(p))}</span><span><span class="place-name">${p.name}${p.entrance&&!/门|入口/.test(p.name)?'<span class="entry-badge">入口</span>':''}</span><span class="place-location">${p.area}</span></span><span class="place-arrow" aria-hidden="true">›</span>`;
    b.addEventListener('click',()=>selectPlace(p));$('places').append(b);
  }
  $('empty').hidden=filtered.length!==0;
  updateMarkers();
}

function selectPlace(place,updateHash=true){
  const changed=selected?.id!==place?.id;
  if(place&&currentCity.levels&&activeLevel!=='all'&&!placeOnLevel(place,activeLevel)){
    activeLevel=place.level||'all';viewer?.setLevel(activeLevel);syncLevelControls();
  }
  selected=place;$('place-detail').hidden=!place;$('place-detail').classList.toggle('is-elevator',place?.icon==='lift');
  document.querySelectorAll('.place,.marker').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.place===place?.id)));
  if(place){
    $('detail-name').textContent=place.name;$('detail-person').textContent=place.person;
    $('detail-area').textContent=pointArea(place);$('detail-description').textContent=place.description;
    $('detail-icon').innerHTML=icon(pointIcon(place));$('detail-icon').style.setProperty('--pin-color',pointColor(place));
    $('focus-place').innerHTML=`<span aria-hidden="true">${icon('focus')}</span>${place.icon==='lift'?'查看电梯':'定位此处'}`;
    $('share-label').textContent='分享地点';
  }
  viewer?.select(scenePoint(place));
  if(place?.icon==='lift'&&changed&&view!=='reference')viewer?.focus(scenePoint(place));
  if(updateHash)history.replaceState(null,'',locationURL(place));
  updateMarkers();
}

function referenceBounds(){
  const el=$('reference'),w=el.clientWidth,h=el.clientHeight,ratio=1002/668;
  const imageWidth=Math.min(w,h*ratio),imageHeight=imageWidth/ratio;
  return {x:el.offsetLeft+w/2-imageWidth*referenceZoom/2+referencePan.x,y:el.offsetTop+h/2-imageHeight*referenceZoom/2+referencePan.y,w:imageWidth*referenceZoom,h:imageHeight*referenceZoom};
}
function updateReference(){
  $('reference').querySelector('img').style.transform=`translate(${referencePan.x}px,${referencePan.y}px) scale(${referenceZoom})`;
  updateMarkers();
}
function updateMarkers(){
  const visible=new Set(visiblePlaces().filter(p=>placeOnLevel(p,activeLevel)).map(p=>p.id));
  const rect=view==='reference'?referenceBounds():null;
  const occupied=[],pins=[],width=viewport.clientWidth,height=viewport.clientHeight;
  const pinPriority=p=>p.category==='entrance'?3:['bank','flight'].includes(p.id)?2:p.entrance?1:0;
  const sorted=[...places].sort((a,b)=>Number(b===selected)-Number(a===selected)||pinPriority(b)-pinPriority(a));
  for(const p of sorted){
    const el=markerEls.get(p.id);
    el.setAttribute('aria-label',`${p.name}，${pointArea(p)}${p.entrance?'，主城入口':''}`);
    if(!visible.has(p.id)||(!viewer&&view!=='reference')||(view!=='reference'&&selected?.icon==='lift'&&p.icon!=='lift')){el.hidden=true;continue;}
    const pos=rect?{x:rect.x+rect.w*p.x/100,y:rect.y+rect.h*p.y/100,visible:true}:viewer.project(p.x,p.y,placeHeight(p,activeLevel)+(currentCity.id==='thunder-bluff'&&p.id==='flight'?7:4));
    el.hidden=!pos.visible||pos.x<18||pos.x>width-18||pos.y<35||pos.y>height-10;
    if(el.hidden)continue;
    if(p!==selected&&pins.some(other=>Math.abs(other.x-pos.x)<30&&Math.abs(other.y-pos.y)<34)){el.hidden=true;continue;}
    pins.push(pos);
    el.style.left=`${pos.x}px`;el.style.top=`${pos.y}px`;el.style.zIndex=String(Math.round(pos.y));
    const label=el.querySelector('.pin-name'),labelWidth=label.textContent.length*(width<500?9:11)+18;
    const labelHeight=width<500?18:22,gap=width<500?32:40,below=pos.y<gap+labelHeight+4;
    label.style.bottom=below?`-${labelHeight+6}px`:'';
    const box={left:pos.x-labelWidth/2,right:pos.x+labelWidth/2,top:below?pos.y+6:pos.y-gap-labelHeight,bottom:below?pos.y+6+labelHeight:pos.y-gap};
    const shift=box.left<4?4-box.left:box.right>width-4?width-4-box.right:0;
    label.style.transform=`translateX(${shift}px)`;box.left+=shift;box.right+=shift;
    const overlaps=occupied.some(b=>box.left<b.right+6&&box.right>b.left-6&&box.top<b.bottom+5&&box.bottom>b.top-5);
    label.style.display=(!showNames||(overlaps&&p!==selected))?'none':'';
    if(showNames&&!overlaps)occupied.push(box);
  }
  regionEls.forEach((el,i)=>{el.hidden=view==='reference'||!viewer||!showNames||!placeOnLevel(regions[i],activeLevel);if(!el.hidden){
    const r=regions[i],p=viewer.project(r.x,r.y,r.h),halfWidth=r.name.length*(width<500?8:10);
    const box={left:p.x-halfWidth,right:p.x+halfWidth,top:p.y-14,bottom:p.y+23};
    const obscured=occupied.some(b=>box.left<b.right+5&&box.right>b.left-5&&box.top<b.bottom+5&&box.bottom>b.top-5);
    el.hidden=!p.visible||obscured||p.y<(currentCity.levels?118:74);el.style.left=`${p.x}px`;el.style.top=`${p.y}px`;
  }});
  $('north').querySelector('svg').style.transform=`rotate(${view==='reference'?0:-(viewer?.heading()||0)}deg)`;
}

function setView(mode){
  if(!viewer&&mode!=='reference')return;
  view=mode;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===mode)));
  $('reference').hidden=mode!=='reference';$('render-fallback').hidden=true;
  viewer?.setMode(mode);updateMarkers();
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
$('search').addEventListener('input',e=>{query=e.target.value;filter()});
$('clear-search').addEventListener('click',()=>{query='';category='all';$('search').value='';filter();$('search').focus()});
$('close-detail').addEventListener('click',()=>{const id=selected?.id;selectPlace(null);document.querySelector(`.place[data-place="${id}"]`)?.focus({preventScroll:true})});
$('toggle-labels').addEventListener('click',()=>{showNames=!showNames;markerLayer.classList.toggle('names-hidden',!showNames);$('toggle-labels').setAttribute('aria-pressed',String(showNames));$('toggle-labels').setAttribute('aria-label',showNames?'隐藏地点名称':'显示地点名称');updateMarkers()});
function zoom(factor){if(view==='reference'){referenceZoom=Math.min(4,Math.max(1,referenceZoom*factor));if(referenceZoom===1)referencePan={x:0,y:0};updateReference()}else viewer?.zoom(factor)}
$('zoom-in').addEventListener('click',()=>zoom(1.25));$('zoom-out').addEventListener('click',()=>zoom(1/1.25));
$('reset-view').addEventListener('click',()=>{if(view==='reference'){referenceZoom=1;referencePan={x:0,y:0};updateReference()}else viewer?.reset()});
$('north').addEventListener('click',()=>{if(view==='reference'){referenceZoom=1;referencePan={x:0,y:0};updateReference()}else viewer?.north()});
$('focus-place').addEventListener('click',()=>{
  if(!selected)return;
  if(view==='reference'){
    referenceZoom=2;referencePan={x:0,y:0};const b=referenceBounds();referencePan={x:(.5-selected.x/100)*b.w,y:(.5-selected.y/100)*b.h};updateReference();
  }else viewer?.focus(scenePoint(selected));
});
$('share-place').addEventListener('click',async()=>{
  const label=$('share-label');clearTimeout(shareTimer);
  try{await navigator.clipboard.writeText(location.href);label.textContent='链接已复制'}
  catch{label.textContent='请复制地址栏链接'}
  shareTimer=setTimeout(()=>label.textContent='分享地点',2500);
});
const about=$('about');$('about-open').addEventListener('click',()=>about.showModal());$('about-close').addEventListener('click',()=>about.close());
about.addEventListener('click',e=>{if(e.target===about){const r=about.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)about.close()}});
$('fallback-map').addEventListener('click',()=>setView('reference'));
document.addEventListener('keydown',e=>{
  if(e.key==='/'&&!about.open&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();$('search').focus()}
  if(e.key==='Escape'&&!about.open&&selected)selectPlace(null);
});
viewport.addEventListener('keydown',e=>{
  if(e.target!==viewport)return;
  const deltas={ArrowLeft:[-4,0],ArrowRight:[4,0],ArrowUp:[0,-4],ArrowDown:[0,4]};
  if(deltas[e.key]){e.preventDefault();const [x,z]=deltas[e.key];if(view==='reference'){referencePan.x-=x*5;referencePan.y-=z*5;updateReference()}else viewer?.pan(x,z)}
  if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1.25)}if(e.key==='-'){e.preventDefault();zoom(.8)}
});
viewport.addEventListener('wheel',e=>{if(view==='reference'){e.preventDefault();zoom(e.deltaY<0?1.1:1/1.1)}},{passive:false});
viewport.addEventListener('pointerdown',e=>{if(view!=='reference'||e.target.closest('button'))return;drag={x:e.clientX,y:e.clientY,px:referencePan.x,py:referencePan.y};viewport.setPointerCapture(e.pointerId)});
viewport.addEventListener('pointermove',e=>{if(drag){referencePan={x:drag.px+e.clientX-drag.x,y:drag.py+e.clientY-drag.y};updateReference()}});
viewport.addEventListener('pointerup',()=>drag=null);viewport.addEventListener('pointercancel',()=>drag=null);
function restoreHash(){const params=hashState();selectCity(getCity(params.get('city')).id,params.get('place'),false,params.get('level'))}
window.addEventListener('hashchange',restoreHash);window.addEventListener('popstate',restoreHash);new ResizeObserver(updateMarkers).observe(viewport);
restoreHash();
try{
  const {createViewer}=await import('./viewer.js');viewer=createViewer(viewport,updateMarkers,currentCity);viewport.dataset.ready='true';restoreHash();
  rendererRecovery();
}catch(error){
  console.error('3D map unavailable:',error);$('render-fallback').hidden=false;
  document.querySelectorAll('[data-view]:not([data-view="reference"])').forEach(b=>b.disabled=true);
  restoreHash();
}
function rendererRecovery(){
  viewport.querySelector('canvas').addEventListener('webglcontextlost',e=>{e.preventDefault();setView('reference');document.querySelectorAll('[data-view]:not([data-view="reference"])').forEach(b=>b.disabled=true)});
  viewport.querySelector('canvas').addEventListener('webglcontextrestored',()=>{document.querySelectorAll('[data-view]').forEach(b=>b.disabled=false);viewer.refresh()});
}
