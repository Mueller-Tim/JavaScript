require('./scripts')
//a)

const scriptOfSample = function (symbol, script){
    for (const language of script){
        for(const ranges of language.ranges){
            if(symbol.codePointAt(0) >= ranges[0] && symbol.codePointAt(0) <= ranges[1]){
                return language.name
            }
        }
    }
    return "unknown"

}

module.exports = {scriptOfSample}
