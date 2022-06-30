<template>
    <ThreeScene />
    <LoadingScreen />    
    <AudioButton />
    
       
</template>

<script>
import AudioButton from "./components/AudioButton.vue";
import ThreeScene from "./components/ThreeScene.vue";
import LoadingScreen from "./components/LoadingScreen.vue";

export default {
    name: "App",
    components: {
        ThreeScene,
        AudioButton,
        LoadingScreen,
        
    },
};
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500&family=Staatliches&display=swap');

body {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
}
</style>
