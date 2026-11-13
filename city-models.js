import * as THREE from 'three';
import {createCity as thunderBluff} from './model.js';
import {toWorld} from './data.js';
import {modelKit} from './model-kit.js';
import {createUndercity} from './undercity-model.js';

function orgrimmar(){
  const k=modelKit('Orgrimmar');k.ground('#5c4c39');
  k.slab([[27,30],[41,27],[50,32],[61,36],[62,13],[72,7],[82,10],[86,25],[82,39],[70,43],[64,54],[58,60],[61,75],[58,93],[43,96],[39,89],[29,92],[29,78],[20,66],[12,59],[17,51],[28,52],[32,66],[38,68],[35,51],[39,44],[29,44]],3,'#b98c58',3);
  const valleys=[[[39,61],[46,58],[55,59],[59,65],[57,76],[50,81],[44,76],[39,70]],[[29,32],[39,29],[46,35],[48,41],[40,46],[33,43],[29,39]],[[65,12],[74,8],[82,13],[84,24],[80,35],[72,38],[66,31],[63,22]],[[30,79],[37,77],[41,83],[38,91],[32,91],[29,85]]];
  valleys.forEach((poly,i)=>k.slab(poly,i===1?6:3.15,['#c09b66','#ad864f','#b6955b','#a79962'][i],i===1?3:1));
  k.slab([[40,44],[48,42],[52,46],[51,52],[46,57],[40,55],[38,49]],1.6,'#62596a',2);
  const ridges=[[[25,30],[39,27],[45,29]],[[50,31],[54,36],[52,42]],[[30,45],[33,52],[32,64]],[[40,57],[46,57],[50,56]],[[60,48],[65,42],[72,41],[81,38]],[[61,10],[68,5],[78,6],[85,12],[88,24],[86,32]],[[57,79],[61,73],[61,64]],[[27,76],[26,68],[23,56],[15,53]]];
  ridges.forEach((line,j)=>{for(let n=0;n<line.length-1;n++){
    const [a,b]=[line[n],line[n+1]],steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2.4);
    for(let i=0;i<=steps;i++){const t=i/steps,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t,h=5+(i*7+j*3)%7;
      const m=k.mesh(new THREE.CylinderGeometry(1.6,3.5,h,5),['#a56d47','#925a3e','#b57b50'][(i+j)%3],toWorld(x,y,3+h/2));m.rotation.y=i*.7;}}
  });
  k.path([[50,94],[50,83],[47,75],[45,70],[45,63]],3,'#cfb786');
  k.path([[46,71],[50,66],[56,63],[58,58],[60,51],[61,44],[58,39],[59,35],[66,33],[70,30]],2.5,'#c6ae7a');
  k.path([[44,64],[38,60],[38,51],[39,46],[40,40,6],[35,37,6]],2,'#c6ae7a');
  k.path([[44,72],[39,73],[35,79],[35,86]],2,'#c6ae7a');
  k.path([[39,73],[32,74],[28,70],[25,62],[21,58],[16,58]],2.4,'#c6ae7a');
  k.path([[70,32],[75,29],[79,25],[77,18],[70,18]],2.5,'#c6ae7a');
  k.path([[53,48],[49,49,1.7],[44,51,1.7],[40,51,1.7]],1.8,'#857187');
  k.circle(68,29,3.25,3,6,'#6e9d94');k.circle(35,85,3.3,3,5,'#74a195');
  function hut(x,y,h,r=3,height=5){
    const g=k.localGroup(x,y,h,0,'orc hide hall');k.mesh(new THREE.CylinderGeometry(r*.9,r,2.5,8),'#9e704b',[0,1.25,0],g);
    k.mesh(new THREE.ConeGeometry(r*1.25,height,8),'#793c2d',[0,height/2+2.2,0],g);
    for(let j=0;j<6;j++){const a=j/6*Math.PI*2;k.beam([Math.sin(a)*r,0,Math.cos(a)*r],[Math.sin(a)*r*.9,height+1,Math.cos(a)*r*.9],.17,'#655242',g)}
    k.mesh(new THREE.BoxGeometry(1.2,2.3,.1),'#36281e',[0,1.15,r],g);return g;
  }
  hut(49.6,69.1,3,4.2,5);hut(55.3,62,3,3.6,5);hut(54.2,69,3,3.1,5);
  hut(34,37.8,6,6,8);hut(38,41,6,2.6,5);hut(38,31,6,2.7,4);
  [[52,34],[56,33],[56,38],[61,45],[63,49],[58,53],[59,58],[56,74],[44,76],[35,83],[39,86],[66,18],[72,16],[74,22],[81,23],[80,32]].forEach(([x,y],i)=>hut(x,y,3,2.3+(i%3)*.3,3.8));
  hut(44,51,1.7,2.8,3.5);hut(49,46,1.7,2.4,4);
  // Flight tower with a visible switchback up from the valley floor.
  k.tower(45.1,63.9,3,2.4,14,'#87664a','#7e392b');
  k.circle(45.1,63.9,18,3.4,4.5,'#b59861');
  k.path([[39,68,3],[40,63,7],[43,61,11],[45,64,18]],1.6,'#b99d6a');
  k.circle(77,9,4,4.8,7,'#7e5141');k.ring(77,9,5,4.8,7,2,'#a4704d');k.ring(77,9,6,4.1,6,1.2,'#bc925b');
  // South gate: two stout towers, a walkway and tusk-like pointed stakes.
  for(const x of [44,57]){k.tower(x,85,3,3.4,9,'#9e714d','#64392d');for(const dx of [-2,2]){const m=k.mesh(new THREE.ConeGeometry(.7,5,6),'#d0c399',toWorld(x+dx,87,7));m.rotation.z=dx*.12}}
  k.wall([45,86],[56,86],3,5,2,'#8c6649');k.box(50.5,86,3,5,4,5,'#302820');
  [[49,71],[55,65],[39,39],[72,30],[43,86],[58,84],[42,50]].forEach(p=>k.fire(...p,3));
  return k;
}

function stormwind(){
  const k=modelKit('Stormwind');k.ground('#375364');
  k.slab([[30,10],[35,12],[40,25],[46,41],[55,29],[65,24],[74,25],[83,28],[88,39],[85,53],[88,63],[82,75],[79,87],[69,97],[44,99],[36,90],[33,77],[28,68],[27,57],[29,45]],3,'#929780',3.4);
  const districts=[
    [[56,68],[59,64],[64,65],[70,71],[68,80],[63,84],[57,81],[55,76]],
    [[42,74],[50,73],[55,80],[56,86],[50,94],[42,94],[37,88],[39,80]],
    [[31,60],[37,57],[43,60],[45,65],[40,73],[34,72],[30,68]],
    [[43,44],[47,40],[54,42],[59,48],[59,55],[54,61],[49,61],[44,54]],
    [[59,29],[65,27],[71,31],[72,39],[67,47],[63,45],[59,39],[56,34]],
    [[72,52],[78,48],[83,52],[85,61],[81,71],[77,70],[75,63],[70,60]],
    [[73,32],[77,27],[83,32],[85,39],[81,46],[76,42]]
  ];districts.forEach((poly,i)=>k.slab(poly,3.1,['#a6a18a','#7d8f79','#77936b','#afab93','#9c9680','#a49072','#b4ae94'][i],.5));
  const canals=[[[43,50],[45,57],[50,63],[55,63],[61,59],[63,53],[61,46],[58,41]],[[45,57],[42,61],[45,69],[42,73]],[[50,63],[47,68],[53,75],[56,80]],[[61,59],[66,61],[70,67],[73,73],[75,82],[70,90]],[[63,53],[68,49],[71,48],[75,43],[72,38]],[[70,67],[68,61],[72,55],[73,51]]];
  canals.forEach(line=>{k.path(line,4.5,'#c2c0a8',3.15);k.path(line,3,'#668f9d',3.18)});
  [[[43,58],[46,55]],[[45,70],[48,67]],[[53,73],[56,70]],[[57,64],[59,68]],[[63,59],[66,56]],[[68,48],[71,52]],[[72,40],[75,42]],[[60,43],[63,40]]].forEach(([a,b])=>k.bridge(a,b,4,3.2,'#c6c2ac'));
  const streets=[[[63,82],[64,76],[62,72],[60,68]],[[59,75],[64,76],[69,74]],[[41,84],[46,83],[50,85],[52,91]],[[47,57],[50,53],[52,49],[51,44]],[[60,35],[64,36],[68,38],[70,34]],[[74,54],[78,57],[80,62],[78,68]],[[76,42],[79,38],[79,33]],[[70,83],[72,88],[74,94]]];streets.forEach(s=>k.path(s,1.6,'#d1c7a8',3.3));
  const houses=[[59,72],[61,79],[65,80],[66,70],[59,76],[66,76],[56,77],[42,81],[44,89],[53,83],[54,87],[40,87],[47,77],[53,92],[33,63],[37,61],[41,65],[60,33],[63,30],[68,36],[65,42],[58,37],[70,31],[73,55],[77,52],[82,56],[80,65],[76,66],[49,57],[55,53],[57,48],[45,48]];
  houses.forEach(([x,y],i)=>k.house(x,y,3.2,3+(i%2),4+(i%3),i*.9));
  // Bank and auction house distinguish the two ends of the trade district.
  k.house(63.9,81.1,3,6,5,0);k.house(61.2,70.7,3,6,5,Math.PI*.25);
  k.tower(49.3,87.8,3,3.4,12);k.circle(49.3,87.8,3.2,3.8,5,'#bbc0ac');
  // Cathedral: nave, transept, paired towers and a stepped facade.
  k.house(50.5,46.3,3,7,12,0);k.house(50.5,44.6,3,13,5,0);
  k.tower(47.8,49,3,1.8,13,'#c1c2b2');k.tower(53.2,49,3,1.8,13,'#c1c2b2');
  for(let i=0;i<4;i++)k.box(50.5,51+i*.5,3+i*.15,9-i*.6,1,.2,'#d4d1bb');
  k.circle(51,54.3,3.5,1.5,2,'#b5bda6');k.circle(51,54.3,3.6,1.1,1.5,'#719da1');
  k.house(79.2,35.5,3,10,11,0);[[75,32],[82,32],[75,40],[82,40]].forEach(p=>k.tower(...p,3,2.3,10,'#c4c0ab'));
  k.wall([75,32],[82,32],3,5);k.wall([75,40],[82,40],3,5);
  k.house(78.3,69.5,3,6,7,-.2);k.circle(71,72.5,10,2.6,3.2,'#b7b5a0');k.tower(71,72.5,3,2.6,6);
  k.path([[68,76,3],[70,77,6],[71,74,10]],1.8,'#bcbba4');
  // Harbor on the expanded Forever map. Piers are at the map's actual west edge.
  k.slab([[27.4,20],[29,20],[29,55],[26,57]],1,'#989b89',2);
  [25,33.5,41,53].forEach((y,i)=>{k.box(23.2,y,.7,12,2.8,.6,'#967b52');for(const x of [20,23,26])k.box(x,y,-.5,.3,3,1.5,'#66503a');if(i<3)k.fire(27,y,1)});
  k.path([[30,25,1],[32,38,2],[38,46,3],[43,50,3]],2.2,'#cec6a8');
  for(let y=22;y<=55;y+=7)k.tree(32,y,3,.55,'#557457');
  [[34,65],[38,68],[41,62],[50,58],[69,28]].forEach(p=>k.tree(...p,3,.6));
  [[32,14],[40,25],[43,38],[59,27],[71,26],[85,45],[85,69]].forEach(p=>k.tower(...p,3,1.5,6));
  k.wall([33,19],[40,28],3,3);k.wall([40,28],[44,40],3,3);k.wall([82,70],[79,81],3,3);
  return k;
}

function ironforge(){
  const k=modelKit('Ironforge');k.ground('#393532');
  k.slab([[18,4],[34,2],[40,5],[47,1],[56,3],[64,2],[77,8],[82,22],[73,34],[74,43],[91,44],[91,58],[76,59],[73,70],[79,84],[75,96],[61,97],[53,89],[39,88],[25,94],[11,84],[12,70],[18,61],[15,43],[16,22]],3,'#777466',4);
  k.ring(47,44,3.2,28,39,8,'#a59f8c');k.ring(47,44,3.23,28,39,1,'#bdb395');
  k.ring(48,43,3.3,14,22,7,'#aaa18a');
  [[26,15,38,30],[24,55,36,51],[34,74,42,60],[68,73,59,56],[72,45,62,44],[65,20,56,28]].forEach(([a,b,c,d])=>k.path([[a,b],[c,d]],5,'#a59f8c',3.3));
  // Lava channels and the raised great forge.
  const lava=k.mat('#e58632',{emissive:'#e35c1f',emissiveIntensity:.7,roughness:.5});
  k.circle(49.5,40.5,3.4,8.4,12.5,lava);k.circle(49.5,40.5,3.55,3.3,4.5,'#766653');
  k.ring(47,44,3.35,31,43,2,lava,.1,Math.PI*1.16);
  k.path([[30,42],[29,49],[33,52],[38,48]],2,lava,3.4);
  k.bridge([41,43],[57,43],4.3,3,'#998b74');k.bridge([49,30],[49,53],4.35,3,'#998b74');
  k.box(49.5,39,4.4,5,4,3,'#4e4b45');k.box(49.5,39,7.4,7,3,1,'#64615a');
  for(const [x,y] of [[44,33],[54,36],[44,49],[54,49]]){k.box(x,y,3,2,2,7,'#74614c');k.fire(x,y,10)}
  function hall(x,y,w,d,rotation=0){const g=k.house(x,y,3,w,d,rotation,'dwarf');k.pavilion(x,y,7.8,w*.45,2,'#91866d','#6d5440');return g}
  hall(25,8,11,10);hall(67,17,13,10,.1);hall(68,87,12,10);hall(39.1,56.2,9,7,-.3);
  // Dwarven monumental doors and supports.
  [[22,17],[28,17],[62,23],[70,23],[63,82],[73,82]].forEach(([x,y])=>{k.box(x,y,3,2,2,9,'#9d8d70');k.box(x,y,11.8,3,2.6,1,'#b3a17b')});
  const buildings=[[18,51],[24,74],[35,58],[32,68],[36,82],[20,32],[22,24],[33,28],[39,33],[44,29],[56,32],[59,37],[60,47],[55,58],[53,72],[61,80],[70,73],[71,63],[61,25]];
  buildings.forEach(([x,y],i)=>k.house(x,y,3,3.7+(i%2),4+(i%3),i*.7,'dwarf'));
  k.circle(48,12,3.25,3,7,'#536d72');k.house(50,6,3,6,5,0,'gothic');k.house(53,16,3,4,5,0,'gothic');
  // Tinker Town: copper domes, cogwork and rails into the tram tunnel.
  k.circle(68.5,49.5,3.4,6,9,'#827e69');
  for(const [x,y,rr] of [[68,45,3.2],[72,50,2.6],[66.5,55,2.4]]){
    k.mesh(new THREE.CylinderGeometry(rr,rr,3,16),'#8a7760',toWorld(x,y,4.5));const dome=k.mesh(new THREE.SphereGeometry(rr*1.05,16,10,0,Math.PI*2,0,Math.PI/2),k.mat('#a57348',{metalness:.45,roughness:.65}),toWorld(x,y,6));
    k.mesh(new THREE.TorusGeometry(rr*1.03,.2,6,20),'#c0a46d',toWorld(x,y,6)).rotation.x=Math.PI/2;
  }
  k.path([[73,51],[88,51]],6,'#958b76');
  for(const y of [49.8,52.2])k.path([[74,y],[88,y]],.25,'#c0bab0',3.5);
  for(let x=74;x<89;x+=1.1)k.box(x,51,3.2,.3,4,.15,'#4c443c');
  k.house(86,51,3,8,9,Math.PI/2,'dwarf');
  [[19,69],[29,80],[40,31],[58,29],[61,61],[71,44],[39,57],[26,9],[68,85]].forEach(([x,y])=>k.fire(x,y,3));
  // Exposed outer rock face keeps the interior legible without a roof.
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2,x=47+35*Math.cos(a),y=44+47*Math.sin(a);if(x>75||y>93||y<3)continue;const rock=k.mesh(new THREE.IcosahedronGeometry(4,0),'#5b5951',toWorld(x,y,4));rock.scale.set(1,1.6,1)}
  return k;
}

function darnassus(){
  const k=modelKit('Darnassus');k.ground('#334847');
  k.slab([[28,3],[44,1],[51,5],[64,2],[72,12],[77,27],[73,34],[86,32],[91,36],[90,45],[73,44],[72,56],[75,70],[69,85],[60,95],[38,98],[26,87],[24,69],[21,52],[26,34],[29,23]],3,'#738879',3.8);
  k.slab([[28,28],[35,27],[41,31],[47,28],[54,30],[57,36],[53,41],[51,45],[52,52],[49,58],[54,65],[54,74],[49,79],[46,76],[41,72],[35,75],[29,72],[25,63],[24,52],[25,43]],3.1,'#659b9d',.4);
  k.slab([[30,34],[34,38],[34,46],[31,49],[30,56],[27,57],[27,46]],3.3,'#789178',.5);
  k.slab([[47,52],[51,52],[51,57],[47,60],[44,57],[43,53]],3.4,'#879b7d',.7);
  k.slab([[45,7],[60,6],[70,11],[73,22],[68,29],[57,29],[50,26],[47,18]],5,'#82947e',2);
  k.slab([[56,33],[72,33],[72,48],[56,48]],7,'#929d8c',4);
  k.slab([[56,51],[70,52],[73,66],[67,80],[60,88],[52,82],[51,72],[56,65]],5,'#818d85',2);
  k.circle(39,84,6,11,12,'#a5b4a1',3);k.circle(39,84,6.3,9,10,'#c5cab1');
  // White walkways connect the lake's banks and its central service buildings.
  const walks=[[[39,20,5],[40,30,3.5],[42,36,3.5],[39.6,42,3.5],[39,55,3.5],[39,72,6]],[[30,41,3.5],[35,41,3.5],[39.6,42,3.5],[51,42,3.5],[57,41,7]],[[39,55,3.5],[48,55,3.5],[55,54,5]],[[42,31,3.5],[50,31,5],[57,23,5],[65,17,5]],[[60,38,7],[71,39,7],[86,39,3]],[[59,55,5],[64,63,5],[62,73,5],[57,82,5]]];walks.forEach(w=>{k.path(w,2.8,'#b8c3ac');k.path(w,.35,'#d0d1b6')});
  k.bridge([35,41],[39,41],3.8,3,'#b8c6b6');k.bridge([44,42],[49,42],3.8,3,'#b8c6b6');
  k.pavilion(39.6,42,3.5,4.4,4,'#b5c4b3','#7a83a2');k.house(55.6,52.4,5,6,5,0,'elf');k.house(67.4,15.6,5,5,6,.2,'elf');
  const homes=[[51,12],[56,12],[63,10],[69,21],[63,23],[55,24],[57,17],[64,29],[67,59],[65,67],[58,72],[56,79],[62,82],[70,69]];
  homes.forEach(([x,y],i)=>k.house(x,y,5,3.5+(i%2),4.5,i*.8,'elf'));
  k.pavilion(60,38,7,5,5);k.pavilion(87,39,3,5.5,6);
  // Temple of the Moon uses an open colonnade so its upper level stays readable.
  k.circle(39,84,7,7,8,'#cbd0b5');
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2,x=39+6.8*Math.cos(a),y=84+7.8*Math.sin(a);k.mesh(new THREE.CylinderGeometry(.5,.65,10,10),'#c9d0b8',toWorld(x,y,12));if(i%3===0)k.pavilion(x,y,17,1.5,1.7,'#c9d0b8','#9c94b3')}
  k.ring(39,84,17,6.8,7.8,.9,'#d1d3ba');k.circle(39,84,7.2,2.2,3,'#85b6b3');
  k.slab([[34,78],[44,78],[44,82],[34,82]],12,'#bac8b1',.6);k.path([[44,87,7],[45,83,9],[44,80,12]],1.5,'#b6c5af');
  for(let i=0;i<6;i++)k.box(39,72+i*.6,3.7+i*.4,9,1,1,'#b8c5ad');
  // Cenarion trees and elevated training platforms.
  [[34,9],[41,8],[35,21]].forEach(([x,y],i)=>{k.tree(x,y,3,2.4,'#7c6e97');k.circle(x,y,8,2.4,3.5,'#a1ad8d',.6);k.pavilion(x,y,8,2.7,3,'#96aa91','#7f7397')});
  k.path([[35,20,3],[34,15,5],[35,9,8]],1.2,'#a6b69b');
  [[28,22],[29,31],[24,48],[26,65],[29,78],[48,4],[71,10],[74,27],[73,52],[72,76],[61,92],[45,95]].forEach(([x,y],i)=>k.tree(x,y,3,1+(i%3)*.2,i%2?'#6e7893':'#657b76','round'));
  const portal=k.mesh(new THREE.TorusGeometry(2,.25,8,32),'#b7b5c4',toWorld(30,41,5.5));
  k.mesh(new THREE.CircleGeometry(1.8,32),k.mat('#ae84cf',{emissive:'#8354b4',emissiveIntensity:.7,transparent:true,opacity:.8,side:THREE.DoubleSide}),toWorld(30,41,5.5));
  [[50,31],[48,55],[39,72],[57,35]].forEach(([x,y])=>{k.circle(x,y,5.1,1,1.5,'#b4c4ac');k.circle(x,y,5.2,.75,1,'#84c5c0')});
  return k;
}

export function buildCity(id){
  const builders={'thunder-bluff':thunderBluff,orgrimmar,undercity:createUndercity,stormwind,ironforge,darnassus};
  if(!builders[id])throw new Error(`Unknown city: ${id}`);
  const city=builders[id]();
  const gates={orgrimmar:[[50.5,91.5,3,0],[16.5,61.5,3,.5]],stormwind:[[73.5,91.5,3,-.4]],ironforge:[[18,82.5,3,-.6]]};
  for(const [x,y,h,rotation] of gates[id]||[]){
    const gate=new THREE.Group();gate.name='main city entrance';gate.position.set(...toWorld(x,y,h));gate.rotation.y=rotation;city.group.add(gate);
    const stone=new THREE.MeshStandardMaterial({color:id==='orgrimmar'?'#976949':id==='ironforge'?'#97876d':'#c3c0a9',roughness:1});
    for(const side of [-1,1]){const pillar=new THREE.Mesh(new THREE.BoxGeometry(1.6,6,2.5),stone);pillar.position.set(side*3.5,3,0);pillar.castShadow=true;pillar.receiveShadow=true;gate.add(pillar)}
    const lintel=new THREE.Mesh(new THREE.BoxGeometry(8.6,1.4,2.6),stone);lintel.position.y=6.5;lintel.castShadow=true;gate.add(lintel);
    const crest=new THREE.Mesh(new THREE.ConeGeometry(1.1,2,4),new THREE.MeshStandardMaterial({color:id==='orgrimmar'?'#783c29':'#536f86',roughness:1}));crest.position.y=8.1;crest.rotation.y=Math.PI/4;gate.add(crest);
  }
  return city;
}

export function disposeCity(city){
  const geometries=new Set(),materials=new Set(),textures=new Set();
  city.group.traverse(o=>{if(o.isInstancedMesh)o.dispose();if(o.geometry)geometries.add(o.geometry);const ms=Array.isArray(o.material)?o.material:[o.material];ms.filter(Boolean).forEach(m=>{materials.add(m);for(const value of Object.values(m))if(value?.isTexture)textures.add(value)})});
  // Thunder Bluff temporarily swaps a set of materials for its underground cutaway.
  city.showCave?.(false);city.setLevel?.('surface');city.group.traverse(o=>{(Array.isArray(o.material)?o.material:[o.material]).filter(Boolean).forEach(m=>materials.add(m))});
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  city.dispose?.();
}
