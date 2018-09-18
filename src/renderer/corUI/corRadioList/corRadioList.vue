<template>
    <div class="corRadioList">
        <corRadio class="corRadio" :ref="'setVal'+index" v-for="(item,index) in slectList" :key="index" :active="item.active" :index="index" @getActive="getItem" :val="item" :valKey="valKey"></corRadio>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                slectList:[]
            }
        },
        props:['list','valKey','indexActive'],
        mounted(){
            this.slectList= this.list
            this.clearList({index:this.indexActive});
        },
        methods:{
            getItem(val){
                //获取触发的子项信息

                this.clearList();
                this.$set(this.slectList[val.index],'active',true)
                this.$emit("getItem",val)
            },
            clearList(o){
                //设置所有的选项为false
                for(var i=0;i<this.slectList.length;i++){
                    if(o&&o.index==i){
                        this.slectList[i].active=true
                    }else{
                         this.slectList[i].active=false
                    }
                }
                this.slectList=JSON.parse(JSON.stringify(this.slectList))
            }
        }
    }
</script>

<style lang="less">
.corRadioList{
    .corRadio{
        display: inline-block;
        margin: 10px;
    }
}
</style>