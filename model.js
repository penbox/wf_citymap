import * as THREE from 'three';
import { toWorld } from './data.js';
import {createElevator,elevatorController} from './elevators.js';

// Hand-traced from the reference map. These contours, relative heights and
// architectural proxies support orientation; they are not collision/navmesh data.
const outlines = {
  central:[[30,49],[32,45],[36,43],[37,35],[41,31],[45,30],[48,28],[52,29],[55,31],[57,35],[56,39],[59,38],[62,40],[64,47],[65,55],[64,62],[60,65],[55,63],[51,63],[48,69],[44,71],[40,69],[36,71],[32,68],[30,62],[31,56]],
  middle:[[37,36],[41,32],[45,31],[49,29],[54,31],[56,35],[54,40],[50,43],[48,45],[46,47],[42,47],[39,44],[37,41]],
  high:[[48,48],[51,43],[56,39],[60,39],[63,44],[64,51],[64,58],[62,62],[59,63],[54,60],[51,61],[49,58],[47,55]],
  spirit:[[17,14],[21,11],[27,12],[31,16],[33,22],[31,28],[28,31],[22,31],[18,28],[16,23],[16,18]],
  elder:[[70,26],[73,23],[78,23],[81,25],[83,29],[82,33],[79,35],[74,35],[70,33],[69,30]],
  hunter:[[52,78],[55,75],[59,75],[63,78],[64,83],[62,89],[59,93],[55,93],[52,90],[51,85]]
};

export function createCity() {
  const city = new THREE.Group(); city.name='Thunder Bluff';
  const materials = new Map();
  function mat(color,extra={}) {
    const key=color+JSON.stringify(extra);
    if(!materials.has(key)){const m=new THREE.MeshStandardMaterial({color,roughness:1,...extra});m.name=color;materials.set(key,m);}
    return materials.get(key);
  }
  const wood=mat('#5c4027'), lightWood=mat('#a68b5a'), rope=mat('#b49d6e');
  const hide=mat('#d0bb85'), red=mat('#9a4431'), teal=mat('#628c81');
  function mesh(geo,material,pos,parent=city,name='detail') {
    const m=new THREE.Mesh(geo,material);m.name=name;
    if(pos)m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }
  function beam(a,b,r,material=wood,parent=city){
    const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),dir=bv.clone().sub(av);
    const m=mesh(new THREE.CylinderGeometry(r,r,dir.length(),6),material,av.add(bv).multiplyScalar(.5).toArray(),parent,'timber');
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());return m;
  }
  function line(points,r,material,parent=city){
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    return mesh(new THREE.TubeGeometry(curve,Math.max(12,points.length*5),r,5,false),material,null,parent,'rope');
  }
  function flatShape(polygon,height,material,parent=city){
    const contour=polygon.map(([x,y])=>{const [wx,,wz]=toWorld(x,y);return new THREE.Vector2(wx,wz)});
    const triangles=THREE.ShapeUtils.triangulateShape(contour,[]),v=[];
    for(const t of triangles)for(const i of [...t].reverse())v.push(contour[i].x,height,contour[i].y);
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));geo.computeVertexNormals();
    const m=mesh(geo,material,null,parent,'plateau surface');m.material.side=THREE.DoubleSide;return m;
  }
  function mesa(polygon,height,base=0,grass='#6c7948'){
    const center=polygon.reduce((p,q)=>[p[0]+q[0]/polygon.length,p[1]+q[1]/polygon.length],[0,0]);
    const rings=[{h:base,s:1.07},{h:base+(height-base)*.12,s:1.12},{h:base+(height-base)*.52,s:1.06},{h:height-.7,s:1.025},{h:height,s:1}];
    const colors=['#5b4935','#776044','#8d714f','#9e8158'];
    const v=[],c=[];
    for(let r=0;r<rings.length-1;r++)for(let i=0;i<polygon.length;i++){
      const j=(i+1)%polygon.length,verts=[i,j,j,i,j,i],levels=[r,r,r+1,r,r+1,r+1];
      const color=new THREE.Color(colors[r]).multiplyScalar(.87+((i*7)%11)/50);
      verts.forEach((idx,k)=>{const ring=rings[levels[k]],p=polygon[idx],x=center[0]+(p[0]-center[0])*ring.s,y=center[1]+(p[1]-center[1])*ring.s;
        v.push(...toWorld(x,y,ring.h));c.push(color.r,color.g,color.b);});
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));g.computeVertexNormals();
    mesh(g,mat('#ffffff',{vertexColors:true,side:THREE.DoubleSide,flatShading:true}),null,city,'layered sandstone cliff');
    flatShape(polygon,height+.03,mat(grass));
    const rim=polygon.map(p=>toWorld(...p,height+.02));rim.push(rim[0]);line(rim,.22,mat('#b6a26b'));
  }
  mesa(outlines.central,12,0,'#687847');
  mesa(outlines.middle,16,11.9,'#72814a');
  mesa(outlines.high,20,11.9,'#77864e');
  const spiritStart=city.children.length;
  mesa(outlines.spirit,19,0,'#6f8151');
  const spiritParts=city.children.slice(spiritStart);
  mesa(outlines.elder,22,0,'#788650');
  mesa(outlines.hunter,16,0,'#72804b');

  // Dark, softly lit landscape extends to the horizon; the city remains the focus.
  mesh(new THREE.PlaneGeometry(2000,2000),mat('#3c4933'),[0,-.6,0],city,'Mulgore plains').rotation.x=-Math.PI/2;
  const rand=(()=>{let s=2901;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)})();
  const terrainGeo=new THREE.PlaneGeometry(350,290,35,29);terrainGeo.rotateX(-Math.PI/2);
  const attr=terrainGeo.attributes.position;
  for(let i=0;i<attr.count;i++){
    const x=attr.getX(i),z=attr.getZ(i),d=Math.hypot(x*.85,z);
    attr.setY(i,-.25+Math.max(0,d-60)*.04*(1+Math.sin(x*.07)*Math.cos(z*.06))+rand()*.12);
  }
  terrainGeo.computeVertexNormals();mesh(terrainGeo,mat('#495537',{flatShading:true}),null,city,'rolling plains');

  function path(points,width=.9){
    const world=points.map(p=>toWorld(...p));
    const curve=new THREE.CatmullRomCurve3(world.map(p=>new THREE.Vector3(...p)),false,'centripetal');
    const sampled=curve.getPoints(Math.max(24,points.length*8)),v=[];
    for(let i=0;i<sampled.length-1;i++){
      const a=sampled[i],b=sampled[i+1],normal=b.clone().sub(a).cross(new THREE.Vector3(0,1,0)).normalize().multiplyScalar(width/2);
      const q=[a.clone().add(normal),b.clone().add(normal),b.clone().sub(normal),a.clone().add(normal),b.clone().sub(normal),a.clone().sub(normal)];
      q.forEach(p=>v.push(p.x,p.y+.08,p.z));
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));geo.computeVertexNormals();
    mesh(geo,mat('#b3a376',{side:THREE.DoubleSide}),null,city,'worn footpath');
  }
  path([[32,65,12],[36,62,12],[39,59,12],[42,57,12],[45,54,12],[46.5,50,12]],1.2);
  path([[39,59,12],[42,63,12],[46,66,12],[47,69,12]],1);
  path([[34,48,12],[37,50,12],[41,51,12],[46,50,12]],1.2);
  path([[39,59,12],[37,55,12],[38,50,12]],.9);
  path([[38,39,16],[42,40,16],[46,39,16],[51,36,16],[55,34,16]],1.2);
  path([[42,40,16],[44,35,16],[47,33,16],[50,35,16]],.8);
  path([[47,45,16],[46.5,49,14],[45,51,12]],1.4);
  path([[49,47,20],[51,49,20],[54,50,20],[58,50,20],[61,52,20]],1);
  path([[54,50,20],[54,56,20],[58,60,20],[61,62,20]],1.2);
  path([[54,50,20],[56,44,20],[60,40,20]],1);
  path([[49,45,16],[50,44,17],[51,44,19],[52,45,20]],1.4);
  path([[69.5,29,22],[73,30,22],[76,29,22],[79,29,22]],1);
  path([[70,34,22],[73,32,22],[76,29,22]],.8);
  path([[31,28,19],[27,26,19],[24,21,19],[22,17,19]],1);
  path([[28,31,19],[27,26,19]],1);
  path([[54,79,16],[57,81,16],[59,84,16],[58,89,16]],1);
  path([[62,77,16],[59,80,16],[57,81,16]],.8);
  path([[31,67,0],[34,77,0],[42,85,0],[49,94,0],[51,104,0]],2.3);

  function bridge(a,b){
    const av=new THREE.Vector3(...toWorld(...a)),bv=new THREE.Vector3(...toWorld(...b));
    const length=av.distanceTo(bv),count=Math.ceil(length/.65),cross=bv.clone().sub(av).cross(new THREE.Vector3(0,1,0)).normalize();
    const deck=new THREE.InstancedMesh(new THREE.BoxGeometry(2.1,.19,.62),lightWood,count);deck.name='suspension bridge planks';deck.castShadow=true;deck.receiveShadow=true;
    const o=new THREE.Object3D(),forward=bv.clone().sub(av).normalize();
    for(let i=0;i<count;i++){const t=i/(count-1),p=av.clone().lerp(bv,t);p.y-=Math.sin(Math.PI*t)*1.2;o.position.copy(p);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),forward);o.updateMatrix();deck.setMatrixAt(i,o.matrix)}
    city.add(deck);
    for(const side of [-1,1]){
      const rail=[];
      for(let i=0;i<=12;i++){const t=i/12,p=av.clone().lerp(bv,t).addScaledVector(cross,side*1.05);p.y+=1.45-Math.sin(Math.PI*t)*1.2;rail.push(p.toArray());}
      line(rail,.07,rope);
      for(let i=0;i<=4;i++){const t=i/4,p=av.clone().lerp(bv,t).addScaledVector(cross,side*1.05);p.y-=Math.sin(Math.PI*t)*1.2;beam(p.toArray(),[p.x,p.y+1.6,p.z],.09,i===0||i===4?wood:rope)}
    }
  }
  bridge([31,28,19],[38.5,36,16]);bridge([27.5,31,19],[33.5,46,12]);
  bridge([55.5,34,16],[69.5,28.5,22]);bridge([60.4,40,20],[70.2,34,22]);
  bridge([46,69,12],[54,79,16]);bridge([61,62,20],[62,77,16]);

  function tent(x,y,h,r=2.7,height=4,rotation=0,color=hide){
    const group=new THREE.Group();group.name='hide tent';group.position.set(...toWorld(x,y,h));group.rotation.y=rotation;city.add(group);
    mesh(new THREE.CylinderGeometry(r*.65,r,height*.35,10),mat('#ac9569'),[0,height*.175,0],group,'tent wall');
    mesh(new THREE.ConeGeometry(r*1.12,height,10),color,[0,height*.7,0],group,'hide roof');
    mesh(new THREE.CylinderGeometry(r*.72,r*.84,height*.12,10,1,true),red,[0,height*.48,0],group,'painted hide band');
    mesh(new THREE.PlaneGeometry(r*.52,height*.52),mat('#30271b',{side:THREE.DoubleSide}),[0,height*.26,r*.88],group,'tent entrance');
    for(let i=0;i<4;i++){const angle=i*Math.PI/2;beam([Math.sin(angle)*r*.8,0,Math.cos(angle)*r*.8],[-Math.sin(angle)*.3,height*1.35,-Math.cos(angle)*.3],.07,wood,group)}
    return group;
  }
  function longhouse(x,y,h,w=5,d=8,rotation=0,roof=teal){
    const g=new THREE.Group();g.name='tauren longhouse';g.position.set(...toWorld(x,y,h));g.rotation.y=rotation;city.add(g);
    mesh(new THREE.BoxGeometry(w,2.2,d),mat('#aa956c'),[0,1.1,0],g,'longhouse hide walls');
    const geo=new THREE.CylinderGeometry(w*.61,w*.61,d+1,12,1,true,0,Math.PI);geo.rotateZ(Math.PI/2);geo.rotateY(Math.PI/2);
    mesh(geo,roof,[0,2,0],g,'arched fabric roof');
    for(let i=0;i<4;i++){
      const zz=-d/2+i*d/3,points=[];
      for(let j=0;j<=12;j++){const a=j/12*Math.PI;points.push([Math.cos(a)*w*.62,2+Math.sin(a)*w*.62,zz])}
      line(points,.13,lightWood,g);
    }
    mesh(new THREE.PlaneGeometry(1.5,2.2),mat('#352a1d',{side:THREE.DoubleSide}),[0,1.1,d/2+.02],g,'door');
    for(const xx of [-1,1])for(const zz of [-1,1]){beam([xx*w*.54,0,zz*d*.51],[xx*w*.54,4,zz*d*.51],.14,wood,g)}
    return g;
  }
  // Distinctive public buildings stay at their actual map positions.
  longhouse(46.9,58.4,12,5.3,6,-.22,teal); // Bank
  longhouse(39.1,50.7,12,6,4,Math.PI/2,mat('#8d7556'));
  longhouse(45.8,65.5,12,5.6,7,.2,teal);
  longhouse(33.9,48.4,12,4.6,6,-.5,teal);
  longhouse(40,37.3,16,5.3,7,-.2,teal);
  longhouse(52.6,34.5,16,5.6,6,1.2,teal);
  longhouse(59.3,43.6,20,4.7,7,.5,teal);
  longhouse(59.4,59.8,20,4.9,6,-.4,teal);
  longhouse(58,88.1,16,5.8,9,.3,hide);
  tent(76.8,29.2,22,7,6,.1);spiritParts.push(tent(22.8,19,19,5.2,7,.5));
  longhouse(61.5,51.7,20,3.8,9,0,mat('#aa6242'));
  tent(61.6,47,20,2,5);tent(61.6,56.3,20,2,5);
  const huts=[[35,56.5,12,2],[37,63.8,12,1.6],[41,64,12,1.5],[44,61,12,1.5],[44,54,12,1.4],[43,42,16,1.6],[46.5,33,16,2.1],[48,42,16,1.5],[49.5,38.3,16,1.5],[52,47,20,1.8],[54.5,46.5,20,1.6],[56,46,20,1.4],[51,54.3,20,1.8],[53,58,20,1.8],[55,60,20,1.5],[55,77.5,16,1.4],[58.5,77,16,1.3],[62,81,16,1.4],[29,17.8,19,1.6],[26,26,19,1.7],[21.5,26,19,1.4],[72.2,27,22,1.5],[81,29,22,1.2]];
  huts.forEach(([x,y,h,r],i)=>{const hut=tent(x,y,h,r,2.6+rand(),i*.7,i%4===0?mat('#a57b4e'):hide);if(x<34&&y<32)spiritParts.push(hut)});

  // Central totem and its elevated flight platform are an unmistakable landmark.
  const tower=new THREE.Group();tower.position.set(...toWorld(46.8,49.9,12));tower.name='wind rider totem';city.add(tower);
  mesh(new THREE.CylinderGeometry(1.5,2.1,19,10),wood,[0,9.5,0],tower,'totem column');
  for(let i=0;i<4;i++){
    const yy=3+i*4;
    mesh(new THREE.CylinderGeometry(1.8,1.8,.65,10),i%2?teal:red,[0,yy,0],tower,'painted totem band');
    mesh(new THREE.BoxGeometry(2.1,1.2,.4),hide,[0,yy+1.1,1.55],tower,'carved face');
    for(const side of [-1,1])mesh(new THREE.BoxGeometry(.4,.3,.15),mat('#292d23'),[side*.5,yy+1.25,1.8],tower,'carved eye');
    mesh(new THREE.ConeGeometry(.43,1,4),red,[0,yy+.7,1.9],tower,'carved beak').rotation.x=Math.PI/2;
  }
  mesh(new THREE.CylinderGeometry(3.8,3.4,.7,12),lightWood,[0,19.6,0],tower,'flight platform');
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2;beam([Math.cos(a)*3.4,19.9,Math.sin(a)*3.4],[Math.cos(a)*3.4,21.1,Math.sin(a)*3.4],.07,wood,tower)}
  mesh(new THREE.ConeGeometry(3.1,2.7,10),hide,[0,23.8,0],tower,'roost canopy');
  beam([0,20,0],[0,26,0],.12,wood,tower);
  for(const side of [-1,1]){beam([0,16,0],[side*4,17,0],.25,wood,tower);mesh(new THREE.ConeGeometry(.5,2,4),hide,[side*4.6,17,0],tower,'totem horn').rotation.z=-side*Math.PI/2}

  // Pond on the lower rise; its geography is visible on the game map.
  const pond=mesh(new THREE.CircleGeometry(2.2,20),mat('#547f75',{roughness:.35,metalness:.15}),toWorld(40.2,58.4,12.11),city,'fishing pond');pond.rotation.x=-Math.PI/2;pond.scale.set(.85,1.25,1);
  const elevators=[
    createElevator({id:'lift-west',x:31.7,y:65.9,bottom:.15,top:12,rotation:-1.1,offset:7,phase:4}),
    createElevator({id:'lift-north',x:54.2,y:26.9,bottom:.15,top:16,rotation:Math.PI*.8,offset:3,approach:6,phase:7})
  ];
  elevators.forEach(e=>city.add(e.group));

  // A cutaway opening makes the lower Pools of Vision distinguishable from the rise.
  const cave=mesh(new THREE.SphereGeometry(2.5,16,10),mat('#202a26'),toWorld(29,29,13),city,'Pools of Vision entrance');cave.scale.set(1,.7,.45);
  const pool=mesh(new THREE.CircleGeometry(2.2,16),mat('#6d9f91',{emissive:'#254338',emissiveIntensity:.3}),toWorld(26.7,28.3,12.4),city,'Pools of Vision pool');pool.rotation.x=-Math.PI/2;

  function tree(x,y,h,size=1){
    const [wx,wy,wz]=toWorld(x,y,h),g=new THREE.Group();g.position.set(wx,wy,wz);g.name='Mulgore tree';city.add(g);
    beam([0,0,0],[.2,3*size,0],.16*size,wood,g);
    const crown=mesh(new THREE.IcosahedronGeometry(2*size,1),mat('#586b3d',{flatShading:true}),[.2,3.4*size,0],g,'leaf canopy');crown.scale.set(1.3,.42,1);
    beam([.1,1.5*size,0],[1.2*size,2.9*size,.3],.08*size,wood,g);
  }
  [[18,22,19],[29,24,19],[25,13,19],[72,32,22],[79,24,22],[81,32,22],[52.8,85,16],[61,85,16],[34,61,12],[35,68,12],[43,68,12],[40,34,16],[52,31,16],[63,56,20]].forEach(p=>tree(...p,.55+rand()*.3));
  for(let i=0;i<40;i++){
    const a=rand()*Math.PI*2,r=75+rand()*70,x=Math.cos(a)*r,z=Math.sin(a)*r;
    if(i%3===0)tree(x/1.8+50,z/1.2+50,0,.7+rand()*.9);
    else{const m=mesh(new THREE.IcosahedronGeometry(.7+rand()*2,0),mat('#77745a',{flatShading:true}),[x,0,z],city,'plain rock');m.scale.y=.5}
  }
  // Tiny carved posts and pennants add character without obscuring landmarks.
  [[32.5,62,12],[55,27,16],[71,28,22],[28.5,29,19],[54,80,16],[60,60,20]].forEach(([x,y,h],i)=>{
    const p=toWorld(x,y,h);beam(p,[p[0],p[1]+4,p[2]],.1);
    const flag=mesh(new THREE.PlaneGeometry(1.4,1.8),i%2?teal:red,[p[0]+.7,p[1]+3,p[2]],city,'hanging banner');flag.material.side=THREE.DoubleSide;
  });
  const caveFloor=mesh(new THREE.CircleGeometry(7,24),mat('#405e56'),toWorld(24,21,12.05),city,'interior cave floor');caveFloor.rotation.x=-Math.PI/2;caveFloor.visible=false;
  const cavePool=mesh(new THREE.CircleGeometry(2.4,24),mat('#78baaf',{emissive:'#395f5b',emissiveIntensity:.4}),toWorld(25,21,12.12),city,'interior cave pool');cavePool.rotation.x=-Math.PI/2;cavePool.visible=false;
  const translucent=[];
  spiritParts.forEach(part=>part.traverse(o=>{if(o.isMesh){const original=o.material,ghost=original.clone();ghost.transparent=true;ghost.opacity=.16;ghost.depthWrite=false;translucent.push({mesh:o,original,ghost})}}));
  const ring=mesh(new THREE.RingGeometry(2.2,2.45,48),new THREE.MeshBasicMaterial({color:'#f5d18a',side:THREE.DoubleSide,transparent:true,opacity:.9,depthTest:false}),[0,0,0],city,'selected place');ring.rotation.x=-Math.PI/2;ring.renderOrder=10;ring.visible=false;
  return {group:city,selection:ring,...elevatorController(elevators),showCave(show){translucent.forEach(o=>o.mesh.material=show?o.ghost:o.original);caveFloor.visible=show;cavePool.visible=show},dispose(){translucent.forEach(o=>o.ghost.dispose())}};
}
