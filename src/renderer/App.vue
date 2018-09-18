<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'corsysteminfo'
  }
</script>
<style lang="less">
  /* CSS */
@import "./style/theme.less";
html,body,#app{
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin:0;
//   border-radius: 10px;
}
@font-face {
    /* font-properties */
    font-family:themeFont;
    src:url('./font/SourceHanSansCN-Light.otf')
}
*{
    font-family:themeFont;
}
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin:0; padding:0; }
body, button, input, select, textarea { font:12px/1.5tahoma, arial }
h1, h2, h3, h4, h5, h6{ font-size:100%; }
address, cite, dfn, em, var { font-style:normal; }
code, kbd, pre, samp { font-family:couriernew, courier, monospace; }
small{ font-size:12px; }
ul, ol { list-style:none; }
a { text-decoration:none; }
a:hover { text-decoration:underline; }
sup { vertical-align:text-top; }
sub{ vertical-align:text-bottom; }
legend { color:#000; }
fieldset, img { border:0; }
button, input, select, textarea { font-size:100%; }
table { border-collapse:collapse; border-spacing:0; }

::-webkit-scrollbar {width: 5px;height:6px;}
::-webkit-scrollbar-track-piece{background-color: rgb(100, 100, 100);margin: -2px;}
::-webkit-scrollbar-thumb{background: rgb(59, 59, 59);min-height: 150px;min-width: 150px;border-radius: 10px;}
::-webkit-scrollbar-thumb:vertical:hover{background: #242424}
::-webkit-scrollbar-thumb:horizontal:hover{background: #242424}
.hide{
  display: none;
}
// 动画1
.offsetY-enter-active,.offsetY-leave-active{
    transition: all ease 0.3s;
}
.offsetY-enter,.offsetY-leave-to{
    opacity: 0;
    transform:translateY(-250px) 
}
.offsetY-enter-to,.offsetY-leave{
    transform:translateY(0px);
    opacity: 1
}
.hide{
    display: none;
}
// 动画2
.offsetX-enter-active,.offsetX-leave-active{
    transition: all ease 0.3s;
}
.offsetX-enter,.offsetX-leave-to{
    opacity: 0;
    transform:translateX(-250px) 
}
.offsetX-enter-to,.offsetX-leave{
    transform:translateX(0px);
    opacity: 1
}
// 动画3
.op-enter-active,.op-leave-active{
    transition: all ease .4s .2s;
}
.op-enter,.op-leave-to{
    opacity: 0;
}
.op-enter-to,.op-leave{
    opacity: 1
}

@radius:5px;
@theme:#000;

.btn{
  border: none;
  background: @theme;
  color: white;
  border-radius:@radius;
  outline: none;
  cursor: pointer;
  font-weight: 800;
}
.input{
  border-radius:@radius;
  background: @theme;
  outline: none;
  border:none;
}

</style>
