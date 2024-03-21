const fs = require('fs')
const path = require('path')

if(process.argv.length < 4){
    console.log("Usage: node csv2json.js [input.csv] [output.json]")
    process.exit(1)
}

const csvPath = process.argv[2]
const jsonPath = process.argv[3]

if(path.extname(csvPath) === '.json' || path.extname(jsonPath) === '.csv'){
    console.log("Don't accidentally overwrite files!")
    process.exit(1)
}

const startTime = Date.now()
const csvData = fs.readFileSync(csvPath, 'utf8')
const endTime = Date.now()

const stats = fs.statSync(csvPath)

const fileSize = stats.size
const lastModified = stats.mtime
const numRecords = csvData.split("\n").length-1 // exclude header

console.log(`File Size: ${fileSize} bytes`)
console.log(`Last Modified: ${lastModified}`)
console.log(`Number of Records: ${numRecords}`)
console.log(`Time to Read: ${endTime - startTime} ms`)

const [headerLine, ...lines] = csvData.trim().split('\n')
const headers = headerLine.split(',')
const jsonArr = lines.map(line =>{
    const values = lines.split(',')
    return headers.reduce((acc, header, i) => {
        acc[header] = values[i]
        return acc;
    }, {})
})