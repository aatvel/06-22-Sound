import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

import MyGUI from '../utils/MyGUI'
import LoadingController from './LoadingControls.js'

import spectumFrag from '../shaders/spectrum.frag'
import spectumVert from '../shaders/spectrum.vert'



class Spectrum {

    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader(LoadingController)
        this.textureLoader = new THREE.TextureLoader(LoadingController)
        this.uniforms = {
            uMatCap:{value: this.textureLoader.load('/assets/texture/metal.png')},
            uSpecterSize: {value: .8},
            uTime:{value:0},
            uWaveBorder: {value: 0.1},
            uBorderColor: {value: new THREE.Color('#d689d4')},
            uWaveSpeed: { value: 0.1}
        }
    }

    
    

    init(scene) {
        this.scene = scene

        const shaders = MyGUI.addFolder('Spectrum')
        shaders.add(this.uniforms.uSpecterSize, "value").min(-1).max(1).name('Spectrum Size')
        shaders.add(this.uniforms.uWaveSpeed, "value").min(0).max(1).name('Wave Speed')
        shaders.add(this.uniforms.uWaveBorder, "value").min(0.015).max(1).step(0.001).name('Wave Border')
        shaders.addColor(this.uniforms.uBorderColor, "value").name('Border Color').onChange();
        


        this.ShaderMat = new THREE.ShaderMaterial({
            fragmentShader: spectumFrag,
            vertexShader: spectumVert,
            transparent:true,
            uniforms:this.uniforms
        })

        this.modelLoader.load('./assets/model/spectrum.glb', (glb)=>{
                                 
            glb.scene.traverse(child => {
                if(child instanceof THREE.Mesh)
                child.material = this.ShaderMat
                child.scale.multiplyScalar(1.8)
                child.position.y = + 0.15
            })
            
             this.scene.add(glb.scene)
        })
    }

    update() {
        this.uniforms.uTime.value += 1
    }

    bind() {

    }
}

const _instance = new Spectrum()
export default _instance