/********************************************************************
@package common
@name rh_auth
@purpose To authenticate users for rzone and provide api support
@author Oliver Wee
@email wscoliver@gmail.com
@updated 2/1/2015

Password Algorithm:
1)Get user's salt in passwd_salt column
2)md5(passwd+passwd_salt) to check for password.

********************************************************************/
//Include the necesssary files.
var sql_driver = require('../../sql_driver.js').sql_driver;
var md5 = require('MD5');
//The rzone authentication class
function auth(res_matric, res_password){
  this.setMatric(res_matric);
  this.setPassword(res_password); 
  //console.log(this.getPassword()); 
}
auth.prototype = {
/********************************************************************
  Login Function
********************************************************************/
  constructor: auth,
  login: function(cbfn){
    var mysql_driver = new sql_driver();
    var res_pass = this.getPassword();
    mysql_driver.select(Array('matric','password','type','name','passwd_salt'),'1415_members',{'matric':this.getMatric()},
      function(err, res){
        if(res.length!=0){ 
          if( md5(res_pass+res[0]['passwd_salt']) == res[0]['password']){
            //Login Success
            //console.log('Login Success');
            var output_arr = {
              'name':res[0]['name'],
              'type':res[0]['type'],
              'matric':res[0]['matric'],
            };
            cbfn(null, output_arr);
          }else{
            //console.log('Password incorrect');
            cbfn('Wrong matric number or password', 0);
          }
        }else{
          //console.log('User not found');
          cbfn('Wrong matric number or password',0);
        }
      });   
  },

/********************************************************************
  Reset all passwords Function
********************************************************************/
  resetall: function(cbfn){
    var mysql_driver = new sql_driver();
    mysql_driver.select(Array('id','room'),'1415_members',{},
      function(err, res){
        //For each resident, update the new passwd_salt and password
        var i = 0;
        while( i < res.length){
          var user_id = res[i]['id'];
          //console.log(user_id);
          var user_pass = res[i]['room'];
          //Get UNIX time
          var user_salt = md5(Date.now());
          var user_hash = md5(user_pass+user_salt);
          mysql_driver.update({'password':user_hash,'passwd_salt':user_salt},
            '1415_members',{'id':user_id}, function(err, res){}); 
          i++;
        }
        cbfn(err,res);
      });
  },

/********************************************************************
  Reset  password Function
********************************************************************/
  reset: function(cbfn){
    var mysql_driver = new sql_driver();
    mysql_driver.select(Array('id','room'),'1415_members',{'id': this.getId()},
      function(err, res){
        //For each resident, update the new passwd_salt and password
          var user_id = res[0]['id'];
          //console.log(user_id);
          var user_pass = res[0]['room'];
          //Get UNIX time
          var user_salt = md5(Date.now());
          var user_hash = md5(user_pass+user_salt);
          mysql_driver.update({'password':user_hash,'passwd_salt':user_salt},
            '1415_members',{'id':user_id}, cbfn(err,res)); 
        
      });
  },

/********************************************************************
  Reset  password User Function
********************************************************************/
  reset_user: function(matric, pass, cbfn){

    var mysql_driver = new sql_driver();
    mysql_driver.select(Array('id'),'1415_members',{'matric': matric},
      function(err, res){
        //For each resident, update the new passwd_salt and password
          var user_id = res[0]['id'];
          //console.log(user_id);
          var user_pass = pass;
          //Get UNIX time
          var user_salt = md5(Date.now());
          var user_hash = md5(user_pass+user_salt);
          mysql_driver.update({'password':user_hash,'passwd_salt':user_salt},
            '1415_members',{'id':user_id}, function(err, resp){cbfn(err,resp);}); 
        
      });
  },
/********************************************************************
  Getters and Setters
********************************************************************/
  getMatric: function(){ return this.matric; },
  setMatric: function(val){ this.matric = val; },
  getPassword: function(){ return this.password; },
  setPassword: function(val){ this.password = val; },

  getId: function(){ return this.id; },
  setId: function(val){ this.id = val; }
}
/*
var authen = new auth('A0094622E','208');
authen.login(function(err,res){
  if(err){ console.log(err); }else{
    console.log('Login success');
  }
  
});
*/
//authen.resetall();
//authen.setId(119);
//authen.reset();
exports.auth = auth;
