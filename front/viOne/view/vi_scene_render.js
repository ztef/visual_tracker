import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PerspectiveCamera, OrthographicCamera } from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class GLTFRenderer {
    constructor(containerId, useOrthographicCamera = false) {
        this.container = document.getElementById(containerId);
        this.objects = new Map();
        this.useOrthographicCamera = useOrthographicCamera; // Determine camera type
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupLights();
        this.setupRenderer();
        this.setupControls();
        this.addResizeListener();
        this.addClickListener();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    }

    /*
    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
    
        if (this.useOrthographicCamera) {
            const frustumSize = 200;
            this.camera = new OrthographicCamera(
                frustumSize * aspect / -2,
                frustumSize * aspect / 2,
                frustumSize / 2,
                frustumSize / -2,
                1,
                1000
            );
        } else {
            this.camera = new PerspectiveCamera(60, aspect, 1, 1000);
            this.camera.position.z = 500;
        }
    
        this.camera.near = 0.1; // Set a suitable value for the near clipping plane
        this.camera.far = 1000; // Set a suitable value for the far clipping plane
        this.camera.updateProjectionMatrix();
    }
    */

    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
    
        if (this.useOrthographicCamera) {
            const frustumSize = 200;
            this.camera = new OrthographicCamera(
                frustumSize * aspect / -2,
                frustumSize * aspect / 2,
                frustumSize / 2,
                frustumSize / -2,
                1,
                1000
            );
        } else {
            this.camera = new PerspectiveCamera(60, aspect, 0.1, 1000);
            this.camera.position.set(0.3570062481736582, 2.098977770789573, 0.8855386452745455);
            this.camera.lookAt(0.03575237012985329, -0.8778986564012193, -0.47750991311074553);
        }
    
        this.camera.updateProjectionMatrix();
    }

    setupLights(){

                const dirLight1 = new THREE.DirectionalLight( 0xffffff, 3 );
				dirLight1.position.set( 1, 1, 1 );
				this.scene.add( dirLight1 );

				const dirLight2 = new THREE.DirectionalLight( 0x002288, 3 );
				dirLight2.position.set( - 1, - 1, - 1 );
				this.scene.add( dirLight2 );

				const ambientLight = new THREE.AmbientLight( 0x555555 );
				this.scene.add( ambientLight );
    }


    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }

    
    setupControls() {
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.keys = ['KeyA', 'KeyS', 'KeyD'];
    }



    addResizeListener() {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                this.renderer.setSize(width, height);
                this.camera.aspect = width / height;  // Update this line
                this.camera.updateProjectionMatrix();
                this.controls.handleResize();
            }
        });
    
        resizeObserver.observe(this.container);
    }

    addClickListener() {
        this.container.addEventListener('click', (event) => {
            // Handle object selection based on mouse click
            const clickedObject = this.selectObject(event.clientX, event.clientY);
            if (clickedObject) {
                this.handleObjectSelection(clickedObject);
            }
        });
    }

    selectObject(clientX, clientY) {
        // Implement raycasting to select objects
        const canvas = this.container;
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const mouse = new THREE.Vector2((x / canvas.clientWidth) * 2 - 1, - (y / canvas.clientHeight) * 2 + 1);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children, true);
        return intersects.length > 0 ? intersects[0].object : null;
    }

    handleObjectSelection(object) {
        // Handle the interaction with the selected object
        const customObject = this.objects.get(object);
        if (customObject) {
            console.log('Selected object ID:', customObject.id);
        }
    }

    loadGLTFModel(gltfUrl) {
        const loader = new GLTFLoader();
    
        loader.load(gltfUrl, (gltf) => {
            this.scene.add(gltf.scene);
            // You can access and manipulate the loaded model here
        }, undefined, (error) => {
            console.log(error);
        });
    }


    loadGLTFModelc(gltfUrl) {
        const loader = new GLTFLoader();
    
        // Create a DRACOLoader instance
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/app/build/jsm/loaders/draco/'); // Set the path to the Draco decoder (where DracoDecoder.js is located)
        loader.setDRACOLoader(dracoLoader); // Provide the DRACOLoader instance to the GLTFLoader
    
        // Load the model
        loader.load(gltfUrl, (gltf) => {
            this.scene.add(gltf.scene);
            // You can access and manipulate the loaded model here
        }, undefined, (error) => {
            console.log(error);
        });
    }



    animate() {
        requestAnimationFrame(() => this.animate());

       // console.log('Camera Position:', this.camera.position);
       // console.log('Camera Direction:', this.camera.getWorldDirection(new THREE.Vector3()));
    
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}


