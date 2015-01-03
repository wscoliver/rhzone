var http = require('http');
var url = require('url');

function start(handle, route){
  function onRequest(request, response){
    var postData = "";
    var url_parts = url.parse(request.url, true);
    var pathname = url_parts.pathname;
    var query = url_parts.query;
    var cookies = parseCookies(request);
    request.setEncoding('utf8');
    request.addListener('data',function(postDataChunk){
    postData += postDataChunk;
    });
    request.addListener('end',function(){
      route(handle, pathname, response,postData,cookies,query);
    });
  }
  function parseCookies(request){
    var list = {},
    rc = request.headers.cookie;
    
    rc && rc.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      list[parts.shift().trim()] = unescape(parts.join('='));
    
      
    });
    return list;
  }

  http.createServer(onRequest).listen(10000);
  console.log('Server has started.');
}

exports.start = start;
