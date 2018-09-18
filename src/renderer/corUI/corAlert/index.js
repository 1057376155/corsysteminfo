import Vue from 'vue';
import corAlert from './corAlert'

const merge = ($data, option) => {
    for ( let prop in option) {
        if ($data.hasOwnProperty(prop)) {
            $data[prop] = option[[prop]]
        }
    }
};

let corAlertConstructor=Vue.extend(corAlert)
let initComponent;
export const hideCorArt = () => {
    var alertArr=document.querySelectorAll('.corAlert');
    for(var i=0;i<alertArr.length;i++){
        alertArr[i].parentNode.removeChild(alertArr[i])
    }
    return;
}
export const corArt = (option={}) => {
    initComponent = new corAlertConstructor();
    var r=initComponent.$mount();
    merge(initComponent.$data, option)
    hideCorArt();//添加之前先清除
    document.querySelector(option.container || 'body').appendChild(initComponent.$el);

}
