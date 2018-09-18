<template>
    <div id="about">
        <h1 class="corsvgbrowser title">关于 corsysteminfo</h1>
        <p class="describe">
            corsysteminfo是一个实时监测系统的软件，使用该软件可能需要占用10%的cpu和200~300m的内存。
        </p>
        <h1 class="aboutCor title">关于作者</h1>
        <p class="describe pointer" @click="openweb('https://github.com/1057376155')">
            cor是一个前端开发工程师
            <br/>
            github地址 : https://github.com/1057376155
        </p>
        <h1 class="title">技术构成</h1>
        <p class="describe">该软件使用 electron + vue + systeminformation + echarts + vbscript 构成</p>
        <h1 class="title">版本</h1>
        <p class="describe">当前版本 {{version}}</p>
        <p class="describe pointer" @click="openweb('https://github.com/1057376155/corsvgbrowser')">最新版本 {{serverVserion}} &nbsp; 点击获取最新版本</p>
        <button @click="closeFN" class="btn close">关闭</button>
    </div>
</template>

<script>
    import pjson from '../../../../package.json'
    var shell=require('electron').remote.shell
    var https = require('https');   
    export default {
        data(){
            return{
                version:pjson.version,
                serverVserion:''
            }
        },
        mounted() {
            this.getServerVersion();
        },
        methods:{
            closeFN(){
                this.$emit('colose')
            },
            getServerVersion(){
                https.get('https://raw.githubusercontent.com/1057376155/corsvgbrowser/master/package.json',(res)=>{
                    var resData = "";
                    res.on("data",function(data){
                        resData += data;
                    });
                    res.on("end",()=>{
                        this.serverVserion=JSON.parse(resData).version
                        console.log(this.serverVserion,'-=-=')
                    });
                })
            },
            openweb(url){
                shell.openExternal(url)
            }
        }
    }
</script>

<style lang='less'>
@import '../../style/theme.less';
#about{
    width: 100%;
    height: 100%;
    position: absolute;
    top:0px;
    left: 0px;
    background: @tbg;
    padding: 40px;
    box-sizing: border-box;
    .title{
        color:lighten(@tbg,80%);
        // text-align: center;
        font-size: 20px;
        margin:10px 0px;
        font-weight: 100;
        -webkit-app-region: no-drag;
    }
    .describe{
        color:lighten(@tbg,55%);
        -webkit-app-region: no-drag;
    }
    .close{
        font-size: 14px;
        color: red;
        margin: 10px 0px;
        padding:5px 0px;
        border-radius: 50px;
        position: absolute;
        right:20px;
        bottom: 0px;
        -webkit-app-region: no-drag;
        background: none;
    }
    .pointer{
        cursor: pointer;
    }
}
</style>