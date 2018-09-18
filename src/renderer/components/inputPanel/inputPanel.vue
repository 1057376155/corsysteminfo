<template>
    <div class="inputPanel">
        <div class="inputPanel_content">
            <input class="input" v-model="text" type="text" placeholder="请输入备注名称">
            <button class="btn" @click="affirm">确认</button>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                text:""
            }
        },
        methods:{
            affirm(){
                this.$emit('affirm',{text:this.text})
            }
        }
    }
</script>

<style lang="less">
.inputPanel{
    width:100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    .inputPanel_content{
        width: 300px;
        display: flex;
        flex-flow: column;
        text-align:center;
        background: rgb(73, 73, 73);
        padding:20px;
        border-radius: 5px;
        input,button{
            display: block;
            height: 40px;
            text-align: center;
            margin:5px 0px;
            color:white;
        }
    }
}
</style>