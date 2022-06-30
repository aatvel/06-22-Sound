import * as THREE from "three"

import RAF from '../utils/RAF'
import config from '../utils/config'
import MyGUI from '../utils/MyGUI'

import SpherePillards  from './SpherePillards.js'
import Floor from './FloorClass.js'
import Spectrum from './SpectrumClass.js'
import Particles from './Particles.js'
import CamParallax from './CamParallax.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


class MainThreeScene {
    constructor() {
        this.bind()
        this.camera
        this.scene
        this.renderer
        this.controls
    }

    init(container) {
        //RENDERER SETUP
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.debug.checkShaderErrors = true
        container.appendChild(this.renderer.domElement)

        //MAIN SCENE INSTANCE
        const color = new THREE.Color(0x151515)
        const fog = new THREE.Fog(color, 12, 30)

        this.scene = new THREE.Scene()
        this.scene.background = color
        this.scene.fog = fog

        //CAMERA AND ORBIT CONTROLLER
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 0, 10)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enabled = false
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        this.controls.maxDistance = 20
        this.controls.minDistance = 3.5
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.1;

        


        SpherePillards.init(this.scene)
        Floor.init(this.scene)
        Spectrum.init(this.scene)
        Particles.init(this.scene)
        CamParallax.init(this.camera)
        


        MyGUI.hide()
        if (config.myGui)
            MyGUI.show()

            const camera = MyGUI.addFolder("Camera")
            camera.add(this.controls, 'enabled').name('Camera').onChange(() => {
                if(this.controls.enabled){
                    CamParallax.active = false
                }
            }).listen()
            camera.add(CamParallax, 'active').name('Parallax').onChange(() => {
                if(CamParallax.active){
                    this.controls.enabled = false
                }
            }).listen()
            camera.add(CamParallax.params, "intensity").min(0.001).max(0.01)
            camera.add(CamParallax.params, "ease").min(0.001).max(0.01)

        //RENDER LOOP AND WINDOW SIZE UPDATER SETUP
        window.addEventListener("resize", this.resizeCanvas)
        RAF.subscribe('threeSceneUpdate', this.update)
    }

    update() {
        this.renderer.render(this.scene, this.camera);
        this.scene.rotateY(0.005)
        SpherePillards.update();
        Spectrum.update()
        Particles.update()
        CamParallax.update()
        
    }

    resizeCanvas() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
    }
}

const _instance = new MainThreeScene()
export default _instance