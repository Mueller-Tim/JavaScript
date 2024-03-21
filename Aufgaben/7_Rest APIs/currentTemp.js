let https;
try {
    https = require('node:https');
} catch (err) {
    console.error('https support is disabled!');
}
const location = process.argv[2];
let url = `https://www.wttr.in/${location}?format=%t`

https.get(url, function (resp) {
    let body = ''
    resp.on('data', function (chunk) {
        body += chunk;
    })
    resp.on('end', function () {
        console.log(body.slice(1));
    })
}).on("error", (err) => {
    console.log("Errormessage: " + err.message);
})