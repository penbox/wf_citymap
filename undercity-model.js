import * as THREE from 'three';
import {modelKit} from './model-kit.js';
import {toWorld} from './data.js';
import {createElevator,elevatorController} from './elevators.js';

// A cutaway city: surface ruins -> lift shafts -> upper trade walkway -> bank
// terrace -> lower canals. Relative heights and ramp paths are illustrative.
export function createUndercity(){
  const k=modelKit('Undercity cutaway');k.ground('#24332c');
  const layers={};
  for(const id of ['surface','upper','lower','connections']){layers[id]=new THREE.Group();layers[id].name=`Undercity ${id}`;k.group.add(layers[id])}
  function into(id,build){
    const previous=new Set(k.group.children);build();
    for(const o of [...k.group.children])if(!previous.has(o))layers[id].add(o);
  }
  function platformRing(x,y,h,rx,ry,width,color,depth=1.1){
    const [wx,,wz]=toWorld(x,y),shape=new THREE.Shape(),hole=new THREE.Path();
    shape.absellipse(wx,-wz,rx*1.8+width/2,ry*1.2+width/2,0,Math.PI*2,false);
    hole.absellipse(wx,-wz,rx*1.8-width/2,ry*1.2-width/2,0,Math.PI*2,true);shape.holes.push(hole);
    const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:64});geo.rotateX(-Math.PI/2);
    return k.mesh(geo,[k.mat(color),k.mat('#536454')],[0,h-depth,0],k.group,'raised circular walkway');
  }
  function rail(x,y,h,rx,ry){
    const points=[];for(let i=0;i<64;i++){const a=i/64*Math.PI*2;points.push(new THREE.Vector3(...toWorld(x+rx*Math.cos(a),y+ry*Math.sin(a),h)))}
    const curve=new THREE.CatmullRomCurve3(points,true);
    k.mesh(new THREE.TubeGeometry(curve,96,.085,5,true),'#a0af8e',[0,0,0],k.group,'walkway railing');
  }
  function stairs(a,b,width=2.4,steps=20){
    const av=new THREE.Vector3(...toWorld(...a)),bv=new THREE.Vector3(...toWorld(...b)),horizontal=bv.clone().sub(av);horizontal.y=0;
    const length=horizontal.length(),rotation=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),horizontal.clone().normalize());
    k.path([a,b],width,'#84977b');
    for(let i=0;i<steps;i++){const t=(i+.5)/steps,pos=av.clone().lerp(bv,t);const step=k.mesh(new THREE.BoxGeometry(width,.35,length/steps+.04),'#b0b99b',[pos.x,pos.y-.1,pos.z],k.group,'stair tread');step.quaternion.copy(rotation)}
    const side=horizontal.clone().cross(new THREE.Vector3(0,1,0)).normalize().multiplyScalar(width/2);
    for(const sign of [-1,1]){
      const start=av.clone().addScaledVector(side,sign),end=bv.clone().addScaledVector(side,sign);start.y+=1;end.y+=1;
      k.beam(start.toArray(),end.toArray(),.08,'#a0af8e');
      for(const t of [0,.5,1]){const foot=av.clone().lerp(bv,t).addScaledVector(side,sign);k.beam(foot.toArray(),[foot.x,foot.y+1,foot.z],.07,'#8c9d80')}
    }
  }
  function arch(x,y,h,width=4,height=5,color='#87957e'){
    for(const s of [-1,1])k.box(x+s*width/3.6,y,h,.7,1.2,height,color);
    const [wx,,wz]=toWorld(x,y),pts=[];for(let i=0;i<=20;i++){const a=i/20*Math.PI;pts.push(new THREE.Vector3(wx+Math.cos(a)*width/2,h+height+Math.sin(a)*width/2,wz))}
    k.mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,.4,6,false),color,[0,0,0],k.group,'stone arch');
  }
  const elevators=[
    createElevator({id:'lift-west',x:60.6,y:44,bottom:19,top:39,rotation:-Math.PI/2,offset:4.2,style:'undead',phase:4}),
    createElevator({id:'lift-east',x:71.4,y:44.2,bottom:19,top:39,rotation:Math.PI/2,offset:4.2,style:'undead',phase:6}),
    createElevator({id:'lift-south',x:65.9,y:52.1,bottom:19,top:39,offset:4.2,style:'undead',phase:12})
  ];
  elevators.forEach(e=>k.group.add(e.group));

  into('lower',()=>{
    k.circle(66,44,3,23,34,'#526252',4);
    k.ring(66,44,3.08,16.6,25,5.6,k.mat('#829e59',{emissive:'#253913',emissiveIntensity:.22}));
    platformRing(66,44,3.25,20.3,30.4,3.3,'#819278',.55);
    platformRing(66,44,3.3,13.4,20,5,'#819174',.6);
    k.circle(66,44,3.15,10.8,16,'#718269',.3);
    platformRing(66,44,3.5,5.5,8.3,3.8,'#98a58a',.6);
    // Lower auction windows sit below the upper trade walkway, not beside it.
    for(const [x,y] of [[64.4,35.8],[67.7,35.9],[60.5,46.4],[71.4,46.7],[64.4,52.4],[67.5,52.4]]){
      k.box(x,y,3.5,1.8,1.3,1.2,'#64745a');k.box(x,y,4.7,2.1,1.5,.2,'#acb18b');
    }
    const districts=[[47.5,15,7,11],[85,15,7,12],[48,73,8,13],[84,72,8,12],[58,92,6,8]];
    districts.forEach(([x,y,rx,ry],i)=>{k.circle(x,y,3,rx,ry,['#6c7b64','#646f70','#65765f','#716876','#64725f'][i],3);k.ring(x,y,3.2,rx,ry,1,'#91a085')});
    [[[52,26],[48,20]],[[80,26],[84,20]],[[51,63],[48,69]],[[80,64],[84,68]]].forEach(([a,b])=>k.bridge(a,b,3.5,3.2,'#a0ad8e'));
    k.path([[48,73],[48,80],[53,85],[58,92]],5,'#77886d',3.2);
    // Walkable side of the western sewer entrance; the channel itself is water.
    k.path([[47,25],[40,25],[37,29],[30,32],[24,36],[20,38],[16.5,33.5]],6,'#596f52',3.1);
    k.path([[47,25],[40,25],[37,29],[30,32],[24,36],[20,38],[16.5,33.5]],2,'#859b55',3.15);
    arch(16.5,33.5,3,5,3.5,'#7e8b72');
    [[47,15],[85,13],[84,72],[48,73]].forEach(([x,y])=>{
      k.house(x,y,3,6,9,0,'gothic');k.tower(x-3,y,3,1.3,6,'#7d8878','#4c5e5e','gothic');k.tower(x+3,y,3,1.3,6,'#7d8878','#4c5e5e','gothic');
      for(const dx of [-4,4])k.fire(x+dx,y+6,3,'#a9d86c');
    });
    k.house(58,92,3,9,8,0,'gothic');
    [[57,29],[72,30],[77,39],[76,56],[62,61],[54,50]].forEach(([x,y],i)=>k.house(x,y,3,3.4,4,i*.7,'gothic'));
    for(let i=0;i<18;i++){const a=i/18*Math.PI*2,x=66+20.6*Math.cos(a),y=44+30.8*Math.sin(a);k.box(x,y,3,1,1,3,'#71816a');if(i%3===0)k.fire(x,y,6,'#a6d67e',.7)}
  });

  into('upper',()=>{
    // Bank terrace: above the canal floor but below the flight-master walkway.
    k.circle(66,44,11,3.3,4.9,'#9da98d',1.2);rail(66,44,12.1,3.25,4.85);
    k.pavilion(66,44,11,2.5,2.2,'#a8b293','#62705c');
    platformRing(66,44,19,5.5,8.3,3.2,'#a6b194',1.3);
    rail(66,44,20.1,6.3,9.5);rail(66,44,20.1,4.7,7.1);
    for(let i=0;i<12;i++){
      const a=i/12*Math.PI*2,x=66+5.5*Math.cos(a),y=44+8.3*Math.sin(a);
      k.mesh(new THREE.CylinderGeometry(.35,.65,15,8),'#667b60',toWorld(x,y,10.5),k.group,'upper walkway column');
      k.beam(toWorld(x,y,19),toWorld(x,y,20.2),.08,'#a0af8e');
    }
    stairs([66,41.4,11],[63.8,36.7,19],2.1,22);
    stairs([66,46.6,11],[63.8,51.3,19],2.1,22);
    k.circle(63.3,48.6,19.15,1.5,2.2,'#a5b18f',.3);k.fire(62.3,49.7,19,'#afd780',.6);
    k.house(67.7,37.9,19,2.5,2.6,0,'gothic');
  });
  into('connections',()=>{
    stairs([57,44,3.3],[62.7,44,11],2.6,22);
    stairs([75,44,3.3],[69.3,44,11],2.6,22);
    stairs([66,57,3.3],[66,48.9,11],2.6,24);
  });
  into('surface',()=>{
    k.slab([[58,4],[72,4],[74,11],[73,23],[59,23],[57,13]],39,'#72816b',2);
    k.path([[66,6],[66,19],[63,23]],3,'#b2b497',39.1);
    [[59,8],[72,8],[59,19],[72,19]].forEach(([x,y])=>{k.box(x,y,39,2.4,2.4,7,'#95a085');k.box(x+.4,y,46,1.4,1.6,2,'#879778')});
    k.wall([59,8],[72,8],39,4,1.5,'#8a997e');k.wall([59,8],[59,19],39,3,1.5,'#8a997e');k.wall([72,8],[72,19],39,3,1.5,'#8a997e');
    arch(66,6,39,6,5,'#aab398');
    // Roofs are cut away. These upper passages show which lift each branch meets.
    k.path([[63,23],[60,29],[57,37],[60.6,44]],3.3,'#94a283',39);
    k.path([[67,23],[72,29],[76,37],[71.4,44.2]],3.3,'#94a283',39);
    k.path([[72,29],[77,44],[73,55],[65.9,52.1]],3.3,'#94a283',39);
  });

  // Context in the full cutaway stays translucent; selecting the surface restores
  // opaque materials. Each clone is owned and disposed by this model.
  const ghosts=[];
  layers.surface.traverse(o=>{if(!o.isMesh)return;const originals=Array.isArray(o.material)?o.material:[o.material];
    const faded=originals.map(m=>{const c=m.clone();c.transparent=true;c.opacity=.29;c.depthWrite=false;return c});
    ghosts.push({mesh:o,original:o.material,faded:Array.isArray(o.material)?faded:faded[0],materials:faded});
  });
  function setLevel(level){
    for(const id of ['surface','upper','lower'])layers[id].visible=level==='all'||id===level;
    layers.connections.visible=level==='all';
    elevators.forEach(e=>e.group.visible=level!=='lower');
    ghosts.forEach(o=>o.mesh.material=level==='all'?o.faded:o.original);
  }
  setLevel('all');
  return {...k,...elevatorController(elevators),setLevel,dispose(){ghosts.forEach(o=>o.materials.forEach(m=>m.dispose()))}};
}
