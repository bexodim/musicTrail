var http = require('http'),  
    httpProxy = require('http-proxy');
//
// Create a basic proxy server in one line of code...
//
// This listens on port 8000 for incoming HTTP requests 
// and proxies them to port 9000
httpProxy.createServer('http://www.secondhandsongs.com/search/artist/').listen(1337);

//
// ...and a simple http server to show us our request back.
//

http.createServer(function (req, res) {  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9000);
