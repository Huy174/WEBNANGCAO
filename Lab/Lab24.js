function loopArray(array, callback) {      
    for (let i = 0; i < array.length; i++) {       
        callback(array[i]) 
    } 
}  
loopArray([1, 2, 3], function(item) {     
    console.log(item) 
}) 
