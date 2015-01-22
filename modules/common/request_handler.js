//Include the nonblocking functionality

var blazingnode = require('../../render.js');
var rh_auth = require('./rh_auth.js').auth;
var sql_driver = require('../../sql_driver.js').sql_driver;
//Include the processing of text variable in postData
var querystring =  require('querystring');
/*-------------------------------------
* Index Handler
*
-------------------------------------*/  

function index(response, postData, cookies, query){
  var mysql_driver = new sql_driver();
  var form_arr = Array();
  mysql_driver.adm_insert('1415_members', Array('id'),'/',function(err, resp){
    form_arr.push(resp);
    //mysql_driver.adm_update('1415_members', Array('id','passwd_salt','password'),{'matric':cookies['res_matric']},'/',function(err, resp){
    mysql_driver.adm_browse('1415_members', Array('passwd_salt','password'),{},1,'/',function(err, resp){
      var gen = new blazingnode.render('/modules/common/index', response);
      gen.newPage('/modules/common/header');
      gen.addVar('res_name', cookies['res_name']);
      gen.generate();
    });
  });
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
          //console.log('Login success');
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
/*-------------------------------------
* Logout Handler
*
-------------------------------------*/  

function logout(response, postData, cookies, query){
    //GET Request
          //Set Cookies and redirect to main page
    //console.log('Logout success');
          //console.log(resp['matric']);
    var now_date = new Date();
    now_date.setDate(now_date.getDate() - 2);
    response.writeHead(302,[
      ['Content-Type','text/html'],
      ['Set-Cookie','res_matric=0;expires='+now_date.toUTCString()],
      ['Set-Cookie','res_name=0;expires='+now_date.toUTCString()],
      ['Set-Cookie','res_group=0;expires='+now_date.toUTCString()],
      ['Location','/login']
    ]);
    response.end();
}
logout.prototype.reqCookie = [];
exports.logout = logout;
/*-------------------------------------
* Register New User Handler
*
-------------------------------------*/  

function user_register(response, postData, cookies, query){
  console.log('User registration page');
  var mysql_driver = new sql_driver();

  if(postData == '' ){
    //GET Request
    var form_arr = Array();
    mysql_driver.adm_insert('1415_members', Array('id'),'/user/register',function(err, resp){
      var gen = new blazingnode.render('/modules/common/user', response);
      gen.newPage('/modules/common/header');
      gen.addVar('res_name', cookies['res_name']);
      gen.newPage('/modules/common/user');
      gen.addVar('user_content', '%b% /modules/common/user-register %b%');
      gen.newPage('/modules/common/user-register');
      gen.addVar('form_res_new', resp);
      gen.generate();
    });
  }
  else{
    //POST Request
    //Login Request
    var postObj = querystring.parse(postData);
    //Check for the fields
    mysql_driver.validate_form('1415_members', Array('id'), postObj, function(err, resp){
      var msg = 'Request recieved';
      if(err!=null){
        console.log(err);
        msg = err;
      }else{
        //Insert the new user
        mysql_driver.insert(
          postObj
          ,'1415_members'
          ,function(err, resp){
             if(err){ msg = err}else{msg='user successfuly added';}
         
            var gen = new blazingnode.render('/modules/common/user', response);
            gen.newPage('/modules/common/header');
            gen.addVar('res_name', cookies['res_name']);
            gen.newPage('/modules/common/user');
            gen.addVar('user_content', '%b% /modules/common/user-register %b%');
            gen.newPage('/modules/common/user-register');
            gen.addVar('form_res_new', '%b% /modules/common/user-register-success %b%');
            gen.generate();
          });
          
      }
            
      var gen = new blazingnode.render('/modules/common/user', response);
      gen.newPage('/modules/common/header');
      gen.addVar('res_name', cookies['res_name']);
      gen.newPage('/modules/common/user');
      gen.addVar('user_content', '%b% /modules/common/user-register %b%');
      gen.newPage('/modules/common/user-register');
      gen.addVar('form_res_new', msg);
      gen.generate();
      
    });
  }
}
user_register.prototype.reqCookie = ['res_matric','res_name','res_group'];
exports.user_register = user_register;

/*-------------------------------------
*Update Existing User Handler
*
-------------------------------------*/  


function user_update(response, postData, cookies, query){
  console.log('User update page');
  var mysql_driver = new sql_driver();
  var msg = '';
  if(postData == '' ){
    //GET Request
    //console.log(query);
    //console.log(query['matric']);
    if( typeof(query['matric']) == undefined ){
      msg = 'Invalid query ';
      var gen = new blazingnode.render('/modules/common/user', response);
      gen.newPage('/modules/common/header');
      gen.addVar('res_name', cookies['res_name']);
      gen.newPage('/modules/common/user');
      gen.addVar('user_content', '%b% /modules/common/user-update %b%');
      gen.newPage('/modules/common/user-update');
      gen.addVar('form_res_new', msg);
      gen.generate();
    }
    else{

      var form_arr = Array();
      mysql_driver.adm_update('1415_members', Array('id','password','passwd_salt'),{'matric':query['matric']},'/user/update',function(err, resp){
        var gen = new blazingnode.render('/modules/common/user', response);
        gen.newPage('/modules/common/header');
        gen.addVar('res_name', cookies['res_name']);
        gen.newPage('/modules/common/user');
        gen.addVar('user_content', '%b% /modules/common/user-update %b%');
        gen.newPage('/modules/common/user-update');
        gen.addVar('form_res_new', resp);
        gen.generate();
    });
    }
  }
  else{
    //POST Request
    //Update Request
    var postObj = querystring.parse(postData);
    //Check for the fields
    mysql_driver.validate_form('1415_members', Array('id','password','passwd_salt'), postObj, function(err, resp){
      var msg = 'Update request recieved';
      if(err!=null){
        console.log(err);
        msg = err;
        
        var gen = new blazingnode.render('/modules/common/user', response);
        gen.newPage('/modules/common/header');
        gen.addVar('res_name', cookies['res_name']);
        gen.newPage('/modules/common/user');
        gen.addVar('user_content', '%b% /modules/common/user-update %b%');
        gen.newPage('/modules/common/user-update');
        gen.addVar('form_res_new', msg);
        gen.generate();
      }else{
        //Uodate the new user
        //Reformat the columns
        var columns = Array();
        for ( k in postObj){
          var col_name = k.substring(3);
          columns[col_name] = postObj[k];

        }
        mysql_driver.update(columns,'1415_members',{'matric':postObj['fm_matric']},function(err, resp){
        
             if(err){ msg = err;}else{msg='user successfuly updated';}
         
            var gen = new blazingnode.render('/modules/common/user', response);
            gen.newPage('/modules/common/header');
            gen.addVar('res_name', cookies['res_name']);
            gen.newPage('/modules/common/user');
            gen.addVar('user_content', '%b% /modules/common/user-update %b%');
            gen.newPage('/modules/common/user-update');
            gen.addVar('form_res_new', '%b% /modules/common/user-update-result %b%');
            gen.newPage('/modules/common/user-update-result');
            gen.addVar('msg', msg);
            gen.addVar('update_id', resp);
            gen.generate();
        });
      }
            
      
    });
  }
}
user_update.prototype.reqCookie = ['res_matric','res_name','res_group'];
exports.user_update = user_update;
/*-------------------------------------
*Delete Existing User Handler
*
-------------------------------------*/  


function user_remove(response, postData, cookies, query){
  console.log('User remove page');
  var mysql_driver = new sql_driver();
  var msg = '';
  if(postData == '' ){
    //GET Request
    //console.log(query);
    //console.log(typeof(query['matric']));
    if( typeof(query['matric']) == 'undefined' ){
      msg = 'Invalid query ';
      var gen = new blazingnode.render('/modules/common/user', response);
      gen.newPage('/modules/common/header');
      gen.addVar('res_name', cookies['res_name']);
      gen.newPage('/modules/common/user');
      gen.addVar('user_content', '%b% /modules/common/user-remove %b%');
      gen.newPage('/modules/common/user-remove');
      gen.addVar('msg',msg);
      gen.addVar('matric', 'User not found');
      gen.generate();
    }
    else{

      msg = 'Confirm remove user ';
      var gen = new blazingnode.render('/modules/common/user', response);
      gen.newPage('/modules/common/header');
      gen.addVar('res_name', cookies['res_name']);
      gen.newPage('/modules/common/user');
      gen.addVar('user_content', '%b% /modules/common/user-remove %b%');
      gen.newPage('/modules/common/user-remove');
      gen.addVar('msg',msg);
      gen.addVar('matric', query['matric']);
      gen.generate();
    }
  }
  else{
    //POST Request
    //Remove Request
    var postObj = querystring.parse(postData);
    mysql_driver.sdelete('1415_members', {'matric':postObj['matric']}, function(err, resp){

      msg = 'User removed ';
      var gen = new blazingnode.render('/modules/common/user', response);
      gen.newPage('/modules/common/header');
      gen.addVar('res_name', cookies['res_name']);
      gen.newPage('/modules/common/user');
      gen.addVar('user_content', '%b% /modules/common/user-remove-result %b%');
      gen.newPage('/modules/common/user-remove-result');
      gen.addVar('msg',msg);
      gen.addVar('matric', postObj['matric']);
      gen.generate();
    });
    //Check for the fields
  }
}
user_remove.prototype.reqCookie = ['res_matric','res_name','res_group'];
exports.user_remove = user_remove;

/*-------------------------------------
*Browse Existing Users Handler
*
-------------------------------------*/  


function user_browse(response, postData, cookies, query){
  console.log('User browse page');
  var mysql_driver = new sql_driver();
  var msg = '';
  var exceptions = Array('dpicture','birthday','type','course','shirt_size','email','phone','passwd_salt','password');
  if(postData == '' ){
    //GET Request
    var filter = Array();
    if ( typeof(query['filter']) != 'undefined'){ 
      console.log(query['filter']);
      filter = JSON.parse(query['filter']);
    }

 
    if( typeof(query['page']) == 'undefined' ){
      //Show first page
      mysql_driver.adm_browse('1415_members', exceptions,filter,1,'/',function(err, resp){
      var gen = new blazingnode.render('/modules/common/user', response);
      gen.newPage('/modules/common/header');
      gen.addVar('res_name', cookies['res_name']);
      gen.newPage('/modules/common/user');
      gen.addVar('user_content', '%b% /modules/common/user-browse %b%');
      gen.newPage('/modules/common/user-browse');
      gen.addVar('form_res_new',resp); 
      gen.generate();
    });
    }
    else{

      mysql_driver.adm_browse('1415_members', exceptions,{},query['page'],'/',function(err, resp){
      var gen = new blazingnode.render('/modules/common/user', response);
      gen.newPage('/modules/common/header');
      gen.addVar('res_name', cookies['res_name']);
      gen.newPage('/modules/common/user');
      gen.addVar('user_content', '%b% /modules/common/user-browse %b%');
      gen.newPage('/modules/common/user-browse');
      gen.addVar('form_res_new',resp); 
      gen.generate();
      });
    }
  }

}
user_browse.prototype.reqCookie = ['res_matric','res_name','res_group'];
exports.user_browse = user_browse;

/*-------------------------------------
*Change Existing Users Password Handler
*
-------------------------------------*/  


function user_change_password(response, postData, cookies, query){
  console.log('User change password page');
  var mysql_driver = new sql_driver();

  if(postData == '' ){
    //GET Request
    //console.log(query);
    //console.log(query['matric']);
    if( typeof(query['matric']) == 'undefined' ){
      msg = 'Invalid query ';
      var gen = new blazingnode.render('/modules/common/user', response);
      gen.newPage('/modules/common/header');
      gen.addVar('res_name', cookies['res_name']);
      gen.newPage('/modules/common/user');
      gen.addVar('user_content', '%b% /modules/common/user-password %b%');
      gen.newPage('/modules/common/user-password');
      gen.addVar('msg', msg);
      gen.addVar('matric', '');
      gen.generate();
    }
    else{

      var form_arr = Array();
        var gen = new blazingnode.render('/modules/common/user', response);
        gen.newPage('/modules/common/header');
        gen.addVar('res_name', cookies['res_name']);
        gen.newPage('/modules/common/user');
        gen.addVar('user_content', '%b% /modules/common/user-password %b%');
        gen.newPage('/modules/common/user-password');
        gen.addVar('msg', 'Change user password?');
        gen.addVar('matric', query['matric']);
        gen.generate();
    }
  }
  else{
    //POST Request
    //Change Password Request
    var authen = new rh_auth('', '' );
    var postObj = querystring.parse(postData);
    /*
            var gen = new blazingnode.render('/modules/common/user', response);
            gen.newPage('/modules/common/user');
            gen.addVar('user_content', '%b% /modules/common/user-password %b%');
            gen.newPage('/modules/common/user-password');
            gen.addVar('msg', postObj['res_pass']);
            gen.addVar('matric', postObj['res_matric']);
            gen.generate();
    */
    //Check for the fields
      authen.reset_user(postObj['res_matric'],postObj['res_pass'],function(err, resp){
            var gen = new blazingnode.render('/modules/common/user', response);
      gen.newPage('/modules/common/header');
      gen.addVar('res_name', cookies['res_name']);
            gen.newPage('/modules/common/user');
            gen.addVar('user_content', '%b% /modules/common/user-password %b%');
            gen.addVar('res_matric', cookies['res_matric']);
            gen.addVar('res_name', cookies['res_name']);
            gen.newPage('/modules/common/user-password');
            gen.addVar('msg', 'Password Changed');
            gen.addVar('matric', postObj['res_matric']);
            gen.generate();
       });
      
  }
}
user_change_password.prototype.reqCookie = ['res_matric','res_name','res_group'];
exports.user_change_password = user_change_password;
