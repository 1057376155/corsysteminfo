<template>
    <div class="browserFN">
        <span @click="smallFN" class="small" alt=""></span>
        <span @click="bigFN" class="big"  alt=""></span>
        <span @click="offFN" class="off"  alt=""></span>
    </div>
</template>

<script>
// :src="require('./img/small.svg')"
// :src="require('./img/big.svg')"
// :src="require('./img/off.svg')"
    const ipcr = require('electron').ipcRenderer;
    var dialog = require('electron').remote.dialog;
    var fs = require('fs');
    export default {
        data(){
            return{

            }
        },
        methods:{
            smallFN(){
                ipcr.send('browserFN', 'small');
            },
            bigFN(){
                if(!this.isMaxSize){
                    ipcr.send('browserFN', 'big');
                    this.isMaxSize=true;
                }else{
                    ipcr.send('browserFN', 'nobig');
                    this.isMaxSize=false;
                }
                

            },
            offFN(){
                ipcr.send('browserFN', 'off');
            },
        }
    }
</script>

<style lang='less'>
@import '../../style/theme.less';
.browserFN{
    -webkit-app-region: no-drag;
    height:30px;
    width:100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: absolute;
    z-index:5;
    right: 0;
    top:0px;
    padding: 0px 10px;
    box-sizing: border-box;
    background:lighten(@tbg,0%);
    -webkit-app-region: drag;
    span{
        -webkit-app-region: no-drag;
        width: 14px;
        height: 14px;
        margin-right:10px; 
        cursor: pointer;
        user-select:none;
        border-radius: 50%;
        background: #000000;
        transition: all ease 0.2s;
        &:hover{
            transform: scale(1.3);
        }
    }
    .small{
        background: rgb(133, 133, 133);
    }
    .big{
        background: rgb(78, 78, 78);
    }
    .off{
        background: rgb(255, 49, 49);
    }
}
</style>