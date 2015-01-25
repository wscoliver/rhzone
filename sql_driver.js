/********************************************************************
@package common
@name sql_driver
@purpose To make sql queries shorter and easier to use.
@author Oliver Wee
@email wscoliver@gmail.com
@updated 2/1/2015
********************************************************************/
//Include the necessary files.
var mysql = require('mysql');

function sql_driver(){
  
  var connection = mysql.createConnection({
  host: 'localhost',
  user : 'rzone_admin',
  password: 'CEyBj4P54QRv2UeJ',
  database: 'rzone'
});
//Connect to the Database
  connection.connect();
  this.setConn(connection);
}
sql_driver.prototype = {
  constructor: sql_driver,
/********************************************************************
  Select Statement
********************************************************************/
  select: function(columns,table, conditions, callback){
//Load default values if null
    columns = typeof columns != 'undefined' ?columns: '*';
    conditions = typeof conditions != 'undefined' ?conditions: ' ';
//Form the statement
    var query = 'SELECT ';
    
    if(typeof columns == 'object' && columns!='*' && columns!=null){
      var i = 0;
      while( i < columns.length){
        if(i == 0){
          query+=columns[i];
        }else{
          query+=','+columns[i];
        }
       i++;
      }
    }else{
      query+='* ';
    }
    query+=' FROM '+table;
    if(typeof conditions == 'object' && conditions!=null){
//Use the WHERE CLAUSE , AND
      var i=0;
      for (var k in conditions){
        if(conditions.hasOwnProperty(k)){
          if(i==0){
            query+=' WHERE '+k+'=';
//Check type of value
            var val = typeof(conditions[k]) == 'number' ? conditions[k] : "'"+conditions[k]+"'";
            query+=val;
          }else{
            query+=' AND '+k+'=';
            var val = typeof(conditions[k]) == 'number' ? conditions[k] : "'"+conditions[k]+"'";
            query+=val;
          }
          i++;
        } 
      }
    }
   
    //console.log(query);
    this.getConn().query(query,function(err,rows,fields){
      if(err){ callback(err,0);}
        callback(null, rows);
      //console.log(rows);
 
    });
    //this.getConn().end();
  },

/********************************************************************
  Select Custom Statement
********************************************************************/
  select_custom: function(columns,table, conditions, orderby, callback){
//Load default values if null
    columns = typeof columns != 'undefined' ?columns: '*';
    conditions = typeof conditions != 'undefined' ?conditions: ' ';
//Form the statement
    var query = 'SELECT ';
    
    if(typeof columns == 'object' && columns!='*' && columns!=null){
      var i = 0;
      while( i < columns.length){
        if(i == 0){
          query+=columns[i];
        }else{
          query+=','+columns[i];
        }
       i++;
      }
    }else{
      query+='* ';
    }
    query+=' FROM '+table;
    if(typeof conditions == 'object' && conditions!=null){
//Use the WHERE CLAUSE , AND
      var i=0;
      for (var k in conditions){
        if(conditions.hasOwnProperty(k)){
          if(i==0){
            query+=' WHERE '+k+'=';
//Check type of value
            var val = typeof(conditions[k]) == 'number' ? conditions[k] : "'"+conditions[k]+"'";
            query+=val;
          }else{
            query+=' AND '+k+'=';
            var val = typeof(conditions[k]) == 'number' ? conditions[k] : "'"+conditions[k]+"'";
            query+=val;
          }
          i++;
        } 
      }
    }
   
    if(typeof orderby == 'object' && orderby!=null){
//Use the WHERE CLAUSE , AND
      var i=0;
      for (var k in orderby){
        if(orderby.hasOwnProperty(k)){
          if(i==0){
            query+=' ORDER BY '+k+' '+orderby[k];
          }else{
            query+=' , '+k+' '+orderby[k];
          }
          i++;
        } 
      }
    }
    //console.log(query);
    this.getConn().query(query,function(err,rows,fields){
      if(err){ callback(err,0);}
        callback(null, rows);
      //console.log(rows);
 
    });
    //this.getConn().end();
  },
/********************************************************************
  Update Statement
********************************************************************/
  update: function(columns,table, conditions, callback){
    var update_id = '';
//Load default values if null
    columns = typeof columns != 'undefined' ?columns: '*';
    conditions = typeof conditions != 'undefined' ?conditions: ' ';
//Form the statement
    var query = 'UPDATE '+table+' SET ';
    
    if(typeof columns == 'object' && columns!=null){
//Use the WHERE CLAUSE , AND
      var i=0;
      for (var k in columns){
        if(columns.hasOwnProperty(k)){
          if(i==0){
            query+=k+'=';
//Check type of value
            var val = typeof(columns[k]) == 'number' ? columns[k] : "'"+columns[k]+"'";
            query+=val;
          }else{
            query+=' , '+k+'=';
            var val = typeof(columns[k]) == 'number' ? columns[k] : "'"+columns[k]+"'";
            query+=val;
          }
          i++;
        } 
      }
    }
    
    if(typeof conditions == 'object' && conditions!=null){
//Use the WHERE CLAUSE , AND
      var i=0;
      for (var k in conditions){
        if(conditions.hasOwnProperty(k)){
          if(i==0){
            query+=' WHERE '+k+'=';
//Check type of value
            update_id = conditions[k];
            var val = typeof(conditions[k]) == 'number' ? conditions[k] : "'"+conditions[k]+"'";
            query+=val;
          }else{
            query+=' AND '+k+'=';
            var val = typeof(conditions[k]) == 'number' ? conditions[k] : "'"+conditions[k]+"'";
            query+=val;
          }
          i++;
        } 
      }
    }
   
    //console.log(query);
    
    this.getConn().query(query,function(err,rows,fields){
      if(err){ callback(err, null);}
      //console.log(rows);
      callback(null, update_id);
    });
    //this.getConn().end();
    
  },

/********************************************************************
  Insert Statement
********************************************************************/
  insert: function(postObj,table, callback){
    var query = 'INSERT INTO '+table;
    var cols = '(';
    var vals = '(';
    var i=0;
    var columns = Array();
    //Format the postObj
    var prop_list = Object.getOwnPropertyNames(postObj).sort();
    var i = 0;
    while( i < prop_list.length){
      var prop_name = prop_list[i];
      var col_name = prop_name.substring(3);
      columns[col_name] = postObj[prop_name]; 
      i++;
    }
    var i =0;
    for ( var k in columns){
        if(columns.hasOwnProperty(k)){
          if( k != 'gth'){

            //Check type of value
            if(i==0){
              cols+=k;
              var val = typeof(columns[k]) == 'number' ? columns[k] : "'"+columns[k]+"'";
              vals+=val;
            }else{
              cols+=', '+k;
              var val = typeof(columns[k]) == 'number' ? columns[k] : "'"+columns[k]+"'";
              vals+=','+val;
            }
          }
          i++;
        } 
    } 
    cols+=')';
    vals+=')';
    query+=' '+cols+' VALUES '+vals;
    
    //console.log(query);
    this.getConn().query(query,function(err,rows,fields){
      if(err){ 
        console.log(err);
        callback(err,null);}else{
        //console.log(rows);
        callback(null, rows['insertId']);
      }
 
    });
  },

/********************************************************************
  Delete Statement
********************************************************************/
  sdelete: function(table, conditions, callback){
//Load default values if null
    conditions = typeof conditions != 'undefined' ?conditions: ' ';
//Form the statement
    var query = 'DELETE FROM '+table;
    
    
    if(typeof conditions == 'object' && conditions!=null){
//Use the WHERE CLAUSE , AND
      var i=0;
      for (var k in conditions){
        if(conditions.hasOwnProperty(k)){
          if(i==0){
            query+=' WHERE '+k+'=';
//Check type of value
            var val = typeof(conditions[k]) == 'number' ? conditions[k] : "'"+conditions[k]+"'";
            query+=val;
          }else{
            query+=' AND '+k+'=';
            var val = typeof(conditions[k]) == 'number' ? conditions[k] : "'"+conditions[k]+"'";
            query+=val;
          }
          i++;
        } 
      }
    }
   
    //console.log(query);
    this.getConn().query(query,function(err,rows,fields){
      if(err){ callback(err, null);}
      //console.log(rows);
      callback(null, 1);
 
    });
  },
/********************************************************************
  SQL Administration Helpers

********************************************************************/

/********************************************************************
  Create New Form for Entry into Target Table
********************************************************************/
  adm_insert: function(table, exceptions,page_link, cbfn){
    //console.log('page link is: ');
    //console.log(page_link);
    var output = "<form action='"+page_link+"' method='POST'>";
    output+="<table>";
    var query = 'DESCRIBE '+table;
    this.getConn().query(query, function(err, rows, fields){
      var i = 0;
      while (i <  rows.length) {
        //Check if the field is in the exceptions
        var table_field = rows[i]['Field'];
        if(exceptions.indexOf(table_field)==-1){
          //Field not in the exceptions
          //console.log(table_field);
          output+="<tr><td>"+table_field+"</td><td><input type='text' name='fm_"+table_field+"'/></td></tr>";
        }
        i++;
      }
      output+="<tr><td><input type='submit' value='New'/></td><td></td></tr>";
      output+="</table></form>";
      cbfn(null, output);
    });
  },

/********************************************************************
  Update a Single Entry in the Target Table
********************************************************************/
  adm_update: function(table, exceptions, criteria, page_link,cbfn){
    //First describe the data 
    var output = "<form action='"+page_link+"' method='POST'>";
    output+="<table>";
    var query = 'DESCRIBE '+table;
    this.getConn().query(query, function(err, rows, fields){
      var i = 0;
      var selected_rows = Array();
      while (i <  rows.length) {
        //Check if the field is in the exceptions
        var table_field = rows[i]['Field'];
        if(exceptions.indexOf(table_field)==-1){
          //Field not in the exceptions
          //console.log(table_field);
          selected_rows.push(table_field);
        
        }
        i++;
      }
      //select the Data
      var mysql_driver = new sql_driver(); 
      mysql_driver.select(selected_rows, table, criteria, function(err, rows){
        var data_row = rows[0];
        for (k in data_row){
          output+="<tr><td>"+k+"</td><td><input type='text' name='fm_"+k+"' value='"+data_row[k]+"'/></td></tr>";
        }
      output+="<tr><td><input type='submit' value='Update'/></td><td></td></tr>";
      output+="</table></form>";
      cbfn(null, output);
      });
    });
  },

/********************************************************************
  View all the entries in table
********************************************************************/
  adm_browse: function(table, exceptions, criteria, range,page_link,cbfn){

    //First describe the data 
    var output = "";
    output+="<table>";
    var query = 'DESCRIBE '+table;
    this.getConn().query(query, function(err, rows, fields){
      var i = 0;
      var selected_rows = Array();
      output+="<tr>";
      while (i <  rows.length) {
        //Check if the field is in the exceptions
        var table_field = rows[i]['Field'];
        if(exceptions.indexOf(table_field)==-1){
          //Field not in the exceptions
          //console.log(table_field);
          selected_rows.push(table_field);
          output+="<th>"+table_field+"</th>";
        }
        i++;
      }
      output+="<th>Options</th></tr>";
      //select the Data
      var mysql_driver = new sql_driver(); 
      mysql_driver.select(selected_rows, table, criteria, function(err, rows){
        var i =0;
        var start_row = (range-1)*50;
        var end_row = (range)*50;
        while(i < rows.length ){
          if( i <= end_row && i >=start_row ){
            var data_row = rows[i];
            output+="<tr>";
            for (k in data_row){
              output+="<td>"+data_row[k]+"</td>";
            }
            output+="<td><a href='/user/update?matric="+data_row['matric']+"'>Edit</a><a href='/user/remove?matric="+data_row['matric']+"'>Remove</a></td></tr>";
          }
          i++;
        }
      //Page Navigation
      var page_nav = '';
      var max_pages = Math.ceil(rows.length / 50);
      console.log(range);
      switch( range ){
        case 1:
          page_nav = "<a href='/user/browse?page="+(range+1)+"'>Next</a><a href='/user/browse?page="+max_pages+"'/>End</a>";
        break;

        default:
          page_nav = "<a href='/user/browse'>First</a><a href='/user/browse?page="+(range-1)+"'/>Previous</a>";
          page_nav+= "<a href='/user/browse?page="+(Number(range)+1)+"'>Next</a><a href='/user/browse?page="+max_pages+"'/>End</a>";
        break;
      }
      if ( range == max_pages ){

          page_nav = "<a href='/user/browse'>First</a><a href='/user/browse?page="+(range-1)+"'/>Previous</a>";
      }
      //
      output+="<tr><td>Showing Results</td><td>"+start_row+"-"+end_row+"</td><td>"+page_nav+"Page :"+range+" out of "+max_pages+"</td><td>Results found</td><td>"+rows.length+"</td></tr>";
      output+="</table>";
      cbfn(null, output);
      });
    });

  },
/********************************************************************
  Helper Function:  
  @name: validate_form
  @purpose: check if all the form's inputs are filled and valid
********************************************************************/
  validate_form: function(table, exceptions, postObj, cbfn){

    var query = 'DESCRIBE '+table;
    this.getConn().query(query, function(err, rows, fields){
      var i = 0;
      var selected_rows = Array();
      while (i <  rows.length) {
        //Check if the field is in the exceptions
        var table_field = rows[i]['Field'];
        if(exceptions.indexOf(table_field)==-1){
          selected_rows.push(table_field);
        }
        i++;
      }
      var prop_list = Object.getOwnPropertyNames(postObj).sort();
      //console.log(prop_list.length);
      //console.log(selected_rows.length);
      if( selected_rows.length != prop_list.length){
        cbfn('Not all fields are met', null);
      }
      var i=0;
      while( i < prop_list.length ){
        var needle = prop_list[i].substring(3);
      
        if( selected_rows.indexOf(needle) == -1){
          cbfn('Fields incorrectly named', null);
          console.log('Needle is: '+needle);
        }
        i++;
      }
      cbfn(null, 1);
    });

  },
//Getters and Setters
  getConn: function(){ return this.conn;},
  setConn: function(val){ this.conn = val}  
}




var mysql_driver = new sql_driver();
//mysql_driver.select(Array('matric','password'),'1415_members',{'matric':'A0094621E'}, function(err, res){ console.log(res);});
//mysql_driver.update({'password':12345},'1415_members',{'matric':'A0094621E'},function(err,res){console.log(res);});
//mysql_driver.insert({'matric':'A0094621E','password':'12346'},'1415_members', function(err, res){console.log(res);});
//mysql_driver.sdelete('1415_members',{'matric':'A0094621E','password':'12345'}, function(err,res){console.log(res);});
//mysql_driver.adm_insert('1415_members', Array('id'),'/', function(err,resp){ console.log(resp);});
//mysql_driver.adm_update('1415_members', Array('id','passwd_salt','password'),{'matric':'A0094622E'},'/', function(err,resp){ console.log(resp);});
//mysql_driver.adm_browse('1415_members', Array('id'),{'type':2},Array(0,100),'/',function(err,resp){ console.log(resp);});
exports.sql_driver = sql_driver;

