require('./scripts')


//a)
//console.log(SCRIPTS[0])

const oldAndLivingWithFor = function (n){
    result = []

    for (value of n){
        if(value.year < 0 & value.living == true){
            result.push(value.name)
        }
    }
    return result

}

const oldAndLiving = function (n){

    return n.filter(country => country.year < 0 & country.living == true).map(country => country.name)

}
//console.log(oldAndLiving(SCRIPTS))

//b)

//console.log(SCRIPTS[3])

const numberOfCodesWithFor = function ({ranges}){
    result = 0
    for (value of ranges){
        result = result + (value[1]-value[0])
    }
    return result
}

const numberOfCodes = function ({ranges}){
    return ranges.reduce((current, [from, to]) => current + to - from, 0)
}

console.log(numberOfCodes(SCRIPTS[3]))