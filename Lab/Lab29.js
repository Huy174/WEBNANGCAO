function doWork(callback) { 
 
    console.log("Dang xu ly...") 
 
    callback() 
}  
doWork(() => { 
    console.log("Hoan thanh") 
}) 
