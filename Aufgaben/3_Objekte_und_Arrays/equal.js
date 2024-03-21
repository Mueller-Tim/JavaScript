const equal = function (a, b){
    if(a === b){
        return true;
    } else if(typeof a === typeof b && typeof a !== "number"){

        let keysA = Object.keys(a)
        let keysB = Object.keys(b)

        if(keysA.length != keysB.length){
            return false
        }

        for (let i = 0; i < keysA.length; i++){
            let key = keysA[i]

            if (a[key] !== b[key]){
                return false
            }


        }
        return true

    }
    return false
}


console.log(equal(16, 16))
console.log(equal("hi", "hi"))
console.log(equal({}, {}))
console.log(equal({a:1, b:2}, {b:2, a:1}))
console.log(equal({a:1, b:2}, {c:3, b:2, a:1}))
console.log(equal({a:{}}, {a:{}}))
console.log(equal(1,3))

module.exports = { equal }