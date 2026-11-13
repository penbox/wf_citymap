import * as THREE from 'three';
import {toWorld} from './data.js';

// Reusable construction primitives. All arguments x/y refer to the displayed map;
// architectural dimensions are illustrative scene units, not game measurements.
export function modelKit(name){
  const group=new THREE.Group();group.name=name;const mats=new Map();
  const mat=(color,extra={})=>{if(color?.isMaterial)return color;const key=color+JSON.stringify(extra);if(!mats.has(key)){const m=new THREE.MeshStandardMaterial({color,roughness:.9,...extra});m.name=color;mats.set(key,m)}return mats.get(key)};
  function mesh(geometry,material,position=[0,0,0],parent=group,name='architectural detail'){
    const m=new THREE.Mesh(geometry,typeof material==='string'?mat(material):material);m.name=name;m.position.set(...position);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }
  const box=(x,y,h,w,d,height,color,parent=group)=>mesh(new THREE.BoxGeometry(w,height,d),color,toWorld(x,y,h+height/2),parent,'stonework');
  function slab(points,h,color,depth=1){
    const shape=new THREE.Shape();points.forEach(([x,y],i)=>{const [wx,,wz]=toWorld(x,y);i?shape.lineTo(wx,-wz):shape.moveTo(wx,-wz)});shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,steps:1});geo.rotateX(-Math.PI/2);
    return mesh(geo,[mat(color),mat(new THREE.Color(color).multiplyScalar(.66).getStyle())],[0,h-depth,0],group,'district foundation');
  }
  function beam(a,b,r,color,parent=group){
    const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),d=bv.clone().sub(av);
    const m=mesh(new THREE.CylinderGeometry(r,r,d.length(),6),color,av.add(bv).multiplyScalar(.5).toArray(),parent,'support beam');m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;
  }
  function path(points,width,color,h=3.1){
    const world=points.map(p=>new THREE.Vector3(...toWorld(p[0],p[1],p[2]??h)));
    const curve=new THREE.CatmullRomCurve3(world,false,'centripetal'),sample=curve.getPoints(Math.max(20,points.length*5)),v=[];
    // Shared edges make a continuous ribbon. Independent segment normals cause
    // adjacent quads to overlap and flicker on bends and circular streets.
    const edges=sample.map((p,i)=>{const n=curve.getTangent(i/(sample.length-1)).cross(new THREE.Vector3(0,1,0)).normalize().multiplyScalar(width/2);return [p.clone().add(n),p.clone().sub(n)]});
    for(let i=0;i<sample.length-1;i++){
      const [a,b]=edges[i],[c,d]=edges[i+1];[a,c,d,a,d,b].forEach(p=>v.push(...p.toArray()));}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));geo.computeVertexNormals();
    return mesh(geo,mat(color,{side:THREE.DoubleSide}),[0,0,0],group,'street or watercourse');
  }
  function circle(x,y,h,rx,ry,color,depth=.3,segments=48){const m=mesh(new THREE.CylinderGeometry(1,1,depth,segments),color,toWorld(x,y,h-depth/2),group,'circular platform');m.scale.set(rx*1.8,1,ry*1.2);return m}
  function ring(x,y,h,rx,ry,width,color,start=0,end=Math.PI*2){const points=[];for(let i=0;i<=64;i++){const a=start+(end-start)*i/64;points.push([x+Math.cos(a)*rx,y+Math.sin(a)*ry,h])}return path(points,width,color)}
  function localGroup(x,y,h,rotation=0,name='building'){const g=new THREE.Group();g.position.set(...toWorld(x,y,h));g.rotation.y=rotation;g.name=name;group.add(g);return g}
  function roof(w,d,h,color,parent){
    const points=[[-w/2,0,-d/2],[w/2,0,-d/2],[0,h,-d/2],[-w/2,0,d/2],[w/2,0,d/2],[0,h,d/2]],idx=[0,2,1,3,4,5,0,3,5,0,5,2,2,5,4,2,4,1];
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(idx.flatMap(i=>points[i]),3));geo.computeVertexNormals();return mesh(geo,mat(color,{side:THREE.DoubleSide}),[0,0,0],parent,'pitched roof');
  }
  function house(x,y,h=3,w=4,d=5,rotation=0,style='human'){
    const colors={human:['#b8b4a0','#385c7c','#5c5442'],dwarf:['#898075','#81553d','#443c35'],gothic:['#747e75','#474b60','#303b34'],elf:['#c0c2a9','#786c9c','#667b72']};
    const [wall,top,frame]=colors[style],g=localGroup(x,y,h,rotation,`${style} house`),bh=style==='gothic'?5:3.6;
    mesh(new THREE.BoxGeometry(w,bh,d),wall,[0,bh/2,0],g,'walls');
    const rf=roof(w+1,d+1,style==='gothic'?4:2.5,top,g);rf.position.y=bh;
    mesh(new THREE.BoxGeometry(.9,2,.08),'#272e29',[0,1,d/2+.05],g,'door');
    for(const side of [-1,1]){mesh(new THREE.BoxGeometry(.75,.85,.1),mat(style==='gothic'?'#9bbb6e':'#e0bd74',{emissive:style==='gothic'?'#456838':'#584126',emissiveIntensity:.3}),[side*w*.3,2,d/2+.08],g,'window');beam([side*w/2,0,d/2],[side*w/2,bh,d/2],.1,frame,g)}
    beam([-w/2,bh,d/2],[w/2,bh,d/2],.11,frame,g);
    if(style!=='elf')mesh(new THREE.BoxGeometry(.8,3,1),wall,[w*.3,bh+1,-d*.25],g,'chimney');
    return g;
  }
  function tower(x,y,h=3,r=2.2,height=9,color='#9a9b90',top='#3d5e7d',style='human'){
    const g=localGroup(x,y,h,0,'tower');mesh(new THREE.CylinderGeometry(r,r*1.08,height,12),color,[0,height/2,0],g,'tower wall');
    mesh(new THREE.CylinderGeometry(r*1.17,r*1.17,.5,12),color,[0,height-.5,0],g,'tower cornice');
    mesh(new THREE.ConeGeometry(r*1.4,style==='gothic'?height*.8:height*.45,12),top,[0,height+(style==='gothic'?height*.4:height*.225),0],g,'tower roof');
    for(let i=0;i<4;i++){const a=i*Math.PI/2;const win=mesh(new THREE.PlaneGeometry(.6,1.4),mat('#e3c888',{side:THREE.DoubleSide,emissive:'#533f25',emissiveIntensity:.3}),[Math.sin(a)*(r+.03),height*.65,Math.cos(a)*(r+.03)],g,'tower window');win.rotation.y=a}
    return g;
  }
  function wall(a,b,h=3,height=4,width=1.4,color='#8b8876',battlements=true){
    const av=new THREE.Vector3(...toWorld(a[0],a[1],h)),bv=new THREE.Vector3(...toWorld(b[0],b[1],h)),d=bv.clone().sub(av),mid=av.clone().lerp(bv,.5);
    const m=mesh(new THREE.BoxGeometry(width,height,d.length()),color,[mid.x,h+height/2,mid.z],group,'city wall');m.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),d.normalize());
    if(battlements){const count=Math.ceil(av.distanceTo(bv)/3),g=new THREE.BoxGeometry(width+.15,.9,1.5),blocks=new THREE.InstancedMesh(g,mat(color),count),o=new THREE.Object3D();blocks.castShadow=true;blocks.receiveShadow=true;blocks.name='wall crenellations';
      for(let i=0;i<count;i++){o.position.lerpVectors(av,bv,i/Math.max(count-1,1));o.position.y=h+height+.4;o.quaternion.copy(m.quaternion);o.updateMatrix();blocks.setMatrixAt(i,o.matrix)}group.add(blocks)}
    return m;
  }
  function bridge(a,b,h=4,width=4,color='#a5a895'){
    wall(a,b,h-.7,.7,width,color,false);
    const av=new THREE.Vector3(...toWorld(...a,h)),bv=new THREE.Vector3(...toWorld(...b,h)),offset=bv.clone().sub(av).cross(new THREE.Vector3(0,1,0)).normalize().multiplyScalar(width/2);
    for(const side of [-1,1]){const c=av.clone().addScaledVector(offset,side),d=bv.clone().addScaledVector(offset,side);beam([c.x,h+.6,c.z],[d.x,h+.6,d.z],.2,color)}
  }
  function tree(x,y,h=3,size=1,tint='#65785c',type='round'){
    const g=localGroup(x,y,h,0,'tree');beam([0,0,0],[.3,5*size,0],.35*size,'#67523d',g);
    if(type==='pine'){for(let j=0;j<3;j++)mesh(new THREE.ConeGeometry((2.4-j*.5)*size,4*size,7),tint,[0,(3+j*1.5)*size,0],g,'pine canopy')}
    else{for(let j=0;j<3;j++){const m=mesh(new THREE.IcosahedronGeometry((2.7-j*.4)*size,1),mat(tint,{flatShading:true}),[(j-1)*1.6*size,(4.5+(j%2))*size,(j%2)*size],g,'leaf canopy');m.scale.y=.65}}
    return g;
  }
  function pavilion(x,y,h=3,r=5,height=5,color='#c5c4a9',top='#78689a'){
    const g=localGroup(x,y,h,0,'columned pavilion');mesh(new THREE.CylinderGeometry(r,r*1.1,.5,12),color,[0,.25,0],g,'pavilion steps');
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;mesh(new THREE.CylinderGeometry(.25,.35,height,8),color,[Math.sin(a)*r*.82,height/2,Math.cos(a)*r*.82],g,'column')}
    mesh(new THREE.ConeGeometry(r*1.22,3.5,8),top,[0,height+1.7,0],g,'pavilion roof');return g;
  }
  function fire(x,y,h=3,color='#efa64a',size=1){
    const g=localGroup(x,y,h,0,'brazier');mesh(new THREE.CylinderGeometry(.5,.3,1.4,8),'#4b4340',[0,.7,0],g,'brazier stand');
    const m=mesh(new THREE.IcosahedronGeometry(.65*size,0),mat(color,{emissive:color,emissiveIntensity:1}),[0,1.8,0],g,'flame');m.scale.set(.7,1.6,.7);
  }
  function ground(color){const g=mesh(new THREE.PlaneGeometry(2000,2000),color,[0,-.8,0],group,'environment ground');g.rotation.x=-Math.PI/2}
  const selection=mesh(new THREE.RingGeometry(2.2,2.45,48),new THREE.MeshBasicMaterial({color:'#f5d18a',side:THREE.DoubleSide,transparent:true,opacity:.9,depthTest:false}),[0,0,0],group,'selected place');selection.rotation.x=-Math.PI/2;selection.renderOrder=10;selection.visible=false;
  return {group,selection,mat,mesh,box,slab,beam,path,circle,ring,localGroup,roof,house,tower,wall,bridge,tree,pavilion,fire,ground};
}
