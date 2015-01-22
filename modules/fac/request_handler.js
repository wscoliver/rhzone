//Include the nonblocking functionality

var blazingnode = require('../../render.js');
<<<<<<< HEAD
var rh_auth = require('../common/rh_auth.js').auth;
=======
var rh_auth = require('./rh_auth.js').auth;
>>>>>>> 8e75dae51fe508f6a010942e76a1811d18ace2ab
var sql_driver = require('../../sql_driver.js').sql_driver;
//Include the processing of text variable in postData
var querystring =  require('querystring');
/*-------------------------------------
<<<<<<< HEAD
* Register New Facility Handler
=======
* Register New User Handler
>>>>>>> 8e75dae51fe508f6a010942e76a1811d18ace2ab
*
-------------------------------------*/  

function admin_register(response, postData, cookies, query){
  console.log('Add new facility page');
  var mysql_driver = new sql_driver();
<<<<<<< HEAD
  var gen = new blazingnode.render('/modules/common/admin', response);
  gen.newPage('/modules/common/admin-header');
  gen.addVar('res_name', cookies['res_name']);

  gen.newPage('/modules/common/admin');
  gen.addVar('admin_content', '%b% /modules/common/admin-register %b%');
  gen.newPage('/modules/common/admin-register');
=======
>>>>>>> 8e75dae51fe508f6a010942e76a1811d18ace2ab

  if(postData == '' ){
    //GET Request
    var form_arr = Array();
    mysql_driver.adm_insert('fac_available', Array('id'),'/admin/fac/register',function(err, resp){
<<<<<<< HEAD
=======
      var gen = new blazingnode.render('/modules/common/admin', response);
      gen.newPage('/modules/common/admin-header');
      gen.addVar('res_name', cookies['res_name']);
      gen.newPage('/modules/common/admin-content');
      gen.addVar('user_content', '%b% /modules/fac/admin-register %b%');
      gen.newPage('/modules/common/admin-register');
>>>>>>> 8e75dae51fe508f6a010942e76a1811d18ace2ab
      gen.addVar('form_res_new', resp);
      gen.generate();
    });
  }
  else{
    //POST Request
<<<<<<< HEAD
    var postObj = querystring.parse(postData);
    //Check for the fields
    mysql_driver.validate_form('fac_available', Array('id'), postObj, function(err, resp){
=======
    //Login Request
    var postObj = querystring.parse(postData);
    //Check for the fields
    mysql_driver.validate_form('1415_members', Array('id'), postObj, function(err, resp){
>>>>>>> 8e75dae51fe508f6a010942e76a1811d18ace2ab
      var msg = 'Request recieved';
      if(err!=null){
        console.log(err);
        msg = err;
<<<<<<< HEAD
        gen.addVar('status_msg', msg);
        gen.addVar('back_link', '/admin/fac/register');
        gen.generate();

=======
>>>>>>> 8e75dae51fe508f6a010942e76a1811d18ace2ab
      }else{
        //Insert the new user
        mysql_driver.insert(
          postObj
<<<<<<< HEAD
          ,'fac_available'
          ,function(err, resp){
             if(err){ msg = err}else{msg='Facility successfuly added';}
         
            gen.addVar('form_res_new', '%b% /modules/common/admin-status %b%');
            gen.newPage('/modules/common/admin-status');
            gen.addVar('status_msg', msg);
            gen.addVar('back_link', '/admin/fac/register');
=======
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
>>>>>>> 8e75dae51fe508f6a010942e76a1811d18ace2ab
            gen.generate();
          });
          
      }
            
<<<<<<< HEAD
=======
      var gen = new blazingnode.render('/modules/common/user', response);
      gen.newPage('/modules/common/header');
      gen.addVar('res_name', cookies['res_name']);
      gen.newPage('/modules/common/user');
      gen.addVar('user_content', '%b% /modules/common/user-register %b%');
      gen.newPage('/modules/common/user-register');
      gen.addVar('form_res_new', msg);
      gen.generate();
>>>>>>> 8e75dae51fe508f6a010942e76a1811d18ace2ab
      
    });
  }
}
admin_register.prototype.reqCookie = ['res_matric','res_name','res_group'];
exports.admin_register = admin_register;

/*-------------------------------------
<<<<<<< HEAD
*Delete Existing Facility Handler
=======
*Update Existing User Handler
>>>>>>> 8e75dae51fe508f6a010942e76a1811d18ace2ab
*
-------------------------------------*/  


<<<<<<< HEAD
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
=======
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
>>>>>>> 8e75dae51fe508f6a010942e76a1811d18ace2ab

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

<<<<<<< HEAD
=======
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
>>>>>>> 8e75dae51fe508f6a010942e76a1811d18ace2ab
