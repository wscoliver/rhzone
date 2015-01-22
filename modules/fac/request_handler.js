//Include the nonblocking functionality

var blazingnode = require('../../render.js');
var rh_auth = require('../common/rh_auth.js').auth;
var sql_driver = require('../../sql_driver.js').sql_driver;
//Include the processing of text variable in postData
var querystring =  require('querystring');
/*-------------------------------------
* Register New Facility Handler
*
-------------------------------------*/  

function admin_register(response, postData, cookies, query){
  console.log('Add new facility page');
  var mysql_driver = new sql_driver();
  var gen = new blazingnode.render('/modules/common/admin', response);
  gen.newPage('/modules/common/admin-header');
  gen.addVar('res_name', cookies['res_name']);

  gen.newPage('/modules/common/admin');
  gen.addVar('admin_content', '%b% /modules/common/admin-register %b%');
  gen.newPage('/modules/common/admin-register');

  if(postData == '' ){
    //GET Request
    var form_arr = Array();
    mysql_driver.adm_insert('fac_available', Array('id'),'/admin/fac/register',function(err, resp){
      gen.addVar('form_res_new', resp);
      gen.generate();
    });
  }
  else{
    //POST Request
    var postObj = querystring.parse(postData);
    //Check for the fields
    mysql_driver.validate_form('fac_available', Array('id'), postObj, function(err, resp){
      var msg = 'Request recieved';
      if(err!=null){
        console.log(err);
        msg = err;
        gen.addVar('status_msg', msg);
        gen.addVar('back_link', '/admin/fac/register');
        gen.generate();

      }else{
        //Insert the new user
        mysql_driver.insert(
          postObj
          ,'fac_available'
          ,function(err, resp){
             if(err){ msg = err}else{msg='Facility successfuly added';}
         
            gen.addVar('form_res_new', '%b% /modules/common/admin-status %b%');
            gen.newPage('/modules/common/admin-status');
            gen.addVar('status_msg', msg);
            gen.addVar('back_link', '/admin/fac/register');
            gen.generate();
          });
          
      }
            
      
    });
  }
}
admin_register.prototype.reqCookie = ['res_matric','res_name','res_group'];
exports.admin_register = admin_register;

/*-------------------------------------
*Delete Existing Facility Handler
*
-------------------------------------*/  


function admin_remove(response, postData, cookies, query){
  console.log('Facility remove page');
  var mysql_driver = new sql_driver();
  var msg = '';
  var gen = new blazingnode.render('/modules/common/admin', response);
  gen.newPage('/modules/common/admin-header');
  gen.addVar('res_name', cookies['res_name']);
  gen.newPage('/modules/common/admin');
  if(postData == '' ){
    //GET Request
    //console.log(query);
    //console.log(typeof(query['matric']));
    if( typeof(query['id']) == 'undefined' ){
      msg = 'Invalid query ';
      gen.addVar('admin_content', '%b% /modules/common/admin-status %b%');
      gen.newPage('/modules/common/admin-status');
      gen.addVar('status_msg',msg);
      gen.addVar('back_link', '/admin/fac/home');
      gen.generate();
    }
    else{
      
    mysql_driver.sdelete('fac_available', {'id':query['id']}, function(err, resp){

      msg = 'Facility removed ';
      gen.addVar('admin_content', '%b% /modules/common/admin-status %b%');
      gen.newPage('/modules/common/admin-status');
      gen.addVar('status_msg',msg);
      gen.addVar('back_link', '/admin/fac/home');
      gen.generate();
    });
    }
  }
}
admin_remove.prototype.reqCookie = ['res_matric','res_name','res_group'];
exports.admin_remove = admin_remove;

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

