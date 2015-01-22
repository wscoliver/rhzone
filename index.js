/*-------------------------------------------------------------------
@project Raffles Hall Zone
@author Oliver Wee, RH Web Application Developers (WASD), 2014
@description Application file for Raffles Hall Zone
-------------------------------------------------------------------*/

//Load the required modules 
var server = require('./server');
var router = require('./router');
var handler_common = require('./modules/common/request_handler.js');
var handler_fac = require('./modules/fac/request_handler.js');
var handle={};
//Common Modules
handle['/'] = handler_common.index;
handle['/login'] = handler_common.login;
handle['/logout'] = handler_common.logout;
//User Modules
handle['/user/register'] = handler_common.user_register;
handle['/user/update'] = handler_common.user_update;
handle['/user/remove'] = handler_common.user_remove;
handle['/user/browse'] = handler_common.user_browse;
handle['/user/changepassword'] = handler_common.user_change_password;

//Faciltiy Booking Modules
//Admin Functions
handle['/admin/fac/register'] = handler_fac.admin_register;
handle['/admin/fac/update'] = handler_fac.admin_update;
handle['/admin/fac/remove'] = handler_fac.admin_remove;
handle['/admin/fac/browse'] = handler_fac.admin_browse;


//User Functions

handle['/fac/view'] = handler_fac.user_view;
handle['/fac/book'] = handler_fac.user_book;
handle['/fac/cancel'] = handler_fac.user_cancel;
handle['/fac/history'] = handler_fac.user_history;

server.start(handle, router.route);

