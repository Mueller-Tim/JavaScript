const factorial = function (number){

    if(number < 1){
        if(typeof number == 'number'){
            result = 1
        } else{
            result = 1n
        }

    } else{
        result = number
        number--
        while(number > 1){
            result *= number
            number--;
        }

    }

    return result
}

module.exports = {factorial}