import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import SoundReactor from './SoundReactor'
import MyGUI from '../utils/MyGUI'
import LoadingController from './LoadingControls.js'

class SpherePillards {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader(LoadingController)
        this.textureLoader = new THREE.TextureLoader(LoadingController)
        this.params = {
            waveSpeed: 1,
            subDiv: 3,
            PillardSize: 0.2
        }
    }

    init(scene) {
        this.scene = scene
        this.upVec = new THREE.Vector3(0, 1, 0)
        this.pillards = new THREE.Group()
        this.pillard

        const gTex = this.textureLoader.load('./assets/texture/greyMetal.png')
        const bTex = this.textureLoader.load('./assets/texture/blackMetal.png')

        
        
        this.gMatCap = new THREE.MeshMatcapMaterial({ matcap: gTex})
        this.bMatCap = new THREE.MeshMatcapMaterial({ matcap: bTex})

        this.modelLoader.load('./assets/model/pillard2.glb', (glb) =>{
            glb.scene.traverse(child =>
            {   if (child.name == 'Base')
                this.pillard = child
                child.material = this.bMatCap
                if (child.name == "Cylinder")
                child.material = this.gMatCap
            })    
            
            this.computePositions()
            
            })

        const sphereFolder = MyGUI.addFolder('Sphere Pillards')
        sphereFolder.add(this.params, 'waveSpeed').min(0.001).max(3).step(0.001).name('Wave Speed')
        sphereFolder.add(this.params, 'subDiv').min(1).max(6).step(1).name('Ico Subdivisions').onChange(this.computePositions)
        sphereFolder.add(this.params, 'PillardSize').min(0.01).max(0.5).step(0.001).name('Pill Size').onChange(this.computePositions)
    }


    computePositions() {

        let ico 
        this.scene.traverse(child => {
            if(child.name == "ico"){
                ico = child
            }
        })
        if(ico)
        this.scene.remove(ico)

        const sphereGeometry = new THREE.IcosahedronGeometry(2, this.params.subDiv)
        const sphereMat = this.gMatCap
        const sphere = new THREE.Mesh(sphereGeometry, sphereMat)
        sphere.name = "ico"
        //const sphere = new THREE.Mesh(sphereGeometry, new THREE.MeshNormalMaterial({wireframe:true}))
        this.scene.add(sphere)

        this.pillards.clear()
       
        
        let verArray = []
        for(let i =0; i < sphereGeometry.attributes.position.array.length; i += 3){
            const x = sphereGeometry.attributes.position.array[i]
            const y = sphereGeometry.attributes.position.array[i+1]
            const z = sphereGeometry.attributes.position.array[i+2]
            verArray.push({
               x: x,
               y: y,
               z: z 
            })            
        }

        let pillPos = []
        for(let i = 0; i < verArray.length; i++) {
            let existsFlag = false 
            for(let j = 0; j < pillPos.length; j++){
                if(pillPos[j].x == verArray[i].x && pillPos[j].y == verArray[i].y && pillPos[j].z == verArray[i].z)
                existsFlag = true
            }
                if(!existsFlag){
                    pillPos.push({
                        x: verArray[i].x,
                        y: verArray[i].y,
                        z: verArray[i].z
                    })
                    const c = this.pillard.clone()
                    const posVec = new THREE.Vector3(verArray[i].x, verArray[i].y,verArray[i].z)
                    c.position.copy(posVec)
                    c.children[0].position.y = 1
                    c.scale.multiplyScalar(this.params.PillardSize)
                    c.quaternion.setFromUnitVectors(this.upVec, posVec.normalize())
                    this.pillards.add(c)
                }
        }
        this.scene.add(this.pillards)
        //console.log(pillPos)
        
    }
    
    update() {
        if(SoundReactor.playFlag) {
            let i = 0
            while(i< this.pillards.children.length){
                this.pillards.children[i].children[0].position.y = SoundReactor.fdata[i]/200 * 2
                i++
            }
        }
        else {
            let i = 0
            while(i< this.pillards.children.length){
                this.pillards.children[i].children[0].position.y = (Math.sin(Date.now() * 0.01 * this.params.waveSpeed + this.pillards.children[i].position.x) + 1) * 1.2
                i++
            }
        }
        
       



    }

    bind() {
        this.computePositions = this.computePositions.bind(this)
    }
}

const _instance = new SpherePillards()
export default _instance