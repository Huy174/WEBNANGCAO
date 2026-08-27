let numbers = [3, 7 , 2 ,9, 1];
let max = numbers[0];
for (let i =1; i<numbers.length;i++){
    if(numbers[i]>max){
        max=numbers[i];
    }
}
console.log("So lon nhat:",max);