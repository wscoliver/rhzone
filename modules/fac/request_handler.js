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
/*-------------------------------------
*Manage Existing Facility Handler
*
-------------------------------------*/  


function admin_home(response, postData, cookies, query){
  console.log('Facility home page');
  var mysql_driver = new sql_driver();
  var msg = '';
  var gen = new blazingnode.render('/modules/common/admin', response);
  gen.newPage('/modules/common/admin-header');
  gen.addVar('res_name', cookies['res_name']);
  gen.newPage('/modules/common/admin');
  if(postData == '' ){
    //GET Request
    //Load home page options
    //Get the list of facilities
    var fac_table = "<table><tr><th>Facility ID</th><th>Facility Name</th><th>Options</th></tr>";

    mysql_driver.select('*','fac_available',null, function(err, resp){
      //console.log(resp);
      var i = 0;
      while( i < resp.length ){
        var fac_row = '<tr><td>'+resp[i]['id']+'</td><td>'+resp[i]['name']+'</td>';
        fac_row+='<td><a href="/admin/fac/remove?id='+resp[i]['id']+'">Remove</a></td></tr>';
        fac_table+=fac_row;
        i++;
      }
      fac_table+='</table>';      
      gen.addVar('admin_content', fac_table);
      //gen.addVar('admin_content', '%b% /modules/common/admin-status %b%');
      //gen.newPage('/modules/common/admin-status');
      //gen.addVar('status_msg',msg);
      //gen.addVar('back_link', '/admin/fac/home');
      gen.generate();
    });    
  }
}
admin_home.prototype.reqCookie = ['res_matric','res_name','res_group'];
exports.admin_home = admin_home;
/*-------------------------------------
*View Facility Timetable Handler
*
-------------------------------------*/  


function admin_timetable(response, postData, cookies, query){
  console.log('Facility timetable page');
  var mysql_driver = new sql_driver();
  var msg = '';
  var gen = new blazingnode.render('/modules/common/admin', response);
  gen.newPage('/modules/common/admin-header');
  gen.addVar('res_name', cookies['res_name']);
  gen.newPage('/modules/common/admin');
  if(postData == '' ){
    //GET Request
    //Load home page options
    //Get the list of facilities
    var query_date = query['date'];
    var testdate = new Date();
    var formattedate = testdate.toISOString().slice(0,10).replace('T', ' ');
    var fac_table = '<form action="/admin/fac/timetable?date='+formattedate+'" method="POST"><table>';
    fac_table+= '<tr><th>Facility Name</th>';
    fac_table+= '<th>10:00am - 11:00am</th>';
    fac_table+= '<th>11:00am - 12:00pm</th>';
    fac_table+= '<th>12:00pm - 1:00pm</th>';
    fac_table+= '<th>1:00pm - 2:00pm</th>';
    fac_table+= '<th>2:00pm - 3:00pm</th>';
    fac_table+= '<th>3:00pm - 4:00pm</th>';
    fac_table+= '<th>4:00pm - 5:00pm</th>';
    fac_table+= '<th>5:00pm - 6:00pm</th>';
    fac_table+= '<th>6:00pm - 7:00pm</th>';
    fac_table+= '<th>7:00pm - 8:00pm</th>';
    fac_table+= '<th>8:00pm - 9:00pm</th>';
    fac_table+= '<th>9:00pm - 10:00pm</th>';
    fac_table+= '<th>10:00pm - 11:00pm</th>';
    fac_table+= '<th>11:00pm - 12:00pm</th>';
    fac_table+= '<th>12:00am - 1:00am</th>';
    fac_table+= '<th>1:00am - 2:00am</th>';
    

    fac_table+='</tr>';

    mysql_driver.select('*','fac_available',null, function(err, resp){
      //console.log(resp);
      var fac_avail = resp;
        async.mapSeries(fac_avail,
          function(key, cb){
          //Select all time slots for facility
            var fac_id = key['id'];
            mysql_driver.select('*', 'fac_time_slots',{"fac_id":fac_id,"booked_date":query_date},
              function(err, resarr){
                //console.log(resarr);
                cb(err, resarr);
              });
          },
          function(err, res){
            var a = 0;
            var slot_type = Array();
            slot_type[0]='Available';
            slot_type[1]='Pending';
            slot_type[2]='Booked';
            slot_type[3]='Reserved';
            while( a < res.length){
              var tr_row = '<tr>';
              tr_row+='<td>'+fac_avail[a]['name']+'</td>';
              var x = 1;
              while ( x < 17 ){
                var rindex = 's'+x;
                var rval = res[a][0][rindex];
                var rrow = slot_type[rval];
                //If Available or Pending, allow the booking
                if( rval < 2 ){
               
                  tr_row+='<td><p>'+rrow+'</p>';
                  tr_row+='<input type="checkbox" name ="req_slot" value ="'+res[a][0]['id']+'_'+rindex+'" /></td>';
                }else{

                  tr_row+='<td>'+rrow+'</td>';
                }
                x++;
              }
              tr_row+='</tr>';
              fac_table+=tr_row;
              a++;
            }
            fac_table+='</table>';
            fac_table+='<table>';
            fac_table+='<tr><td>Booking Type</td><td><select name="booking_type">';
            fac_table+='<option value=1>Pending</option>';
            fac_table+='<option value=2>Booking</option>';
            fac_table+='<option value=3>Reservation</option>';
             
            fac_table+='</select></td></tr>';
            fac_table+='<tr><td>Reason</td><td><textarea name="fm_booking_reason"></textarea></td></tr>';
            fac_table+='<tr><td>Committee</td><td><input type="text" name="fm_booking_committee"></input></td></tr>';
            fac_table+='<tr><td><input type="Submit" value="Book"></input></td></tr>';
            fac_table+='</table>';

            gen.addVar('admin_content', fac_table);
            gen.generate();
          });
    }); 
  }else{
    //Post request to book the room

    var postObj = querystring.parse(postData);
    console.log(postObj);
    //For each time slot chosen, update the status and insert a new booking
    var slots_arr = postObj['req_slot'];
    async.mapSeries(slots_arr,
      function(key, cb){
        //Split the key into fac_id and slot time
        var key_arr = key.split("_");
        var fac_time_id = key_arr[0];
        var slot_time_id = key_arr[1];
        //Change tne booking status and insert new booking at the same time
        async.waterfall([
          function(cbb){
            //Form the insert booking
  
            mysql_driver.select(Array('id'),'1415_members',{'matric':cookies['res_matric']},
              function(err, resp){
                var user_id = resp[0]['id'];
                cbb(err, user_id);
              });
          },
          function(arg1, cbb){
            var update_arr = Array();
            update_arr[slot_time_id]=postObj['booking_type'];
            mysql_driver.update(update_arr,
              'fac_time_slots',
              {'id':fac_time_id},
            function(err, resa){
              //console.log(err);
              //console.log(resa);
              cbb(err, arg1);
            });
          },
          function(arg2, cbb){
            var insertobj = Array();
            insertobj['fm_user_id']=arg2;
            insertobj['fm_fac_slots_id']=fac_time_id;
            insertobj['fm_fac_time_slot']=slot_time_id;
            insertobj['fm_booking_status']=postObj['booking_type'];
            insertobj['fm_booking_reason']=postObj['fm_booking_reason'];
            insertobj['fm_booking_committee']=postObj['fm_booking_committee'];
            insertobj['fm_booking_remarks']='Approved by JCRC ';
            insertobj['fm_approver_id']=arg2;
 
            mysql_driver.insert(insertobj, 'fac_bookings', function(err, reply){
              cbb(err, reply);
            });
          }
        ],
        function(err, res){
          cb(err, res);
        });
      },
      function(err, resp){
        console.log(resp);
        gen.addVar('admin_content', 'Post Request Recieved');
        gen.generate();
      }
    );
    //gen.addVar('admin_content', 'Post Request Recieved');
    //gen.generate();
  }
}
admin_timetable.prototype.reqCookie = ['res_matric','res_name','res_group'];
exports.admin_timetable = admin_timetable;
/*-------------------------------------
*Manage Existing Applications Handler
*
-------------------------------------*/  


function admin_bookings(response, postData, cookies, query){
  console.log('Facility bookings page');
  var mysql_driver = new sql_driver();
  var msg = '';
  var gen = new blazingnode.render('/modules/common/admin', response);
  gen.newPage('/modules/common/admin-header');
  gen.addVar('res_name', cookies['res_name']);
  gen.newPage('/modules/common/admin');
  if(postData == '' ){
    //GET Request
    //Load home page options
    //Get the list of bookings
    var fac_table = '<table><tr><th>Booking ID</th>';
    fac_table+='<th>Requester\'s Name</th>';
    fac_table+='<th>Booked Date</th>';
    fac_table+='<th>Booked Time</th>';
    fac_table+='<th>Booking Reason</th>';
    fac_table+='<th>Booking Committee</th>';
    fac_table+='<th>Options</th></tr>';

    mysql_driver.select_custom('*','fac_bookings',{'booking_status':1},{'fac_slots_id':'ASC','fac_time_slot':'ASC'}, function(err, respp){
      //console.log(err);
      //console.log(resp);
      /*
      var i = 0;
      while( i < resp.length ){
        var fac_row = '<tr><td>'+resp[i]['id']+'</td><td>'+resp[i]['booking_reason']+'</td>';
        fac_row+= '<td>'+resp[i]['booking_committee']+'</td>';
        fac_row+='<td><a href="/admin/fac/approve?id='+resp[i]['id']+'">Approve</a></td></tr>';
        fac_table+=fac_row;
        i++;
      }
      fac_table+='</table>';      
      gen.addVar('admin_content', fac_table);
      gen.generate();
      */
      async.mapSeries(respp,
        function(key, cb){
          var fac_row = '<tr><td>'+key['id']+'</td>';
          var booking_reason = '<td>'+key['booking_reason']+'</td>';
          var booking_committee = '<td>'+key['booking_committee']+'</td>';
          
          var fac_time_slot = key['fac_time_slot'];
          var fac_slots_id = key['fac_slots_id'];
          var user_id = key['user_id'];
          
          var booking_options = '<td><a href="/fac/booking/approve?id='+fac_slots_id+'">Approve</a>';
          booking_options += '<a href="/fac/booking/reject?id='+fac_slots_id+'">Reject</a></td>';
          //Get the User's Name, Date, Time
          async.waterfall([
            function(cbb){
              mysql_driver.select(Array('name'),'1415_members',{'id':user_id},
                function(err, resp){
                  var formatted = '<td>'+resp[0]['name']+'</td>';
                  cbb(null, formatted);
                });
            },
            function(arg1, cbb){
              mysql_driver.select(Array('booked_date'),'fac_time_slots',{'id':fac_slots_id},
                function(err, resp){
                  var raw_date = resp[0]['booked_date'];
                  //console.log(raw_date);
                  var booked_date = raw_date.toDateString();
                  var formatted = arg1+'<td>'+booked_date+'</td>';
                  
                  cbb(null, formatted);
                });
            },
            function(arg2, cbb){
              var tmpstr = fac_time_slot.substring(1);
              //console.log(tmpstr);
              mysql_driver.select(Array('stime'),'fac_slots',{'id':tmpstr},
                function(err, resp){
                  var formatted = arg2+'<td>'+resp[0]['stime']+'</td>';
                  
                  cbb(null, formatted);
                });
            }
          ],
          function(err, reply){
            fac_row+=reply;
            fac_row+=booking_reason;
            fac_row+=booking_committee;
            fac_row+=booking_options;
            cb(err, fac_row);
          });
        },
        function(err, result){

          var i = 0;
          while( i < result.length ){
            fac_table+=result[i];
            i++;
          }
          fac_table+='</table>';      
          gen.addVar('admin_content', fac_table);
          gen.generate();
        }
      );
    });    
  }
}
admin_bookings.prototype.reqCookie = ['res_matric','res_name','res_group'];
exports.admin_bookings = admin_bookings;
