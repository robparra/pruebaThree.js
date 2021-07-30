import * as THREE from "./threejs/three.module.js";
import { OrbitControls } from "./threejs/OrbitControls.js";
import {STLLoader} from './threejs/STLLoader.js';
import { GUI } from './threejs/dat.gui.module.js'

let scene, camera, renderer, object, container

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a003b);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 30;
    camera.position.y = 10;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth , window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // document.body.appendChild(renderer.domElement);

    container = document.getElementById("container");
    container.appendChild(renderer.domElement);

    scene.add(object);
    
    const planeGeometry = new THREE.PlaneGeometry(50, 50)
    const plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial())
    plane.rotateX(-Math.PI / 2)
    plane.position.y = -6
    plane.receiveShadow = true
    scene.add(plane)

    let control = new OrbitControls(camera, renderer.domElement);

    const light = new THREE.AmbientLight()
    scene.add(light)

    var light4 = new THREE.DirectionalLight(0xffffff);
    light4.castShadow = true
    light4.shadow.mapSize.width = 512
    light4.shadow.mapSize.height = 512
    light4.shadow.camera.near = 0.5
    light4.shadow.camera.far = 100
    scene.add(light4);

    const helper4 = new THREE.DirectionalLightHelper(light4)
    scene.add(helper4)

    const helperx = new THREE.CameraHelper(light4.shadow.camera)
    scene.add(helperx)

    // var light2 = new THREE.DirectionalLight(0xffffff);
    // light2.position.set(0, 0, -10);
    // scene.add(light2);

    const light3 = new THREE.HemisphereLight()
    scene.add(light3)

    const helper3 = new THREE.HemisphereLightHelper(light3, 5)
    scene.add(helper3)

    const light5 = new THREE.PointLight()
    scene.add(light5)

    const helper5 = new THREE.PointLightHelper(light5)
    scene.add(helper5)

    const light6 = new THREE.SpotLight()
    scene.add(light6)

    const helper6 = new THREE.SpotLightHelper(light6)
    scene.add(helper6)

    

    const data = {
        color: light.color.getHex(),
        groundColor: light3.groundColor.getHex(),
        switch: false,
        mapsEnabled: true,
        shadowMapSizeWidth: 512,
        shadowMapSizeHeight: 512
    }    

    const gui = new GUI()
    const lightFolder = gui.addFolder('THREE.AmbientLight')
    lightFolder.addColor(data, 'color').onChange(() => {
        light.color.setHex(Number(data.color.toString().replace('#', '0x')))
    })
    lightFolder.add(light, 'intensity', 0, 1, 0.01)
    lightFolder.open()

    // const directionalLightFolder = gui.addFolder('THREE.DirectionalLight')
    // directionalLightFolder.addColor(data, 'color').onChange(() => {
    //     light4.color.setHex(Number(data.color.toString().replace('#', '0x')))
    // })
    // directionalLightFolder.add(light4.position, "x", -100, 100, 0.01)
    // directionalLightFolder.add(light4.position, "y", -100, 100, 0.01)
    // directionalLightFolder.add(light4.position, "z", -100, 100, 0.01)
    // directionalLightFolder.open()
    // -->
    const directionalLightFolder = gui.addFolder('THREE.DirectionalLight')
    directionalLightFolder
        .add(light4.shadow.camera, 'left', -10, -1, 0.1)
        .onChange(() => light4.shadow.camera.updateProjectionMatrix())
    directionalLightFolder
        .add(light4.shadow.camera, 'right', 1, 10, 0.1)
        .onChange(() => light4.shadow.camera.updateProjectionMatrix())
    directionalLightFolder
        .add(light4.shadow.camera, 'top', 1, 10, 0.1)
        .onChange(() => light4.shadow.camera.updateProjectionMatrix())
    directionalLightFolder
        .add(light4.shadow.camera, 'bottom', -10, -1, 0.1)
        .onChange(() => light4.shadow.camera.updateProjectionMatrix())
    directionalLightFolder
        .add(light4.shadow.camera, 'near', 0.1, 100)
        .onChange(() => light4.shadow.camera.updateProjectionMatrix())
    directionalLightFolder
        .add(light4.shadow.camera, 'far', 0.1, 100)
        .onChange(() => light4.shadow.camera.updateProjectionMatrix())
    directionalLightFolder
        .add(data, 'shadowMapSizeWidth', [256, 512, 1024, 2048, 4096])
        .onChange(() => updateShadowMapSize())
    directionalLightFolder
        .add(data, 'shadowMapSizeHeight', [256, 512, 1024, 2048, 4096])
        .onChange(() => updateShadowMapSize())
    directionalLightFolder.add(light4.position, 'x', -50, 50, 0.01)
    directionalLightFolder.add(light4.position, 'y', -50, 50, 0.01)
    directionalLightFolder.add(light4.position, 'z', -50, 50, 0.01)
    directionalLightFolder.open()

    const hemisphereLightFolder = gui.addFolder('THREE.HemisphereLight')
    hemisphereLightFolder.addColor(data, 'groundColor').onChange(() => {
         light3.groundColor.setHex(Number(data.groundColor.toString().replace('#', '0x'))) });

    hemisphereLightFolder.add(light3.position, "x", -100, 100, 0.01)
    hemisphereLightFolder.add(light3.position, "y", -100, 100, 0.01)
    hemisphereLightFolder.add(light3.position, "z", -100, 100, 0.01)
    hemisphereLightFolder.open()

    const pointLightFolder = gui.addFolder('THREE.PointLight')
    pointLightFolder.add(light5, 'distance', 0, 100, 0.01)
    pointLightFolder.add(light5, 'decay', 0, 4, 0.1)
    pointLightFolder.add(light5.position, 'x', -50, 50, 0.01)
    pointLightFolder.add(light5.position, 'y', -50, 50, 0.01)
    pointLightFolder.add(light5.position, 'z', -50, 50, 0.01)
    pointLightFolder.open()

    const spotLightFolder = gui.addFolder('THREE.SpotLight')
    spotLightFolder.add(light6, 'distance', 0, 100, 0.01)
    spotLightFolder.add(light6, 'decay', 0, 4, 0.1)
    spotLightFolder.add(light6.position, 'x', -50, 50, 0.01)
    spotLightFolder.add(light6.position, 'y', -50, 50, 0.01)
    spotLightFolder.add(light6.position, 'z', -50, 50, 0.01)
    spotLightFolder.open()


   

    animate();
}

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}


let loader = new STLLoader();
    loader.load('/3Dmodels/Baby_Yoda_v2.2.stl', (model)=>{
        object = new THREE.Mesh(model, new THREE.MeshLambertMaterial({color: 0x00ff00}));
        object.receiveShadow = true;
        object.scale.set(0.1, 0.1, 0.1);
        object.position.set(0, -5, 0);
        object.rotation.x = -Math.PI/2;
        init();
    });