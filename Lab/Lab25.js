function processArray(array, callback) { 
 
    for (let i = 0; i < array.length; i++) {        
        callback(array[i]) 
    } 
}  
processArray([1, 2, 3, 4], function(item) {     
    console.log(item * 2) 
}) 
