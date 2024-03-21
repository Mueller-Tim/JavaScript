const fibonacci = function (counter){
    g = (1 + Math.sqrt(5)) / 2
    h = (1 - Math.sqrt(5)) / 2
    return Math.round((g ** counter - h ** counter) / Math.sqrt(5))
}

console.log(fibonacci(4))