import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildCity, disposeCity } from './city-models.js';
import { toWorld } from './data.js';

export function createViewer(container,onChange,config){
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;
  renderer.domElement.setAttribute('aria-hidden','true');container.prepend(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color('#303b2d');scene.fog=new THREE.Fog('#303b2d',220,650);
  const camera=new THREE.OrthographicCamera(-100,100,80,-80,.1,1500);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.09;controls.minPolarAngle=.08;controls.maxPolarAngle=Math.PI*.43;
  controls.minZoom=.6;controls.maxZoom=4.5;controls.zoomSpeed=.75;controls.rotateSpeed=.6;controls.screenSpacePanning=true;
  scene.add(new THREE.HemisphereLight('#fff2cf','#474c37',2.2));
  const sun=new THREE.DirectionalLight('#fff4dc',2.5);sun.position.set(-70,150,75);sun.castShadow=true;
  Object.assign(sun.shadow.camera,{left:-110,right:110,top:100,bottom:-100,near:1,far:400});sun.shadow.mapSize.set(2048,2048);sun.shadow.normalBias=.15;sun.shadow.bias=-.0003;scene.add(sun);
  const fill=new THREE.DirectionalLight('#9bbfa9',1.2);fill.position.set(80,60,-110);scene.add(fill);
  let city=buildCity(config.id);scene.add(city.group);
  const homeTarget=new THREE.Vector3(...config.target),homeOffset=new THREE.Vector3(...(config.offset||[40,117,138]));
  let currentConfig=config,currentLevel='all',homeZoom=config.zoom||.9;
  function applyTheme(c){scene.background.set(c.background);scene.fog.color.set(c.background)}
  applyTheme(config);
  const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
  let reduced=motionPreference.matches;
  const onMotionChange=event=>{reduced=event.matches;dirty=true};
  motionPreference.addEventListener('change',onMotionChange);
  let mode='perspective',dirty=true,tween=null,active=true,width=1,height=1;
  let motionSeconds=0,lastFrame=performance.now();
  const setCamera=(target,offset,zoom,animate=true)=>{
    controls.update();
    if(animate&&!reduced){tween={start:performance.now(),target:controls.target.clone(),position:camera.position.clone(),zoom:camera.zoom,toTarget:target.clone(),toPosition:target.clone().add(offset),toZoom:zoom};}
    else {tween=null;controls.target.copy(target);camera.position.copy(target).add(offset);camera.zoom=zoom;camera.updateProjectionMatrix();controls.update();}
    dirty=true;
  };
  controls.addEventListener('change',()=>dirty=true);
  controls.addEventListener('start',()=>{tween=null});
  const observer=new ResizeObserver(()=>{
    width=container.clientWidth;height=container.clientHeight;
    const aspect=width/Math.max(height,1),halfHeight=Math.max(56,70/Math.max(aspect,.6));
    camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;camera.top=halfHeight;camera.bottom=-halfHeight;
    camera.updateProjectionMatrix();renderer.setSize(width,height);dirty=true;
  });observer.observe(container);
  setCamera(homeTarget,homeOffset,homeZoom,false);
  renderer.setAnimationLoop(()=>{
    const now=performance.now(),delta=Math.min((now-lastFrame)/1000,.1);lastFrame=now;
    if(!active||document.hidden)return;
    if(!reduced)motionSeconds+=delta;
    const moving=city.update?.(motionSeconds,reduced);
    if(tween){
      const t=Math.min(1,(performance.now()-tween.start)/650),k=1-Math.pow(1-t,3);
      controls.target.lerpVectors(tween.target,tween.toTarget,k);camera.position.lerpVectors(tween.position,tween.toPosition,k);camera.zoom=THREE.MathUtils.lerp(tween.zoom,tween.toZoom,k);camera.updateProjectionMatrix();dirty=true;
      if(t===1)tween=null;
    }
    const changed=controls.update();
    if(dirty||changed||moving){renderer.render(scene,camera);if(dirty||changed)onChange();dirty=false;}
  });
  const project=(x,y,h)=>{const p=new THREE.Vector3(...toWorld(x,y,h)).project(camera);return {x:(p.x*.5+.5)*width,y:(-.5*p.y+.5)*height,visible:p.z>-1&&p.z<1&&Math.abs(p.x)<1.06&&Math.abs(p.y)<1.06}};
  return {
    project,
    setCity(c){
      const next=buildCity(c.id);scene.remove(city.group);disposeCity(city);city=next;scene.add(city.group);
      currentConfig=c;currentLevel='all';motionSeconds=0;homeZoom=c.zoom||.9;homeTarget.set(...c.target);homeOffset.set(...(c.offset||[40,117,138]));applyTheme(c);renderer.renderLists.dispose();
      setCamera(homeTarget,mode==='top'?new THREE.Vector3(0,180,.01):homeOffset,homeZoom,false);dirty=true;
    },
    setLevel(level){
      const next=currentConfig.levels?.includes(level)?level:'all';if(next===currentLevel)return;
      currentLevel=next;city.setLevel?.(next);
      const frame=currentConfig.layerViews?.[next];homeTarget.set(...(frame?.target||currentConfig.target));homeZoom=frame?.zoom||currentConfig.zoom||.9;
      setCamera(homeTarget,mode==='top'?new THREE.Vector3(0,180,.01):homeOffset,homeZoom);dirty=true;
    },
    heading(){return controls.getAzimuthalAngle()*180/Math.PI},
    setMode(value){mode=value;active=value!=='reference';renderer.domElement.hidden=!active;controls.enabled=active;if(active){controls.enableRotate=value!=='top';setCamera(homeTarget,value==='top'?new THREE.Vector3(0,180,.01):homeOffset,homeZoom);dirty=true;}},
    reset(){setCamera(homeTarget,mode==='top'?new THREE.Vector3(0,180,.01):homeOffset,homeZoom)},
    north(){setCamera(controls.target,mode==='top'?new THREE.Vector3(0,180,.01):new THREE.Vector3(0,117,138),camera.zoom)},
    zoom(factor){tween=null;camera.zoom=THREE.MathUtils.clamp(camera.zoom*factor,.6,4.5);camera.updateProjectionMatrix();dirty=true},
    focus(place){
      const elevator=city.elevators?.get(place.id);
      if(elevator&&mode!=='top'){
        const frame=elevator.frame();
        // Leave the lower part of a phone viewport free for the compact detail.
        if(container.clientWidth<=600){frame.target.y-=4;frame.zoom=2.5}
        setCamera(frame.target,frame.offset,frame.zoom);return;
      }
      const target=new THREE.Vector3(...toWorld(place.x,place.y,place.h));const offset=mode==='top'?new THREE.Vector3(0,180,.01):homeOffset;setCamera(target,offset,2);
    },
    select(place){city.selection.visible=Boolean(place)&&!city.elevators?.has(place.id);city.selectElevator?.(place?.id);city.showCave?.(place?.id==='zamah');if(place)city.selection.position.set(...toWorld(place.x,place.y,place.h+.2));dirty=true},
    pan(dx,dz){tween=null;const delta=new THREE.Vector3(dx,0,dz);controls.target.add(delta);camera.position.add(delta);dirty=true},
    refresh(){dirty=true},
    dispose(){observer.disconnect();motionPreference.removeEventListener('change',onMotionChange);controls.dispose();renderer.setAnimationLoop(null);disposeCity(city);renderer.dispose()}
  };
}
