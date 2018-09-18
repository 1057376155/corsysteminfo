<template>
    <div>
        <div class="corRadio_itemC" @click="selectFN">
            <span :class="['corRadio_item',active?'active':'']"></span>
            <span>{{valKey&&val[valKey]?val[valKey]:val&&val.val}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                value:'',
            }
        },
        props:{
            val:{
                type:null,
                default:[]
            },
            valKey:{
                type:null,
                default:false
            },
            active:{
                type:null,
                default:false
            },
            index:{
                type:null,
                default:null
            }
        },
        mounted(){
        },
        methods:{
            selectFN(){
                //选择状态
                this.val.index=this.index
                this.$emit("getActive",this.val)
            },
            setActive(val){
                //设置是否选中
                this.active=val
            }
        }
    }
</script>

<style lang="less">
@import '../style/theme.less';
.corRadio_itemC{
 cursor: pointer;
}
.corRadio_item{
    display: inline-block;
    width: 15px;
    height: 15px;
    border: #cccccc solid 1px;
    box-sizing: border-box;
    border-radius: 50%;
    transition: all ease 0.3s;
    vertical-align: middle;
    margin-right:2px;
    &.active{
        border:@theme solid 5px;
    }
}
</style>