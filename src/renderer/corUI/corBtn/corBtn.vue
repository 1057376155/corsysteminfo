<template>
    <div class="corBtn" @click="isClick" @mouseover="hover" @mouseout="init">
        <span class="corBtn_item" :style="style">{{text}}</span>
    </div>
</template>

<script>

    export default {
        data(){
            return{
                style:{
                    // background:'black',
                }
            }
        },
        props:['color','hcolor','text'],
        mounted(){
            this.init();
        },
        methods:{
            init(){
                if(this.color){
                     var style={
                        background:"white",
                        'border-color':this.color,
                        color:this.color,
                    }
                   this.style=style;
                }
            },
            hover(){
                //鼠标移上去
                var style={
                    background:this.hcolor,
                    'border-color':this.hcolor,
                    color:"white",
                }
                this.style=style;
            },
            isClick(){
                //点击事件
            }
        }
    }
</script>

<style lang="less">
.corBtn{
    display:inline-block;
    cursor: pointer;
   
    .corBtn_item{
        transition: all ease .5s;
        border-radius: 30px;
        border-width:2px;
        border-style: solid;
        padding: 2px 5px;
    }
}

</style>