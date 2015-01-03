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
  user : 'root',
  password: 'T7dk6tiu91!',
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
  Update Statement
********************************************************************/
  update: function(columns,table, conditions, callback){
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
    //this.getConn().end();
    
  },

/********************************************************************
  Insert Statement
********************************************************************/
  insert: function(columns,table, callback){
    var query = 'INSERT INTO '+table;
    var cols = '(';
    var vals = '(';
    var i=0;
    for ( var k in columns){
        if(columns.hasOwnProperty(k)){
          if(i==0){
            cols+=k;
//Check type of value
            var val = typeof(columns[k]) == 'number' ? columns[k] : "'"+columns[k]+"'";
            vals+=val;
          }else{
            cols+=', '+k;
            var val = typeof(columns[k]) == 'number' ? columns[k] : "'"+columns[k]+"'";
            vals+=','+val;
          }
          i++;
        } 
    } 
    cols+=')';
    vals+=')';
    query+=' '+cols+' VALUES '+vals;
    //console.log(query);
    this.getConn().query(query,function(err,rows,fields){
      if(err){ callback(err,null);}
      //console.log(rows);
      callback(null, 1);
 
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
//Getters and Setters
  getConn: function(){ return this.conn;},
  setConn: function(val){ this.conn = val}  
}

var mysql_driver = new sql_driver();
//mysql_driver.select(Array('matric','password'),'1415_members',{'matric':'A0094621E'}, function(err, res){ console.log(res);});
//mysql_driver.update({'password':12345},'1415_members',{'matric':'A0094621E'},function(err,res){console.log(res);});
//mysql_driver.insert({'matric':'A0094621E','password':'12346'},'1415_members', function(err, res){console.log(res);});
//mysql_driver.sdelete('1415_members',{'matric':'A0094621E','password':'12345'}, function(err,res){console.log(res);});
exports.sql_driver = sql_driver;

