
require('./scripts')
//a)

const scriptOfSample = function (symbol){
    for (const language of SCRIPTS){
        for(const ranges of language.ranges){
            if(symbol.codePointAt(0) >= ranges[0] && symbol.codePointAt(0) <= ranges[1]){
                return language.name
            }
        }
    }
    return "unknown"

}

//b)
const scriptsInString = function (text){
    let object = {}
    for(let i = 0; i < text.length; i++){
        let newLanguage = scriptOfSample(text.charAt(i))
        if(newLanguage in object){
            object[newLanguage] += 1
        } else{
            object[newLanguage] = 1
        }
    }
    return object
}

console.log(scriptsInString(('https://pоstfinance.ch')))

module.exports = {scriptOfSample}
