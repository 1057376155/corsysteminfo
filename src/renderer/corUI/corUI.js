import { corArt, hideCorArt } from './corAlert/index.js' //alert组件
import corRadio from './corRadio/corRadio.vue'//corRadio 组件
import corRadioList from './corRadioList/corRadioList.vue'//corRadioList 组件
import corBtn from './corBtn/corBtn';//按钮主键
import publicFN from './corUIFN';// 全局方法
const install = function(Vue) { //通过install方法挂载到Vue原型上去
    for(var fnitem in publicFN){
        Vue.prototype['$'+fnitem]=publicFN[fnitem]
    }
    Vue.prototype.$corArt = corArt;
    Vue.prototype.$hideCorArt = hideCorArt;
    Vue.component('corRadio',corRadio)
    Vue.component('corRadioList',corRadioList)
    Vue.component('corBtn',corBtn)
}
export default install