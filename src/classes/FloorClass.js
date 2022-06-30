import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

import LoadingController from './LoadingControls.js'

class Floor {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader(LoadingController)
        this.textureLoader = new THREE.TextureLoader(LoadingController)
    }

    init(scene) {
        this.scene = scene
        this.floor

        const floorTexture = this.textureLoader.load('./assets/model/FloorBake.png')
        const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture })

        this.modelLoader.load('./assets/model/Floor.glb', (glb)=>{
            glb.scene.traverse(child => {
                if(child instanceof THREE.Mesh)
                this.floor = child
            })
            this.floor.translateY(-4)
            this.floor.scale.multiplyScalar(2)
            this.floor.material = floorMaterial
            
            //console.log(floor)
            this.scene.add(glb.scene)
        })

        
    }

    update() {

    }

    bind() {

    }
}

const _instance = new Floor()
export default _instance