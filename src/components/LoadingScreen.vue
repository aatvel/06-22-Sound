<template>
    <div class="loadingScreen" ref="loadingScreen">
        <div class="wrapper">
            <h2>Loading</h2>
            <div class="progressBar">
                <div class="progressFill"
                :style="{width: progress + '%' }"></div>
            </div>
        </div>
    </div>
</template>

<script>

import LoadingController from '../classes/LoadingControls.js'
export default {
    name: "LoadingScreen",
   data(){
    return {
        progress: 0,
        
    };
   },
    mounted() {
        LoadingController.onProgress = this.onProgress;
        LoadingController.onLoad = this.onLoad;
    },
    methods: {
        onProgress(url, loaded, total){
        
           this.progress = (loaded / total) * 100; 
        }, 
        onLoad(){
        this.$refs.loadingScreen.classList.add('finished')
    },
    
    }
};

</script>

//<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.loadingScreen {
    width: 100vw;
    height: 100vh;
    background: #151515;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    color: white;
    font-size: 2em;
    transition: all 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;

    .wrapper{

        display: flex;
        flex-direction: column;
        align-items: center;

        h2 {
            margin-bottom:20px;
        }

        .progressBar {
            width: 300px;
            height: 5px;
            background: black;

            .progressFill {
            width: 50%;
            height: 100%
            background: #d689d4;
            transition: width 0.2s;
            }
        }

                
    }
    &.finished{
            opacity: 0;
            z-index : 0;
            position: relative;
            poimter-events: none;
        }
}
</style>
