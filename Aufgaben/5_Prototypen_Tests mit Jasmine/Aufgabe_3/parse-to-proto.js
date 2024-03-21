function parseToProto(json, proto){
    const parsedObj = JSON.parse(json)
    return Object.assign(Object.create(proto), parsedObj)
}

module.exports = { parseToProto}