import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

export class CustomGeometryRenderer {
    constructor(containerId, customGeometry) {
        this.container = document.getElementById(containerId);
        this.customGeometry = customGeometry;
        this.init();
        this.animate();
    }

    init() {
        const aspect = this.container.clientWidth / this.container.clientHeight;

        this.perspectiveCamera = new THREE.PerspectiveCamera(60, aspect, 1, 1000);
        this.perspectiveCamera.position.z = 500;

        this.orthographicCamera = new THREE.OrthographicCamera(
            this.customGeometry.radius * 2 * aspect / -2,
            this.customGeometry.radius * 2 * aspect / 2,
            this.customGeometry.radius,
            this.customGeometry.radius / -2,
            1,
            1000
        );
        this.orthographicCamera.position.z = 500;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        const circle = new THREE.Mesh(this.customGeometry, material);

        this.scene.add(circle);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.controls = new TrackballControls(this.perspectiveCamera, this.renderer.domElement);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.keys = ['KeyA', 'KeyS', 'KeyD'];

        window.addEventListener('resize', () => this.onWindowResize());


        const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          // The 'entry' object contains information about the element's new size
          const { width, height } = entry.contentRect;

          // Handle the size changes here
          console.log(`New width: ${width}px, New height: ${height}px`);
          
          // You can update your rendering or perform other actions here
          // For example, update your WebGL renderer's size if needed
          this.renderer.setSize(width, height);
        }
        });


        resizeObserver.observe(this.container);


    }

    onWindowResize() {
        const aspect = this.container.clientWidth / this.container.clientHeight;

        this.perspectiveCamera.aspect = aspect;
        this.perspectiveCamera.updateProjectionMatrix();

        this.orthographicCamera.left = this.customGeometry.radius * 2 * aspect / -2;
        this.orthographicCamera.right = this.customGeometry.radius * 2 * aspect / 2;
        this.orthographicCamera.top = this.customGeometry.radius;
        this.orthographicCamera.bottom = this.customGeometry.radius / -2;
        this.orthographicCamera.updateProjectionMatrix();

        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.controls.handleResize();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.controls.update();
        this.renderer.render(this.scene, this.perspectiveCamera);
    }


    addGeometry(mesh) {
        
        this.scene.add(mesh);
    }
}