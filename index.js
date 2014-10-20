/*-------------------------------------------------------------------
@project Raffles Hall Zone
@author Oliver Wee, RH Web Application Developers (WASD), 2014
@description Application file for Raffles Hall Zone
-------------------------------------------------------------------*/

//Load the required modules 
var server = require('./server');
var router = require('./router');
var handler_common = require('./modules/common/request_handler.js');

var handle={};
//Common Modules
handle['/'] = handler_common.index;
handle['/login'] = handler_common.login;
handle['/logout'] = handler_common.logout;

server.start(handle, router.route);

