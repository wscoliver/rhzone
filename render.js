/**
* Name: Blazing Node 
* Version: 1.0.0
* Module: render
* Description: Renders HTML output from our template files
**/

//Load Dependencies
var async = require('async')
var fs = require('fs')
var path = require('path')
//
/*-------------------------------------------------------------------
@name: build
@description: Used to build the inputs required for render
@params: none
-------------------------------------------------------------------*/
function build(template_name,response){
  this.setTemplate(template_name);
  this.setResponse(response);
  //Create the initial object
  var init_options = Array();
  this.setOutput(init_options);
}
build.prototype = {
  //Methods
/*-------------------------------------------------------------------
@name: newPage
@description: Used to add a new sub page
@params: [page_name]
-------------------------------------------------------------------*/
  newPage: function(page_name){
    var wk_obj = this.getOutput();
    wk_obj[page_name] = {};
    wk_obj[page_name]['vars'] = {};
    wk_obj[page_name]['tables'] = {};
    this.setPage(page_name);
    this.setOutput(wk_obj);
  },
  addVar: function(key, val){
    var wk_obj = this.getOutput();
    var page_name = this.getPage();
    wk_obj[page_name]['vars'][key] = val;
    this.setOutput(wk_obj);
  },
  addTable: function(tb_name,tb_id, tb_class, tb_headers, tb_data){
    var wk_obj = this.getOutput();
    var page_name = this.getPage(); 
    wk_obj[page_name]['tables'][tb_name] = {};
    wk_obj[page_name]['tables'][tb_name]['table_id'] = tb_id;
    wk_obj[page_name]['tables'][tb_name]['table_class'] = tb_class;
    wk_obj[page_name]['tables'][tb_name]['table_headers'] = tb_headers;
    wk_obj[page_name]['tables'][tb_name]['data'] = tb_data;
    this.setOutput(wk_obj);
  }, 
  generate: function(){
    var options = Array();
    options['mode'] = 'vanilla';
    options['data'] = {}
    options['data']['pages'] = this.getOutput();
    var ttolive = new render(this.getTemplate(), options, this.getResponse());
  },
  //Value Objects
  getPage: function(){ return this.template_page; },
  setPage: function(val) { this.template_page = val;},
  getOutput: function(){ return this.template_output; },
  setOutput: function(val) { this.template_output = val;},
  getResponse: function(){ return this.template_response; },
  setResponse: function(val) { this.template_response = val;},
  getTemplate: function(){ return this.template_name;},
  setTemplate: function(val) { this.template_name = val;}
}
/*-------------------------------------------------------------------
@name: render
@description: Used to return the response to the client.
@params: [template_name] [template_options] [http_response_obj]
-------------------------------------------------------------------*/
function render(template_name, options, response){
  this.setTemplate(template_name);
  this.setOptions(options);
  if(typeof(options) === 'object' && options['mode'] == 'vanilla'){
  
    this.generate(function(err, reply){
      if(err){
        console.log('Error: '+err);
      }
      else{
      //Successful rendering
      
      response.writeHead('200', {'Content-Type':'text/html'});
      response.write(reply);
      response.end();     
      
      //console.log('Response: '+reply);
      }
    });
  }
  if(typeof(options) === 'object' && options['mode'] == 'sample'){
    //Return a sample options object
    
  }
  
}
function render_obj() {}
render_obj.prototype={
  getQueue: function() { return this.block_queue;},
  setQueue: function(val) { this.block_queue = val;},
  getTray: function() { return this.block_tray;},
  setTray: function(val) { this.block_tray = val;},
  getContent: function(){ return this.template_content; },
  setContent: function(val){ this.template_content = val; },
  getPath: function(){ return this.template_path; },
  setPath: function(val){ this.template_path = val; },
  getOptions: function(){ return this.template_options; },
  setOptions: function(val){ this.template_options = val; },
  push_render: function(val){
    //get current queue
    var current_queue = this.getQueue();
    current_queue.push(val);
    this.setQueue(current_queue);
  },
  push_tray: function(val){
    //get current queue
    var current_tray = this.getTray();
    current_tray.push(val);
    this.setTray(current_tray);
    //console.log(this.getTray());
  },
  pull_layer: function(name, callback){

  }
}
render.prototype = {
  generate: function(maincall){
    //console.log('Generating...');
    this.hookin(this.getTemplate(),this.getOptions(), maincall);
  },
  hookin: function(file, options,callback){
    //Check if the template file exist.
    temp = new render_obj();
    temp.setOptions(options);
    //console.log('Hook in: '); 
    async.series([
      function(cb){
        var qpath = path.join(__dirname,file+'.html');
        //console.log(qpath);
        temp.setPath(qpath);
        fs.exists(qpath, function(bool){
          if(bool){
            //console.log('async 1');
            cb(null, bool);
          }else{
          //console.log(tray_arr);
          console.log(qpath);
          cb('File not found', bool);
          }
        });
         
      },
      function (cb){
        //Get the contents of the file.
        //console.log('getPath()...');
        //console.log(temp.getPath());
        fs.readFile(temp.getPath(), 'utf8', function(err, reply){
          if(err){ cb(err, null);}
          else{
          temp.setContent(reply);
          cb(null, 1);}
        });
      },
      function (cb){
        //Check tables
        //Save the working file into the local scope
        var work_file = temp.getContent();
        var tmp = new render_obj();
        var new_queue = new Array();
        var new_tray = new Array();
        tmp.setQueue(new_queue);
        tmp.setTray(new_tray);
        //Define the pattern
        var reg_exp=/%t%\s([\d\D]*?)\s\%t%/gi;
        var i=0;
        //Search for the pattern 
        while( res = reg_exp.exec(work_file) ){
          var str_match = res[0];
          //console.log('str_match: '+str_match);
          var str_val = res[1];
          //console.log('str_val: '+str_val);
          //Push the values
          //tmp.push_tray(str_match);
          tmp.push_render(str_val);
          i++;
        }
        if( i == 0 ){ cb(null, 1);} 
        else{
            var js_page = temp.getOptions().data.pages;
          //console.log(js_page);
          if( js_page.hasOwnProperty(file) ){
            //console.log('Page found...');
            var js_vars = js_page[file]['tables'];
            var var_arr = tmp.getQueue();
            var rep_arr = tmp.getTray();
                        async.mapSeries(var_arr, function(key, cb){
              if(js_vars.hasOwnProperty(key)){
                //Generate the table.
                var table_info = js_vars[key];
                var table_id = table_info['table_id'];
                var table_class = table_info['table_class'];
                var table_headers = table_info['table_headers'];
                var output = '<table';
                if( table_id != ''){
                  output+=' id="'+table_id+'"';
                }
                if( table_class != ''){
                  output+=' class="'+table_class+'"';
                }
                output+='> \n <tr>';
                for( i=0; i<table_headers.length; i++){
                  output+='<th>'+table_headers[i]+'</th>';
                }
                output+='</tr>';
                var table_data = table_info['data'];
                for( i=0; i<table_data.length; i++){
                  output+='\n <tr>';
                  for( a=0; a<table_headers.length; a++){
                    //var table_field = table_headers[a];
                    var table_field = a;
                    var cell_value = table_data[i]['row'][table_field];
                    output+='<td>'+cell_value+'</td>';
                  }
                  output+='</tr>';
                }
                output+='</table>';
                cb(null, output); 
                //cb(null, js_vars[key]);

              }else{
                cb('Error: variable table not found: '+key);
              }
            }, function(err, results){
              if(err){
                cb(err,1);
              }else{

                for(i=0;i<results.length;i++){
                  //var repl_val = rep_arr[i];
                  var repl_val = '%t% '+var_arr[i]+' %t%';
                  //console.log('to replace: '+repl_val);
                  var new_val = results[i];
                  //console.log('new value: '+new_val);
                  work_file = work_file.replace(repl_val, new_val);
                }
                temp.setContent(work_file);
                cb(null, work_file);
              }  
            });
          }else{
            cb('Missing [table] for page: '+file, 0);
          }   
        }
      },

      function (cb){
        //Check for variables
        //Save the working file into the local scope
        var work_file = temp.getContent();
        var tmp = new render_obj();
        var new_queue = new Array();
        var new_tray = new Array();
        tmp.setQueue(new_queue);
        tmp.setTray(new_tray);
        //Define the pattern
        var reg_exp=/%v%\s([\d\D]*?)\s\%v%/gi;
        var i=0;
        //Search for the pattern 
        while( res = reg_exp.exec(work_file) ){
          var str_match = res[0];
          //console.log('str_match: '+str_match);
          var str_val = res[1];
          //console.log('str_val: '+str_val);
          //Push the values
          //tmp.push_tray(str_match);
          tmp.push_render(str_val);
          i++;
        }
        if( i == 0 ){ cb(null, 1);} 
        else{
            var js_page = temp.getOptions().data.pages;
          //console.log(js_page);
          if( js_page.hasOwnProperty(file) ){
            //console.log('Page found...');
            var js_vars = js_page[file]['vars'];
            var var_arr = tmp.getQueue();
            var rep_arr = tmp.getTray();
                        async.mapSeries(var_arr, function(key, cb){
              if(js_vars.hasOwnProperty(key)){
                cb(null, js_vars[key]);
              }else{
                cb('Error: variable key not found: '+key);
              }
            }, function(err, results){
              if(err){
                cb(err,1);
              }else{

                for(i=0;i<results.length;i++){
                  //var repl_val = rep_arr[i];
                  var repl_val = '%v% '+var_arr[i]+' %v%';
                  //console.log('to replace: '+repl_val);
                  var new_val = results[i];
                  //console.log('new value: '+new_val);
                  work_file = work_file.replace(repl_val, new_val);
                }
                temp.setContent(work_file);
                cb(null, work_file);
              }  
            });
          }else{
            cb('Missing [var] for page: '+file, 0);
          }   
        }
      },
      function (cb){
        //Check for deeper layers
        var new_queue = new Array();
        temp.setQueue(new_queue);        
        var new_tray = new Array();
        temp.setTray(new_tray);
 
        var reg_exp=/%b%\s([\d\D]*?)\s\%b%/gi;
        var i = 0;
        var work_file = temp.getContent();
        while( res = reg_exp.exec(temp.getContent()) ){
          //console.log('Index [0] of res: '+res[0]);
          var str_match = res[0];
          var block_name = res[1];
          temp.push_tray(str_match);
          temp.push_render(block_name);
          i++;
          };
        if( i == 0 ){
          cb(null, work_file);
        }
        else{
          var block_arr = temp.getQueue();
          var tray_arr = temp.getTray();
          async.mapSeries(block_arr, function(file, cb){
              var render_child = new render('a','a','a');
              render_child.hookin(file,options, cb);
            }, function(err, results){
            if(err){
              console.log('Error: '+err);
              cb(err,1);
            }else{
              //console.log('Results...');
              //console.log(results);
              for(i=0;i<results.length;i++){
                var tray_val = tray_arr[i];
                var res = results[i];
                work_file = work_file.replace(tray_val, res);
                //temp.setContent(temp.getContent().replace(temp.getTray()[i], results[i]));
                //cb(null, temp.getContent());
              }
              cb(null, work_file);
            }
          });
        }
      }  
      
    ],
    function(err, replies){
      if(err){
        callback(err, null);
      }
      

else{
        //console.log('success');
        var html_output = replies[4];
        //console.log('HTML...');
        //console.log(html_output);
        callback(null, html_output);
      }

    });
  },
  getTemplate: function(){ return this.template_name; },
  setTemplate: function(val){ this.template_name = val; },
  getOptions: function(){ return this.template_options; },
  setOptions: function(val){ this.template_options = val; } 
}
var options = Array();
/*
options['mode'] = 'vanilla';
var sample_data = {
  pages: {
    sidebar: {
      vars: {
        user_name: 'licera',
        user_level: '72',
      },
    },
    content: {
      tables: {
        account_info: {
          table_id: 'some_id',
          table_class: 'some_class',
          table_headers: ['id','user_name','user_email'],
          data: [{id: 1,user_name: 'licera', user_email: 'licera@gmail.com'}
                ,{id: 2,user_name: 'hao', user_email: 'hao@gmail.com'}
                ,{id: 3,user_name: 'jon', user_email: 'jon@gmail.com'}

          ]
        }
      }

  }
}
options['data'] = sample_data;
var rendertest = new render('test',options,'test');
*/
/*
var buildobj = new build('test','test');
buildobj.newPage('sidebar');
buildobj.addVar('myname','licera');
buildobj.addVar('user_level', 72);
buildobj.newPage('content');
var table_data = Array(
//  {id: 1, user_name: 'licera', user_email: 'licera@gmail,com'},
//  {id: 2, user_name: 'hao', user_email: 'hao@gmail.com'}
  { row: Array(1,'licera','licera@gmail,com')},
  { row: Array(2, 'hao', 'hao@gmail.com')}
);
buildobj.addTable('account_info','some_id','some_class',Array('id','user_name','user_email'), table_data);
buildobj.generate();
*/
exports.render = build;

