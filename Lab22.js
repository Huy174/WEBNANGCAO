function calculate(a, b, callback) {     
    return callback(a, b) 
}  
function multiply(x, y) {     
    return x * y 
}  
let result = calculate(4, 5, multiply) 
console.log(result) 
