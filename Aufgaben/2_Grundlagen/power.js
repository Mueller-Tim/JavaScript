
const power = function (base, exponent){
    assert(Number.isInteger(exponent) & exponent > -1 & typeof base =='number',
        "The exponent " + exponent + " must be a whole natural number.")
    if(exponent > 0){
        if(exponent % 2 == 0){
            return power(base, exponent/2) ** 2
        } else{
            return base * power(base, exponent-1)
        }
    } else{
        return  1
    }
}

function assert(condition, message){
    if(!condition) throw new Error(message || "Assertion failed")
}

module.exports = {power}

