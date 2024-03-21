const { parseToProto } = require('../parse-to-proto')

describe("Beschreinung", () =>{
    it("Beschreibung", function(){

        const proto = {category: 'animal'}
        const json = '{"type":"cat","name":"Mimi","age":3}'
        const obj = parseToProto(json, proto)

        expect(obj.type).toBe('cat')
        expect(obj.name).toBe('Mimi')
        expect(obj.age).toEqual(3)
        expect(obj.category).toBe('animal')



        expect(5).toEqual(5)

    });
});