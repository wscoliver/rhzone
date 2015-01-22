//Include the nonblocking functionality

var blazingnode = require('../../render.js');
var rh_auth = require('../common/rh_auth.js').auth;
var sql_driver = require('../../sql_driver.js').sql_driver;
var async = require('async');

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
        gen.addVar('form_res_new', '%b% /modules/common/admin-status %b%');
        gen.newPage('/modules/common/admin-status');
        gen.addVar('status_msg', msg);
        gen.addVar('back_link', '/admin/fac/register');
        gen.generate();

      }else{
        //Insert the new facility
        mysql_driver.insert(
          postObj
          ,'fac_available'
          ,function(err, resp){
            if(err){ msg = err}else{

            msg='Facility successfuly added';
            var id = resp;
            
            //Create new time slots for the new facility
            //For next 1000 days
            var date_arr = Array();
            var i = 0;
            while ( i < 1000 ){
              var testdate = new Date();
              testdate.setDate(testdate.getDate()+i);
              var tomorrow = testdate.toISOString().slice(0,10).replace('T', ' ');
              date_arr.push(tomorrow);
              i++;
            }
            //console.log(date_arr);
            //console.log(tomorrow);
            //Use Async to insert all the dates
            var fac_time_slot = Array();
            fac_time_slot['fm_fac_id'] = id;
            fac_time_slot['fm_s1'] = 0;
            fac_time_slot['fm_s2'] = 0;
            fac_time_slot['fm_s3'] = 0;
            fac_time_slot['fm_s4'] = 0;
            fac_time_slot['fm_s5'] = 0;
            fac_time_slot['fm_s6'] = 0;
            fac_time_slot['fm_s7'] = 0;
            fac_time_slot['fm_s8'] = 0;
            fac_time_slot['fm_s9'] = 0;
            fac_time_slot['fm_s10'] = 0;
            fac_time_slot['fm_s11'] = 0;
            fac_time_slot['fm_s12'] = 0;
            fac_time_slot['fm_s13'] = 0;
            fac_time_slot['fm_s14'] = 0;
            fac_time_slot['fm_s15'] = 0;
            fac_time_slot['fm_s16'] = 0;

            async.mapSeries(date_arr,
              function(key, cb){
                fac_time_slot['fm_booked_date']=key;
                //console.log(fac_time_slot);
                mysql_driver.insert(fac_time_slot, 'fac_time_slots', function(err, resp){
                  cb(err, resp); 
                });             
              },
              function(err, res){
                if(err){console.log(err);} 
                gen.addVar('form_res_new', '%b% /modules/common/admin-status %b%');
                gen.newPage('/modules/common/admin-status');
                gen.addVar('status_msg', msg);
                gen.addVar('back_link', '/admin/fac/register');
                gen.generate();
 
              });
             
            
            gen.addVar('form_res_new', '%b% /modules/common/admin-status %b%');
            gen.newPage('/modules/common/admin-status');
            gen.addVar('status_msg', msg+' id: '+id);
            gen.addVar('back_link', '/admin/fac/register');
            gen.generate();
            }
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
      //Delete the time slots
      
      mysql_driver.sdelete('fac_time_slots', {'fac_id':query['id']}, function(err, resp){
        if(err){
          console.log(err);
        }
        msg = 'Facility removed ';
        gen.addVar('admin_content', '%b% /modules/common/admin-status %b%');
        gen.newPage('/modules/common/admin-status');
        gen.addVar('status_msg',msg);
        gen.addVar('back_link', '/admin/fac/home');
        gen.generate();
      });
    });
    }
  }
}
admin_remove.prototype.reqCookie = ['res_matric','res_name','res_group'];
exports.admin_remove = admin_remove;
