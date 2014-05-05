var test = require("tap").test;
var fs = require('fs');
var common = require("../lib/common");
var extend = require('util')._extend;

certificate = process.env.CERIFICATE || 1;


/* https://github.com/membase/ns_server/blob/master/src/menelaus_web.erl
  
'DELETE' ->
                     case PathTokens of
                         ["pools", "default", "buckets", Id] ->
                             {auth_check_bucket_uuid,
                              fun menelaus_web_buckets:handle_bucket_delete/3, ["default", Id]};
                         ["pools", "default", "remoteClusters", Id] ->
                             {auth, fun menelaus_web_remote_clusters:handle_remote_cluster_delete/2, [Id]};
                         ["pools", "default", "buckets", Id, "docs", DocId] ->
                             {auth, fun menelaus_web_crud:handle_delete/3, [Id, DocId]};
                         ["controller", "cancelXCDR", XID] ->
                             {auth, fun menelaus_web_xdc_replications:handle_cancel_replication/2, [XID]};
                         ["controller", "cancelXDCR", XID] ->
                             {auth, fun menelaus_web_xdc_replications:handle_cancel_replication/2, [XID]};
                         ["settings", "readOnlyUser"] ->
                             {auth, fun handle_read_only_user_delete/1};
                         ["nodes", Node, "resources", LocationPath] ->
                             {auth, fun handle_resource_delete/3, [Node, LocationPath]};
                         ["pools", "default", "serverGroups", GroupUUID] ->
                             {auth, fun menelaus_web_groups:handle_server_group_delete/2, [GroupUUID]};
                         ["couchBase" | _] -> {done, capi_http_proxy:handle_proxy_req(Req)};
                         _ ->
                             ?MENELAUS_WEB_LOG(0002, "Invalid delete received: ~p as ~p", [Req, PathTokens]),
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
