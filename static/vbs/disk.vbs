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