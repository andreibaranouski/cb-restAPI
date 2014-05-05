var test = require("tap").test;
var fs = require('fs');
var common = require("../lib/common");
var extend = require('util')._extend;

certificate = process.env.CERIFICATE || 1;


/* https://github.com/membase/ns_server/blob/master/src/menelaus_web.erl
  
                 'PUT' = Method ->
                     case PathTokens of
                         ["settings", "readOnlyUser"] ->
                             {auth, fun handle_read_only_user_reset/1};
                         ["pools", "default", "serverGroups"] ->
                             {auth, fun menelaus_web_groups:handle_server_groups_put/1};
                         ["pools", "default", "serverGroups", GroupUUID] ->
                             {auth, fun menelaus_web_groups:handle_server_group_update/2, [GroupUUID]};
                         ["couchBase" | _] -> {done, capi_http_proxy:handle_proxy_req(Req)};
                         _ ->
                             ?MENELAUS_WEB_LOG(0003, "Invalid ~p received: ~p", [Method, Req]),
                             {done, Req:respond({405, add_header(), "Method Not Allowed"})} 
*/


var request_options = {
	    host: 'localhost',
	};


	if (certificate) {
	    request_options.ca = [fs.readFileSync('../cacert.pem')];
	    protocol = require('https');
	    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
	    request_options.agent = false;
	    request_options.port = 18091;
	} else {
	    protocol = require('http');
	    request_options.port = 8091;
	    //	request_options.agent = false;
	}
