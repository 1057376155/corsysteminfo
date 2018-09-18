<template>
    <div id="index">
        <bFN></bFN>
        <div class="content">
            <div class="userInfo">
              <div class="time">
                  <p class="clock">
                    {{new Date(timeinfo.current).toLocaleDateString()}}
                    {{new Date(timeinfo.current).toLocaleTimeString()}}
                  </p>
                  <p class="runTime">正常运行时间 
                    <span>{{parseTime(timeinfo.uptime).days}} 天</span> 
                    <span>{{parseTime(timeinfo.uptime).hours}} 小时</span> 
                    <span>{{parseTime(timeinfo.uptime).minutes}} 分钟</span> 
                    <span>{{parseTime(timeinfo.uptime).seconds}} 秒</span> 
                  </p>
                  <div class="refresh" @click="refresh">刷新初始化信息</div>
              </div>
              <div class="pcinfo">
                <p>电脑型号 {{pcinfo.model}}</p>
                <p>生产厂家 {{pcinfo.manufacturer}}</p>
                <!-- <p>UUID {{pcinfo.uuid}}</p>s -->
                <p>序列号 {{pcinfo.serial}}</p>
              </div>
              <div class="networkInterfaces">
                <div class="networkInterfaces_item" v-for="(item,index) in networkInterfaces" :key="index">
                    <p>网卡名称 {{item.iface}}</p> 
                    <p class="copy" @click="copy(item.ip4)">ip {{item.ip4}}</p>
                    <p class="copy" @click="copy(item.mac)">mac {{item.mac}}</p>
                </div>
              </div>
              
            </div>
            <div class="batteryAndNet">   
                <p>        
                    <span>上传 {{uploadNet}} kb/s</span>
                    <span>下载 {{dowmloadNet}} kb/s</span>
                    <span>累计下载流量 {{(dowmflowGrand/1024).toFixed(2)}} mb</span>
                    <span>累计上传流量 {{(uploadflowGrand/1024).toFixed(2)}} mb</span>
                    <span>电池剩余 {{batteryInfo.percent}} %</span> 
                </p>
            </div>
            <div class="realDisk">   
                <div class="realDisk_item" v-for="(item,index) in realDisk" :key="index">
                  <p class="diskName">{{item.name.replace(":",'')}} 盘 </p> 
                  <div class="diskRW">
                      <p class="diskReadSpeed">读速度 {{parseFloat(item.DiskReadBytesPerSec).toFixed(2)+'mb'}} </p>
                      <p class="diskReadWrite">写速度 {{parseFloat(item.DiskWriteBytesPerSec).toFixed(2)+'mb'}}</p>
                  </div>
                </div>
            </div>
            <div class="cpuinfo">
                <div id="cpuinfouse" ></div>
                <span class="useRatio" v-if="!isResize">{{useRatio}}</span>
                <div id="cpuinfopanel"></div>
                <div class="cpuinfo_contant">
                    <p>{{cpuinfo.brand}}</p>
                    <p>{{cpuinfo.speed}} GHZ</p>
                    <p>已使用 {{useRatio}}</p>
                    <p>核数量 {{cpuinfo.cores}}</p>
                </div>
            </div>
            <div class="meminfo">
                <div id="meninfopanel"></div>
                <div class="memdata">
                  <p v-for="(item,index) in memdata" :key="index"> 
                    <span :style="'font-size:'+(12+(12*memdata[1].name.replace('%','')/50))+'px'" class="memdata_name">{{item.name}}</span>
                    <span :style="'font-size:'+(12+(12*memdata[1].name.replace('%','')/50))+'px'" class="memdata_value">{{item.value}} </span>
                  </p>
                </div>
                <div class="meminfo_contant">
                    <div class="meminfo_contant_item" v-for="(item,index) in menInfo" :key="index">
                        <p>品牌 {{item.manufacturer}}</p>
                        <p>零件号 {{item.partNum}}</p>
                        <p>频率 {{item.clockSpeed}}</p>
                        <p>大小 {{item.size}}</p>
                    </div>
                </div>
            </div>
            <div class="diskInfo">
                <!-- <canvas id="diskInfopanel"></canvas> -->
                <div class="diskdata">
                  <div class="diskdata_item" v-if="!isNaN(item.use)" v-for="(item,index) in diskdata" :key="index">
                    <span class="diskdata_item_title">
                      <span>{{item.mount}} </span>
                      <span>总量{{(item.size/1024/1024/1024).toFixed(2)+'GB'}} </span>
                      <span>可使用{{((item.size-item.used)/1024/1024/1024).toFixed(2)+"GB"}}</span>
                      <span>使用率 {{item.use.toFixed(2)+"%"}}</span>
                      </span>
                    <div class="diskdata_item_data">
                      <div class="diskdata_item_data_use" :style="'width:'+item.use.toFixed(2)+'%'"></div>
                    </div>
                  </div>
                </div>

                <div class="diskInfo_contant">
                  <div class="diskInfo_contant_item" v-for="(item,index) in diskInfo" :key="index">
                      <p>磁盘名称 {{item.name}}</p>
                      <p>磁盘大小 {{(item.size/1024/1024/1024).toFixed(2)+'GB'}}</p>
                      <p>序列号 {{item.serialNum}}</p>
                  </div>
                </div>
            </div>
            <transition name="offsetY">
              <aboutpanel v-if="isShowAbout" @colose='isShowAbout=!isShowAbout'></aboutpanel>
            </transition>
              <div  class="about" @click="isShowAbout=!isShowAbout" >关于corsysteminfo</div>
        </div>
    </div>
</template>

<script>
const dialog = require("electron").remote.dialog;
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
const uuidv1 = require("uuid/v1");
const shell = require("electron").remote.shell;
const fs = require("fs");
const path = require("path");
const si = require("systeminformation");
import bFN from "../components/bFN/bFN";
import aboutpanel from '../components/about/about'
import { setTimeout, clearTimeout } from 'timers';
const echarts = require("echarts");
const vbs=require('../lib/vbs.js').vbs
const clipboard = require('electron').clipboard;
export default {
  data() {
    return {
      ww: 0,
      wh: 0,
      
      pcinfo:'',//电脑信息
      networkInterfaces:'',//网卡信息
      timeinfo:'',//时间信息
      useRatio: "0%",//cpu 使用率
      mem: {}, //内存信息
      memdata:[],//实时内存信息
      batteryInfo: {}, //电池信息
      cpudata: [],//cpu 数组信息
      cpudatalen:150,//cpu 数组长度
      cupindex:0,//cpu数组信息索引
      cpuinfo: {}, //cpu信息
      cpuChart: "", //cpucanvas
      cpuUseChart:'',//

      realDisk:[],//实时磁盘信息

      memChart: "", //内存canvas
      menInfo: [], //内存信息
      uploadNet: 0, //上传
      dowmloadNet: 0, //下载
      dowmflowGrand: 0, //累计下载流量
      uploadflowGrand: 0, //累计下载流量
      
      diskChart:'',//磁盘canvas
      diskInfo:[],//磁盘信息
      diskdata:[],//分区信息
      
      isResize:false,//窗口是否发生变化 

      theme:{
       mainbg:'#d85100',//主要颜色
       blackbg:'#484848',//黑色背景色
      },

      isShowAbout:false,//是否显示关于
    };
  },
  components: {
    bFN,aboutpanel
  },
  mounted() {
    this.init();
    this.timingInit();
    this.slowInterval();
    
    setInterval(async () => {
      this.timingInit();
    },1000);
    setInterval(()=>{
        this.slowInterval();
    },3000)
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;
    window.addEventListener("resize", () => {
        this.ww = window.innerWidth;
        this.wh = window.innerHeight;
        this.isResize=true;
        this.cpuChart.resize();
        this.cpuUseChart.resize();
        this.timingInit();
        this.slowInterval();
      setTimeout(() => {
         this.isResize=false;
      },500);
    });
  },
  updated() {},
  methods: {
    copy(text){
      clipboard.writeText(text);
    },
    refresh(){
      this.systeminit();//初始化系统信息
      this.networkInterfacesInit();//操作系统用户初始化
    },
    init(){
      //初始化基本信息
      this.cpuinit();//初始化cpu信息
      this.meninfo();//初始化内存信息
      this.diskinit();//初始化磁盘信息
      this.cpuUseInit();//初始化cpu使用率
      this.systeminit();//初始化系统信息
      this.networkInterfacesInit();//操作系统用户初始化
    },
    timingInit() {
      //初始化
        this.getTime();//获取时间信息
        this.getCpuInfo();//实时获取cpu信息
        this.getMem();//实时获取内存信息
        this.getNetworkInterfaces();//实时获取网速信息
    },
    slowInterval(){
      //比较慢的更新率
      this.getBattery();//实时获取电池信息
      this.disk();//实时获取磁盘信息
    },
    async getTime(){
      //获取时间
      this.timeinfo=await si.time()
    },
    parseTime(time) {
      //解析天时分秒
      return {
        days:parseInt(time / (60 * 60 * 24)),
        hours:parseInt((time % (60 * 60 * 24)) / (60 * 60)),
        minutes:parseInt((time % ( 60 * 60)) / 60),
        seconds:parseInt(time % 60)
      }
    },
    async systeminit(){
      //系统信息初始化
      this.pcinfo=await si.system();
    },
    async networkInterfacesInit(){
      //操作系统用户初始化
      this.networkInterfaces=await si.networkInterfaces();
    },
    cpuinit() {
      //cpu初始化
      var startTime=new Date().getTime()
      for(var i=0;i<this.cpudatalen;i++){
        this.cpudata.push({name:startTime+i*1000,value: [startTime+i*1000,10]})
      }
      // this.cpudata=[{name:startTime,value: [startTime,0]}]
      var cpuinfopanel = document.getElementById("cpuinfopanel");
      cpuinfopanel.width=600
      var cpuChart = echarts.init(cpuinfopanel);
      var option = {
          title: {show:false},
          grid:{top:0,bottom:0,left:0,right:0},
          xAxis: {
              show:false,
              type: 'time',
              inverse:true,
          },
          yAxis: {
              show:false,
              type: 'value',
              min:0,
              max:100,
              boundaryGap: [0, '100%'],
              splitLine: {
                  show: false
              }
          },
          series: [{
              type: 'bar',
              color:[this.theme.mainbg],
              barWidth:2,
              data:this.cpudata
          }]
      };
      if (option && typeof option === "object") {
          cpuChart.setOption(option, true);
      }
      this.cpuChart=cpuChart
      si.cpu().then(data => {
        this.cpuinfo = data;
      });
    },
    cpuUseInit(){
      //cpu使用率初始化
      var dom = document.getElementById("cpuinfouse");
      var cpuUseChart = echarts.init(dom);
      var option = {
          legend: {
              show:false,
          },
          series: [
              {
              name:'访问来源',
              type:'pie',
              radius: ['65%','75%'],
              color:[this.theme.mainbg,this.theme.blackbg],
              avoidLabelOverlap: true,
              label: {
                  normal: {
                      show: true,
                      position: 'center'
                  },
                  emphasis:{
                      show:true,
                      textStyle: {
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  }
              },
              labelLine: {
                  normal: {
                      show: false
                  }
              },
              data:[
                  {value:3135},
                  {value:1548},
              ]
          }
        ]
      };
      if (option && typeof option === "object") {
          cpuUseChart.setOption(option, true);
      }
      this.cpuUseChart=cpuUseChart
    },
    getCpuInfo() {
      //cpu信息
      si.currentLoad().then(data => {
        this.useRatio = data.currentload.toFixed(2) + "%";

        this.cpuUseChart.setOption({
           series: [{data:[{value:data.currentload,},{value:100-data.currentload}]}]
        })
 
        this.cupindex=this.cupindex+1
        if(this.cpudata.length>=this.cpudatalen){
          this.cpudata.shift()
        }
        var startTime=parseInt(this.cpudata[this.cpudata.length-1].name);
        this.cpudata.push({name:startTime+1000,value: [startTime+1000,data.currentload]})

        this.cpuChart.setOption({
          series: [{data:this.cpudata}]
        });
        data=null
      });
    },
    meninfo() {
      //初始化内存信息
      var dom = document.getElementById("meninfopanel");
      var memChart = echarts.init(dom);
      var option = {
          title: {
              show:false
          },
          tooltip : {
            show:false,
          },
          series : [
              {
                  name:'内存',
                  type:'pie',
                  radius : '60%',
                  hoverAnimation:false,
                  color:[this.theme.mainbg,this.theme.blackbg],
                  center: ['50%', '50%'],
                  label: {
                      show:false
                  },
                  labelLine:{
                      show:false
                  },
                  data:[{value:320},{value:300}],
                  roseType: 'radius',
              }
          ]
      };
      if (option && typeof option === "object") {
          memChart.setOption(option, true);
      }

      this.memChart = memChart;
      si.memLayout().then(data => {
        this.menInfo = data;
      });
    },
    getMem() {
      //更新内存信息
      si.mem().then(data => {
        this.memdata=[
          {name:"总量 " + (data.total / (1024 * 1024 * 1024)).toFixed(2) + "GB",use: data.total},
          {name: parseInt(data.used / data.total * 100) + "%",value: (data.used/(1024 * 1024 * 1024)).toFixed(2) + "GB 已使用"},
          // {name: parseInt(data.free / data.total * 100) + "%",value: (data.free/(1024 * 1024 * 1024)).toFixed(2) + "GB 未使用"},
        ];
        this.memChart.setOption({
          series:[{data:[{value:data.used},{value:data.free}]}]
        })
        // this.memChart.changeData(mem);
      });
    },
    getBattery() {
      //电池信息
      si.battery(data => {
        this.batteryInfo = data;
      });
    },
    getNetworkInterfaces() {
      //实时获取网络信息
      var data = "";
      si.networkStats().then(r => {
        this.uploadNet = Math.abs(r.tx_sec / 1024).toFixed(2);
        this.dowmloadNet = Math.abs(r.rx_sec / 1024).toFixed(2);
        this.dowmflowGrand += parseInt(Math.abs(r.rx_sec / 1024));
        this.uploadflowGrand += parseInt(Math.abs(r.tx_sec / 1024));
        this.netAll = r.rx;
      });
    },
    diskinit() {
      //初始化磁盘
      si.diskLayout().then(data => {
          //获取磁盘硬件信息信息 
          this.diskInfo=data
      });
    },
    disk() {
      //磁盘信息
      si.fsSize().then((data)=>{
          //获取盘符信息 C B F D 等
          this.diskdata=data;
      })
      vbs.getdiskio().then((data)=>{
        this.realDisk=data
      })
      // si.disksIO().then((data)=>{
      //   console.log(data)
      // })
      // si.disksIO().then((data)=>{
      //   console.log(data)
      // })
    },
    clipboard(){

    }
  }
};
</script>

<style lang="less">
@import "../style/theme.less";
@ftcolor:#8b8b8b;
#index {
  width: 100%;
  height: 100%;
  background: @tbg;
  .content {
    width: 100%;
    height: 100%;
    padding: 28px 10px;
    box-sizing: border-box;
    color: #ffffff;
    display: fixed;
    overflow: auto;
    .userInfo{
      // background: @bg;
      // height:100px;
      -webkit-app-region: drag;
      padding:10px 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      .time{
        flex-basis:300px;
        .clock{
          text-align:center;
          font-size: 24px;
          font-weight: 100;
          color:rgb(226, 226, 226);
        }
      }
      .runTime{
        text-align:center;
        color:#9c9c9c;
        font-size: 14px;
      }
      .pcinfo{
        flex-basis:250px;
        font-size: 12px;
        color: @ftcolor;
      }
      .networkInterfaces{
        flex:1;
        font-size:12px;
        color: @ftcolor;
        display: flex;
        justify-content: flex-start;
        .networkInterfaces_item{
          // background: @bg;
          font-size: 12px;
          padding: 10px;
          margin:0px 10px;
          border-radius: 5px;
        }
      }
    }
    .cpuinfo {
      flex: 1;
      position: relative;
      background: @bg;
      // padding: 20px;
      margin: 10px 0px;
      box-sizing: border-box;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      height: 100px;
      #cpuinfopanel{
        width: 70%;
      }
      #cpuinfouse{
        // width: 200px;
        // height: 200px;
        position: relative;
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        // height: 100px;
      }
      .useRatio{
          position: absolute;
          width: 20%;
          font-size: 12px;
          height: 100%;
          left: 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          color:@ftcolor;
        }
      .cpuinfo_contant {
        position: absolute;
        text-align: right;
        top: 10px;
        right: 20px;
        bottom: 0px;
        margin: auto;
        font-size: 14px;
        color: @ftcolor;
        p {
          font-size: 12px;
        }
      }
    }
    .meminfo {
      background: @bg;
      position: relative;
      display: flex;
      align-items: center;
      .memdata{
        flex-basis:500px;
        font-size: 14px;
        color: @ftcolor;
        padding: 0px 20px;
        box-sizing: border-box;
        font-weight: 100;
        .memdata_name{
          margin-right: 10px;
        }
        .memdata_value{
          color: #c9c9c9;
        }
      }
      #meninfopanel {
        flex-basis:300px;
        height: 200px;
      }
      .meminfo_contant {
        position: absolute;
        right: 0px;
        font-size: 12px;
        color: @ftcolor;
        height: 100%;
        overflow: auto;
        .meminfo_contant_item {
          background: @tbg;
          padding: 10px 20px;
          margin: 5px 5px;
          border-radius: 5px;
        }
      }
    }
    .batteryAndNet,.realDisk{
      background: @bg;
      position: relative;
      display: flex;
      align-items: center;
      margin: 10px 0px;
      padding: 10px;
      box-sizing: border-box;
      font-size: 14px;
      color: #cfcfcf;
      span {
        margin: 0px 10px;
        font-weight: 800;
      }
    }
    .realDisk{
      display: flex;
      flex-wrap: wrap;
    }
    .realDisk_item{
      width: 25%;
      flex: 1;
      background: @tbg;
      color: lighten(@bg,40%);
      margin: 5px;
      padding: 10px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      .diskName{
        font-size: 14px;
        flex: 1;
        text-align: center;
      }
      .diskRW{
        flex: 3;
        text-align: left;
      }
    }
    .diskInfo{
        background: @bg;
        padding:10px 10px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 10px 0px;
        box-sizing: border-box;
        font-size: 12px;
        color: @ftcolor;
        padding-bottom: 25px;
        #diskInfopanel{
            // flex: 1
        }
        .diskInfo{
          
        }
        .diskdata{
          width: 100%;
        }
        .diskdata_item{
          width: 100%;
          .diskdata_item_title{
            display:block;
            margin: 10px 0px;
            span{
              margin-left:5px;
              color: #bdbdbd;
            }
          }
          .diskdata_item_data{
            width: 100%;
            height: 3px;
            background: #545454;
            position: relative;
            .diskdata_item_data_use{
              position: absolute;
              height: 3px;
              background: #d85100;
            }
          }
        }
        .diskInfo_contant{
            // flex-basis:300px;
            // padding: 0px 10px;
            padding-left: 100px;
            .diskInfo_contant_item{
              width: 200px;
              margin:10px;
              border-radius: 5px;
              margin-right:-5px;
              background:@tbg;
              padding: 10px;
            }
        }
    }
  }
  .about{
    background: @bg;
    color: @ftcolor;
    padding:10px;
    cursor: pointer;
  }
  .refresh{
    text-align: center;
    font-size: 14px;
    color: @ftcolor;
    -webkit-app-region: no-drag;
    user-select: none;
    cursor: pointer;
  }
  .copy{
    -webkit-app-region: no-drag;
    user-select: none;
    cursor: pointer;
  }
}
</style>