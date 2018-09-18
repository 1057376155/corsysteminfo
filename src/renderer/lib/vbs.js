var process = require('child_process');
var path=require('path')
function getdiskio(){
  return new Promise((resolve,reject)=>{
    process.exec('cscript '+path.resolve(__dirname,'../../../static/vbs/disk.vbs'),function (error, stdout, stderr) {
        if (error !== null) {
          console.log('获取失败: ' + error);
        }
        var data=[]
        stdout.split('\r\n').forEach((item,index)=>{
          if(item.indexOf(':,')>-1){
            data.push({name:item.split(',')[0],DiskReadBytesPerSec:item.split(',')[2],DiskWriteBytesPerSec:item.split(',')[3]})
          }
        })
        resolve(data)
    });
  })
}

export var vbs={
  getdiskio:getdiskio 
}