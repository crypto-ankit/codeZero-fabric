const http =require('http');
const app = require('/home/ankit/CodeZero/fabric-samples/project/api/app.js')
const port  = process.env.PORT || 5000;
try{
var server  = http.createServer(app);
}
catch(error){console.log("error is"+error)}

server.listen(port);    
