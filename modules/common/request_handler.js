//Include the nonblocking functionality

var blazingnode = require('../../render.js');
var rh_auth = require('./rh_auth.js').auth;
//Include the processing of text variable in postData
var querystring =  require('querystring');
/*-------------------------------------
* Index Handler
*
-------------------------------------*/  

function index(response, postData, cookies, query){
  var gen = new blazingnode.render('/modules/common/index', response); 
  gen.generate();
}
index.prototype.reqCookie = ['res_matric','res_group','res_name'];
exports.index = index;

/*-------------------------------------
* Login Handler
*
-------------------------------------*/  

function login(response, postData, cookies, query){
  if(postData == '' ){
    //GET Request
    var gen = new blazingnode.render('/modules/common/login', response);
    gen.newPage('/modules/common/common-login');
    gen.addVar('error', '');
    gen.generate();
  }
  else{
    //POST Request
    //Login Request
    var postObj = querystring.parse(postData);
    //Check for matric and password inputs
    if(postObj.hasOwnProperty('res_matric') && postObj.hasOwnProperty('res_pass')){
      var authen = new rh_auth( postObj.res_matric, postObj.res_pass );
      authen.login(function(err, resp){
        if(err){
          //Login Fail
          //Render login page with error message
          var gen = new blazingnode.render('/modules/common/login', response);
          gen.newPage('/modules/common/common-login');
          gen.addVar('error', '<div id="err_msg">'+err+'</div>');
          gen.generate();
        }else{
          //Set Cookies and redirect to main page
          console.log('Login success');
          //console.log(resp['matric']);
          var now_date = new Date();
          now_date.setDate(now_date.getDate() + 1);
          response.writeHead(302,[
            ['Content-Type','text/html'],
            ['Set-Cookie','res_matric='+resp['matric']+';expires='+now_date.toUTCString()],
            ['Set-Cookie','res_name='+resp['name']+';expires='+now_date.toUTCString()],
            ['Set-Cookie','res_group='+resp['type']+';expires='+now_date.toUTCString()],
            ['Location','/']
         ]);
         response.end();

        }
      }); 
    }
      
  }
  //var gen = new blazingnode.render('/modules/common/login', response); 
  //gen.generate();
}
login.prototype.reqCookie = [];
exports.login = login;
