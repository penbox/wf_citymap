import * as THREE from 'three';
import {toWorld} from './data.js';

// Open-sided guide models. Travel, clearance and timing are illustrative;
// the x/y anchor remains the referenced city entrance.
export function createElevator({id,x,y,bottom,top,rotation=0,offset=4,approach=2,style='timber',phase=0}){
  const group=new THREE.Group();group.name=`elevator ${id}`;
  group.position.set(...toWorld(x,y));group.rotation.y=rotation;
  const undead=style==='undead',materials=new Map();
  const mat=(name,color,extra={})=>{
    if(!materials.has(name)){const m=new THREE.MeshStandardMaterial({color,roughness:.82,...extra});m.name=name;materials.set(name,m)}
    return materials.get(name);
  };
  const frame=mat('elevator frame',undead?'#53675b':'#69472c');
  const floor=mat('elevator decking',undead?'#aebba0':'#d4ad68');
  const trim=mat('elevator brass',undead?'#bacd98':'#e5c784',{metalness:.3,roughness:.5});
  const dark=mat('elevator iron','#303d35',{metalness:.5});
  const cableMat=mat('elevator ropes',undead?'#c3cda6':'#ddc692');
  const accent=mat('elevator banner',undead?'#69577e':'#a64e35',{side:THREE.DoubleSide});
  function mesh(geometry,material,position,parent=group,name='elevator part'){
    const m=new THREE.Mesh(geometry,material);m.name=name;m.position.set(...position);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }
  const box=(w,h,d,position,material=frame,parent=group,name='elevator timber')=>mesh(new THREE.BoxGeometry(w,h,d),material,position,parent,name);
  function beam(a,b,r,material=frame,parent=group,name='elevator brace'){
    const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),delta=bv.clone().sub(av);
    const m=mesh(new THREE.CylinderGeometry(r,r,delta.length(),8),material,av.add(bv).multiplyScalar(.5).toArray(),parent,name);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m;
  }
  const half=2.45,roof=top+4.4;
  // Two open landings; neither fills the space travelled by the carriage.
  const approachEnd=offset-half,approachStart=Math.min(-approach,approachEnd-1.5);
  const approachLength=approachEnd-approachStart;
  box(4.7,.4,approachLength,[0,top-.2,(approachStart+approachEnd)/2],floor,group,'upper landing');
  box(5.2,.5,undead?approachLength:3.2,[0,bottom-.25,undead?(approachStart+approachEnd)/2:offset+half+1.6],floor,group,'lower landing');
  for(const h of [bottom,top]){
    const z=h===top||undead?offset-half-.15:offset+half+.15;
    box(4.9,.13,.25,[0,h+.08,z],trim,group,'landing threshold');
    for(const s of [-1,1]){
      box(.45,3,.45,[s*half,h+1.5,z],frame,group,'landing post');
      mesh(new THREE.ConeGeometry(.4,.8,4),trim,[s*half,h+3.3,z],group,'landing finial');
    }
    box(5.3,.3,.5,[0,h+3,z],frame,group,'landing lintel');
  }
  for(const s of [-1,1]){
    beam([s*2.2,top+1.1,approachStart],[s*2.2,top+1.1,approachEnd],.1,trim);
    for(const z of [approachStart,approachEnd])beam([s*2.2,top,z],[s*2.2,top+1.2,z],.1);
    for(const z of [offset-half,offset+half]){
      box(.48,roof-bottom,.48,[s*half,(bottom+roof)/2,z],frame,group,'shaft guide');
      for(const h of [bottom,top])box(.7,.32,.7,[s*half,h+.5,z],trim,group,'post binding');
    }
    // Braces only run along the sides, keeping the cabin visible from the front.
    for(let h=bottom;h<top-1;h+=6){
      const end=Math.min(top,h+6);
      beam([s*half,h,offset-half],[s*half,end,offset+half],.12);
      beam([s*half,h,offset+half],[s*half,end,offset-half],.12);
    }
    box(.6,.6,5.5,[s*half,roof,offset],frame,group,'headframe');
  }
  box(5.6,.6,.6,[0,roof,offset],frame,group,'winch crossbeam');
  const wheels=[];
  for(const sx of [-1.6,1.6]){
    const wheel=new THREE.Group();wheel.name='elevator pulley';wheel.position.set(sx,roof+.3,offset);group.add(wheel);
    mesh(new THREE.TorusGeometry(.6,.13,6,20),dark,[0,0,0],wheel,'pulley rim').rotation.y=Math.PI/2;
    for(const angle of [0,Math.PI/3,Math.PI*2/3])beam([0,-Math.cos(angle)*.6,-Math.sin(angle)*.6],[0,Math.cos(angle)*.6,Math.sin(angle)*.6],.06,trim,wheel,'pulley spoke');
    wheels.push(wheel);
  }
  beam([-2.8,roof+.3,offset],[2.8,roof+.3,offset],.14,dark,group,'winch axle');
  // Faction-colored hanging cloth gives the small silhouette a recognizable cap.
  const pennant=mesh(new THREE.PlaneGeometry(1.2,2),accent,[0,roof-1,offset+half+.05],group,'lift pennant');
  pennant.rotation.y=0;
  const carriage=new THREE.Group();carriage.name='moving elevator carriage';carriage.position.z=offset;group.add(carriage);
  box(4.3,.42,4.3,[0,-.21,0],dark,carriage,'carriage underframe');
  for(let i=0;i<7;i++)box(.57,.18,4.15,[(i-3)*.6,.02,0],floor,carriage,'carriage floor plank');
  for(const s of [-1,1]){
    box(.18,.28,4.4,[s*2.12,.12,0],trim,carriage,'carriage edge');
    for(const z of [-2,2])box(.17,2.65,.17,[s*2,1.4,z],frame,carriage,'carriage upright');
    for(const h of [1,2.6])beam([s*2,h,-2],[s*2,h,2],.09,trim,carriage,'carriage side rail');
  }
  // Both ends remain open for boarding from the landing at either height.
  box(4.3,.18,.25,[0,2.65,0],trim,carriage,'carriage hanger');
  if(undead){
    const lamp=mat('elevator lantern','#d0e9a5',{emissive:'#8fa950',emissiveIntensity:.65});
    for(const s of [-1,1])mesh(new THREE.OctahedronGeometry(.35),lamp,[s*2,2.95,2],carriage,'carriage lantern');
  }
  const cables=[-1.6,1.6].map(s=>mesh(new THREE.CylinderGeometry(.065,.065,1,6),cableMat,[s,0,offset],group,'lifting cable'));
  const selectedBands=[];
  const gold=mat('selected elevator','#f4d18d',{emissive:'#8b5c19',emissiveIntensity:.45});
  for(const h of [bottom,top]){
    const band=mesh(new THREE.TorusGeometry(3.2,.1,6,48),gold,[0,h+.2,offset],group,'selected elevator landing');band.rotation.x=Math.PI/2;band.visible=false;selectedBands.push(band);
  }
  let lastHeight;
  function update(seconds,reduced=false){
    if(!group.visible)return false;
    const t=(seconds+phase)%20;
    const ease=v=>v*v*(3-2*v);
    const progress=reduced?1:t<2?1:t<9?1-ease((t-2)/7):t<12?0:t<19?ease((t-12)/7):1;
    const height=THREE.MathUtils.lerp(bottom,top,progress);
    if(height===lastHeight)return false;
    lastHeight=height;carriage.position.y=height;
    const length=roof+.3-(height+2.65);
    cables.forEach(c=>{c.position.y=height+2.65+length/2;c.scale.y=length});
    wheels.forEach(w=>w.rotation.x=(top-height)/.6);
    return true;
  }
  update(0);
  const shaft=new THREE.Vector3(0,0,offset).applyAxisAngle(new THREE.Vector3(0,1,0),rotation).add(group.position);
  return {id,group,carriage,update,bottom,top,
    select(value){selectedBands.forEach(b=>b.visible=value)},
    frame(){return {target:new THREE.Vector3(shaft.x,(bottom+top)/2+1,shaft.z),offset:new THREE.Vector3(48,38,90).applyAxisAngle(new THREE.Vector3(0,1,0),rotation),zoom:2.7}}
  };
}

export function elevatorController(elevators){
  const map=new Map(elevators.map(e=>[e.id,e]));
  return {
    elevators:map,
    update(seconds,reduced){let changed=false;for(const elevator of elevators)changed=elevator.update(seconds,reduced)||changed;return changed},
    selectElevator(id){elevators.forEach(e=>e.select(e.id===id))}
  };
}
