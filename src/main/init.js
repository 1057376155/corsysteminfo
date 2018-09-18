var fs=require('fs')
var path=require('path')
var diskvbs=`
    function disk()
    Const C_COMMA = ","
    Set wmiObj = GetObject("winmgmts:")
    Set refersher = CreateObject("WbemScripting.SWbemRefresher")
    Set disks = refersher.AddEnum(wmiObj, "Win32_PerfFormattedData_PerfDisk_LogicalDisk").objectSet

    refersher.Refresh
    WScript.Sleep 100
    refersher.Refresh
    For Each disk in disks
        diskIoInfoStr =disk.Name & C_COMMA & disk.DiskBytesPerSec/1024/1024  & C_COMMA & disk.DiskReadBytesPerSec/1024/1024  & C_COMMA & disk.DiskWriteBytesPerSec/1024/1024
        Call WScript.Echo (diskIoInfoStr)
    Next
    end function
    disk()
`

function initvbs(){
    var pathIsHas=fs.existsSync(path.resolve(__dirname,'../../static'))
    try {
        if(pathIsHas){
            fs.mkdirSync("../../static/vbs/");
            fs.writeFileSync('../../static/vbs/disk.vbs',diskvbs)
        }else{
            fs.mkdirSync("./resources/static");
            fs.mkdirSync("./resources/static/vbs");
            fs.writeFileSync('./resources/static/vbs/disk.vbs',diskvbs)
        }
    } 
    catch (error) {
        
    }
    
}
// initvbs();
module.exports={
    initvbs:initvbs
}