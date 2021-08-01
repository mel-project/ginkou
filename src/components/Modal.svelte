<script type="text/javascript">


    let _class = "";
    export {_class as class};
    const close = () => {}

</script>
    
<template lang="pug">
    div(class!="container {_class}")
        slot(close!="{close}")
</template>

<style lang="scss">
    .container{
        position: absolute;
        z-index: 100;
        background-color: #44444444;
        width: 100vw;
        height: 100vh;
        display: grid;
        align-content: center;
        justify-content: center;
        &>* {
            position: relative;

        }
    }
</style>
    