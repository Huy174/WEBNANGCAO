function calculate(a, b, callback) {     
    return callback(a, b) 
}  
let result = calculate(10, 5, (x, y) => {     
    return x - y 
})  
console.log(result) 
