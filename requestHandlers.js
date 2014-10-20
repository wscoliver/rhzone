//Include the nonblocking functionality
var blazingnode = require('./render.js');

//Include the processing of text variable in postData
var querystring =  require('querystring');
/*-------------------------------------
* Index Handler
*
-------------------------------------*/  

function index(response, postData, cookies, query){
  var gen = new blazingnode.render('landing', response); 
  gen.newPage('footer');
  gen.addVar('myname','licera');
  gen.generate();
}
index.prototype.reqCookie = [];
exports.index = index;
