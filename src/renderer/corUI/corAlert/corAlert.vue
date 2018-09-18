<template>
    <div class="corAlert">
        <div class="corAlert_item">
            <p>{{str}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                str:'',
                isTimeOut:true,//是否定时消失,默认定时消失
                time:2000,//超时时间
            }
        },
        mounted(){
            this.init()
        },
        methods:{
            init(){
                if(this.isTimeOut){
                    setTimeout(()=>{
                        this.$hideCorArt();
                    },this.time)
                }
            }
        }
    }
</script>

<style lang="less">
.corAlert{
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 5;
    .corAlert_item{
        position: fixed;
        width: 80px;
        height: 80px;
        background: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        padding: 10px;
        border-radius: 5px;
        color: white;
        font-size: 14px;
        text-align: center;
    }

}
</style>