const findTag = function (text){

    head = text.slice(text.indexOf("<") + 1, text.indexOf(">"))

    if(!head.includes(" ")){
        if(head.includes("<")){
            head = head.split("<")[1]
        } else if(head.includes(">")){
            head = head.split(">")[0]
        }
        return head
    }
}

console.log(findTag("<dd>ss>ss"))

module.exports = {findTag}