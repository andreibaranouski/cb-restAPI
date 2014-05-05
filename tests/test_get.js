var test = require("tap").test;
var fs = require('fs');
var common = require("../lib/common");
var extend = require('util')._extend;

certificate = process.env.CERIFICATE || 0;



/* https://github.com/membase/ns_server/blob/master/src/menelaus_web.erl
 
    Method when Method =:= 'GET'; Method =:= 'HEAD' ->
 
                         D[] ->
                             {done, redirect_permanently("/index.html", Req)};
                         D["versions"] ->
                             {done, handle_versions(Req)};
                         D["pools"] ->
                             {auth_any_bucket, fun handle_pools/1};
                         D["pools", "default"] ->
                             {auth_any_bucket, fun check_and_handle_pool_info/2, ["default"]};
                         %% NOTE: see MB-10859. Our docs used to
                         %% recommend doing this which due to old
                         %% code's leniency worked just like
                         %% /pools/default. So temporarily we allow
                         %% /pools/nodes to be alias for
                         %% /pools/default
                         D["pools", "nodes"] ->
                             {auth_any_bucket, fun check_and_handle_pool_info/2, ["default"]};
                         D["pools", "default", "overviewStats"] ->
                             {auth_ro, fun menelaus_stats:handle_overview_stats/2, ["default"]};
                         D["poolsStreaming", "default"] ->
                             {auth_any_bucket, fun handle_pool_info_streaming/2, ["default"]};
                         D["pools", "default", "buckets"] ->
                             {auth_any_bucket, fun menelaus_web_buckets:handle_bucket_list/1, []};
                         D["pools", "default", "saslBucketsStreaming"] ->
                             {auth_special, fun menelaus_web_buckets:handle_sasl_buckets_streaming/2,
                              ["default"]};
                         D["pools", "default", "buckets", Id] ->
                             {auth_bucket, fun menelaus_web_buckets:handle_bucket_info/3,
                              ["default", Id]};
                         D["pools", "default", "bucketsStreaming", Id] ->
                             {auth_bucket, fun menelaus_web_buckets:handle_bucket_info_streaming/3,
                              ["default", Id]};
                         D["pools", "default", "buckets", Id, "ddocs"] ->
                             {auth_bucket, fun menelaus_web_buckets:handle_ddocs_list/3, ["default", Id]};
                         D["pools", "default", "buckets", Id, "docs"] ->
                             {auth, fun menelaus_web_crud:handle_list/2, [Id]};
                         D["pools", "default", "buckets", Id, "docs", DocId] ->
                             {auth, fun menelaus_web_crud:handle_get/3, [Id, DocId]};
                         D["pools", "default", "buckets", Id, "stats"] ->
                             {auth_bucket, fun menelaus_stats:handle_bucket_stats/3,
                              ["default", Id]};
                         D["pools", "default", "buckets", Id, "localRandomKey"] ->
                             {auth_bucket, fun menelaus_web_buckets:handle_local_random_key/3,
                              ["default", Id]};
                         D["pools", "default", "buckets", Id, "statsDirectory"] ->
                             {auth_bucket, fun menelaus_stats:serve_stats_directory/3,
                              ["default", Id]};
                         D["pools", "default", "b", BucketName] ->
                             {auth_bucket, fun serve_short_bucket_info/3,
                              ["default", BucketName]};
                         D["pools", "default", "bs", BucketName] ->
                             {auth_bucket, fun serve_streaming_short_bucket_info/3,
                              ["default", BucketName]};
                         %% GET /pools/{PoolId}/buckets/{Id}/nodes
                         D["pools", "default", "buckets", Id, "nodes"] ->
                             {auth_bucket, fun handle_bucket_node_list/3,
                              ["default", Id]};
                         %% GET /pools/{PoolId}/buckets/{Id}/nodes/{NodeId}
                         D["pools", "default", "buckets", Id, "nodes", NodeId] ->
                             {auth_bucket, fun handle_bucket_node_info/4,
                              ["default", Id, NodeId]};
                         %% GET /pools/{PoolId}/buckets/{Id}/nodes/{NodeId}/stats
                         D["pools", "default", "buckets", Id, "nodes", NodeId, "stats"] ->
                             {auth_bucket, fun menelaus_stats:handle_bucket_node_stats/4,
                              ["default", Id, NodeId]};
                         %% GET /pools/{PoolId}/buckets/{Id}/stats/{StatName}
                         D["pools", "default", "buckets", Id, "stats", StatName] ->
                             {auth_bucket, fun menelaus_stats:handle_specific_stat_for_buckets/4,
                              ["default", Id, StatName]};
                         DQ["pools", "default", "buckets", Id, "recoveryStatus"] ->
                             {auth, fun menelaus_web_recovery:handle_recovery_status/3,
                              ["default", Id]};
                         D["pools", "default", "remoteClusters"] ->
                             {auth_ro, fun menelaus_web_remote_clusters:handle_remote_clusters/1};
                         D["pools", "default", "serverGroups"] ->
                             {auth_ro, fun menelaus_web_groups:handle_server_groups/1};
                         D["pools", "default", "certificate"] ->
                             {done, handle_cluster_certificate(Req)};
                         D["nodeStatuses"] ->
                             {auth_ro, fun handle_node_statuses/1};
                         D["logs"] ->
                             {auth_ro, fun menelaus_alert:handle_logs/1};
                         D["alerts"] ->
                             {auth_ro, fun menelaus_alert:handle_alerts/1};
                         D["settings", "web"] ->
                             {auth_ro, fun handle_settings_web/1};
                         D["settings", "alerts"] ->
                             {auth_ro, fun handle_settings_alerts/1};
                         D["settings", "stats"] ->
                             {auth_ro, fun handle_settings_stats/1};
                         D["settings", "autoFailover"] ->
                             {auth_ro, fun handle_settings_auto_failover/1};
                         D["settings", "maxParallelIndexers"] ->
                             {auth_ro, fun handle_settings_max_parallel_indexers/1};
                         D["settings", "viewUpdateDaemon"] ->
                             {auth_ro, fun handle_settings_view_update_daemon/1};
                         D["settings", "autoCompaction"] ->
                             {auth_ro, fun handle_settings_auto_compaction/1};
                         D["settings", "readOnlyAdminName"] ->
                             {auth_ro, fun handle_settings_read_only_admin_name/1};
                         D["settings", "replications"] ->
                             {auth_ro, fun menelaus_web_xdc_replications:handle_global_replication_settings/1};
                         D["settings", "replications", XID] ->
                             {auth_ro, fun menelaus_web_xdc_replications:handle_replication_settings/2, [XID]};
                         D["internalSettings"] ->
                             {auth, fun handle_internal_settings/1};
                         D["internalSettings", "visual"] ->
                             {auth_ro, fun handle_visual_internal_settings/1};
                         D["nodes", NodeId] ->
                             {auth_ro, fun handle_node/2, [NodeId]};
                         D["nodes", "self", "xdcrSSLPorts"] ->
                             {done, handle_node_self_xdcr_ssl_ports(Req)};
                         DC["diag"] ->
                             {auth_special, fun diag_handler:handle_diag/1, []};
                         D["diag", "vbuckets"] -> {auth, fun handle_diag_vbuckets/1};
                         D["diag", "masterEvents"] -> {auth, fun handle_diag_master_events/1};
                         D["pools", "default", "rebalanceProgress"] ->
                             {auth_ro, fun handle_rebalance_progress/2, ["default"]};
                         D["pools", "default", "tasks"] ->
                             {auth_ro, fun handle_tasks/2, ["default"]};
                         D["index.html"] ->
                             {done, serve_static_file(Req, {AppRoot, Path},
                                                      "text/html; charset=utf8",
                                                      [{"Pragma", "no-cache"},
                                                       {"Cache-Control", "must-revalidate"}])};
                         ["docs" | _PRem ] ->
                             DocFile = string:sub_string(Path, 6),
                             {done, Req:serve_file(DocFile, DocRoot)};
                         D["dot", Bucket] ->
                             {auth, fun handle_dot/2, [Bucket]};
                         D["dotsvg", Bucket] ->
                             {auth, fun handle_dotsvg/2, [Bucket]};
                         D["sasl_logs"] ->
                             {auth, fun diag_handler:handle_sasl_logs/1, []};
                         ["sasl_logs", LogName] ->
                             {auth, fun diag_handler:handle_sasl_logs/2, [LogName]};
                         ["erlwsh" | _] ->
                             {auth, fun (R) -> erlwsh_web:loop(R, erlwsh_deps:local_path(["priv", "www"])) end, []};
                         ["images" | _] ->
                             {done, Req:serve_file(Path, AppRoot,
                                                   [{"Cache-Control", "max-age=30000000"}])};
                         ["couchBase" | _] -> {done, capi_http_proxy:handle_proxy_req(Req)};
                         D["sampleBuckets"] -> {auth_ro, fun handle_sample_buckets/1};
                         _ ->
                             {done, Req:serve_file(Path, AppRoot,
                                                   [{"Cache-Control", "max-age=10"}])} 
 */

var request_options = {
    host: 'localhost',
};


if (certificate) {
    request_options.ca = [fs.readFileSync('./cacert.pem')];
    protocol = require('https');
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    request_options.agent = false;
    request_options.port = 18091;
} else {
    protocol = require('http');
    request_options.port = 8091;
    //	request_options.agent = false;
}


test("GET 301", function (t) {
    paths = ["/"];

    common.sendRequests(t, paths, request_options, 301, false, function () {

    });
});


test("GET 301 with Auth", function (t) {
    options = extend({}, request_options);
    options.auth = "Administrator:password";

    paths = ["/"];

    common.sendRequests(t, paths, options, 301, false, function () {

    });
});



test("GET 200", function (t) {

    paths = ["/versions", //["versions"] ->
        "/pools", //["pools"] ->
        "/pools/default", //["pools", "default"] ->
        "/pools/nodes", //["pools", "nodes"] ->
        "/pools/default/buckets", //["pools", "default", "buckets"] ->
        "/pools/default/buckets/default", //["pools", "default", "buckets", Id] ->
        "/pools/default/buckets/default/stats", //["pools", "default", "buckets", Id, "stats"] ->
        "/pools/default/buckets/default/statsDirectory", //["pools", "default", "buckets", Id, "statsDirectory"] ->
        "/pools/default/b/default", //["pools", "default", "b", BucketName] ->
        "/pools/default/certificate", //["pools", "default", "certificate"] ->
        "/nodes/self/xdcrSSLPorts", // ["nodes", "self", "xdcrSSLPorts"] ->
        "/index.html", //["index.html"] ->

    ];
    common.sendRequests(t, paths, request_options, 200, false, function () {

    });
});




test("GET 200 with Auth", function (t) {
    options = extend({}, request_options);
    options.auth = "Administrator:password";

    paths = ["/versions", //["versions"] ->
        "/pools", //["pools"] ->
        "/pools/default", //["pools", "default"] ->
        "/pools/nodes", //["pools", "nodes"] ->
        "/pools/default/overviewStats", //["pools", "default", "overviewStats"]
        "/pools/default/buckets", //["pools", "default", "buckets"] ->
        "/pools/default/buckets/default", //["pools", "default", "buckets", Id] ->
        "/pools/default/buckets/default/ddocs", //["pools", "default", "buckets", Id, "ddocs"] ->
        "/pools/default/buckets/default/docs", //["pools", "default", "buckets", Id, "docs"] ->
        "/pools/default/buckets/default/stats", //["pools", "default", "buckets", Id, "stats"] ->
        "/pools/default/buckets/default/statsDirectory", //["pools", "default", "buckets", Id, "statsDirectory"] ->
        "/pools/default/b/default", //["pools", "default", "b", BucketName] ->
        "/pools/default/buckets/default/nodes", // ["pools", "default", "buckets", Id, "nodes"] ->
        "/pools/default/buckets/default/nodes/127.0.0.1%3A8091", // ["pools", "default", "buckets", Id, "nodes", NodeId] -> //TODO better take from config
        "/pools/default/buckets/default/nodes/127.0.0.1%3A8091/stats", //["pools", "default", "buckets", Id, "nodes", NodeId, "stats"] ->
        //        "/pools/default/buckets/default/recoveryStatus",//["pools", "default", "buckets", Id, "recoveryStatus"] ->//TODO Q TO ALK: 400 {"code":"uuid_missing"}
        "/pools/default/remoteClusters", //["pools", "default", "remoteClusters"] ->
        "/pools/default/serverGroups", //["pools", "default", "serverGroups"] ->
        "/pools/default/certificate", //["pools", "default", "certificate"] ->
        "/nodeStatuses", //["nodeStatuses"] ->
        "/logs", //["logs"] ->
        "/alerts", //["alerts"] ->
        "/settings/web", //["settings", "web"] ->
        "/settings/alerts", //["settings", "alerts"] ->
        "/settings/stats", //["settings", "stats"] ->
        "/settings/autoFailover", //["settings", "autoFailover"] ->
        "/settings/maxParallelIndexers", //["settings", "maxParallelIndexers"] -> MB-10976
        "/settings/viewUpdateDaemon", //["settings", "viewUpdateDaemon"] ->
        "/settings/autoCompaction", //["settings", "autoCompaction"] ->
        "/settings/replications", //["settings", "replications"] ->
        "/internalSettings", //["internalSettings"] ->
        "/internalSettings/visual", //["internalSettings", "visual"] ->
        "/nodes/ns_1@127.0.0.1", // ["nodes", NodeId] ->
        "/nodes/self/xdcrSSLPorts", //["nodes", "self", "xdcrSSLPorts"] ->
        //        "/diag", //["diag"] ->
        "/diag/vbuckets?bucket=default", //["diag", "vbuckets"] -> {auth, fun handle_diag_vbuckets/1};
        "/pools/default/rebalanceProgress", // ["pools", "default", "rebalanceProgress"] ->
        "/pools/default/tasks", //["pools", "default", "tasks"] ->
        "/index.html", //["index.html"] ->
        "/dot/default",//["dot", Bucket] ->
        "/dotsvg/default", //["dotsvg", Bucket] ->
        "/sampleBuckets", //["sampleBuckets"] -> {auth_ro, fun handle_sample_buckets/1};
        "/sasl_logs", //["sasl_logs"] ->


    ];
    common.sendRequests(t, paths, options, 200, false, function () {

    });
});

test("GET 200 stream", function (t) {

    paths = [
        "/poolsStreaming/default", //["poolsStreaming", "default"] ->
        "/pools/default/bucketsStreaming/default", //["pools", "default", "bucketsStreaming", Id] ->
        "/pools/default/bs/default", //["pools", "default", "bs", BucketName] ->
    ];
    common.sendRequests(t, paths, request_options, 200, true, function () {

    });
});

test("GET 401 stream", function (t) {

    paths = [

        "/pools/default/saslBucketsStreaming", //["pools", "default", "saslBucketsStreaming"] ->
        "/diag/masterEvents", //["diag", "masterEvents"] -> {auth, fun handle_diag_master_events/1};
    ];
    common.sendRequests(t, paths, request_options, 401, true, function () {

    });
});


test("GET 200 stream with Auth", function (t) {
    options = extend({}, request_options);
    options.auth = "Administrator:password";
    paths = [
        "/poolsStreaming/default", //["poolsStreaming", "default"] ->
        "/pools/default/saslBucketsStreaming", //["pools", "default", "saslBucketsStreaming"] ->
        "/pools/default/bucketsStreaming/default", //["pools", "default", "bucketsStreaming", Id] ->
        "/pools/default/bs/default", //["pools", "default", "bs", BucketName] ->
        "/diag/masterEvents", //["diag", "masterEvents"] -> {auth, fun handle_diag_master_events/1}; //TODO FATAL ERROR: JS Allocation failed - process out of memory
    ];
    common.sendRequests(t, paths, options, 200, true, function () {

    });
});



test("GET 401", function (t) {

    paths = [
        "/pools/default/overviewStats", //["pools", "default", "overviewStats"]
        "/pools/default/buckets/default/docs", //["pools", "default", "buckets", Id, "docs"] ->
        "/pools/default/buckets/default/ddocs", //["pools", "default", "buckets", Id, "ddocs"] ->
        "/pools/default/buckets/default/docs/FAKE", //["pools", "default", "buckets", Id, "docs", DocId] -> TODO add real doc for positive case
        "/pools/default/buckets/default/localRandomKey", //["pools", "default", "buckets", Id, "localRandomKey"] -> TODO add real docs
        "/pools/default/buckets/default/nodes", //["pools", "default", "buckets", Id, "nodes"] ->
        "/pools/default/buckets/default/nodes/127.0.0.1%3A8091", // ["pools", "default", "buckets", Id, "nodes", NodeId] -> //TODO bettter take from config
        "/pools/default/buckets/default/nodes/127.0.0.1%3A8091/stats", //["pools", "default", "buckets", Id, "nodes", NodeId, "stats"] ->
        "/pools/default/buckets/default/nodes/127.0.0.1%3A8091/stats/FAKE", //["pools", "default", "buckets", Id, "stats", StatName] -> TODO add verification with real StatName
        "/pools/default/buckets/default/recoveryStatus", //["pools", "default", "buckets", Id, "recoveryStatus"] ->
        "/pools/default/remoteClusters", //["pools", "default", "remoteClusters"] ->
        "/pools/default/serverGroups", //["pools", "default", "serverGroups"] ->
        "/nodeStatuses", //["nodeStatuses"] ->
        "/logs", //["logs"] ->
        "/alerts", //["alerts"] ->
        "/settings/web", //["settings", "web"] ->
        "/settings/alerts", //["settings", "alerts"] ->
        "/settings/stats", //["settings", "stats"] ->
        "/settings/autoFailover", //["settings", "autoFailover"] ->
        "/settings/maxParallelIndexers", //["settings", "maxParallelIndexers"] ->
        "/settings/viewUpdateDaemon", //["settings", "viewUpdateDaemon"] ->
        "/settings/autoCompaction", //["settings", "autoCompaction"] ->
        "/settings/readOnlyAdminName", //["settings", "readOnlyAdminName"] ->
        "/settings/replications", //["settings", "replications"] ->
        "/settings/replications/FAKE", //["settings", "replications", XID] -> //TODO add real XID
        "/internalSettings", //["internalSettings"] ->
        "/internalSettings/visual", //["internalSettings", "visual"] ->
        "/nodes/ns_1@127.0.0.1", // ["nodes", NodeId] ->
        "/diag", //["diag"] ->
        "/diag/vbuckets", //["diag", "vbuckets"] -> {auth, fun handle_diag_vbuckets/1};
        "/diag/vbuckets?bucket=default", //["diag", "vbuckets"] -> {auth, fun handle_diag_vbuckets/1};
        "/pools/default/rebalanceProgress", //["pools", "default", "rebalanceProgress"] ->
        "/pools/default/tasks", //["pools", "default", "tasks"] ->
        "/dot/default", //["dot", Bucket] ->
        "/dotsvg/default", //["dotsvg", Bucket] ->
        "/sampleBuckets", //["sampleBuckets"] -> {auth_ro, fun handle_sample_buckets/1};
        "/sasl_logs", //["sasl_logs"] ->


    ];
    common.sendRequests(t, paths, request_options, 401, false, function () {

    });
});



//TODO add more cases with 'fake' objects 
test("GET 404 with Auth", function (t) {
    options = extend({}, request_options);
    options.auth = "Administrator:password";

    paths = [
        "/pools/default/buckets/default/docs/FAKE", //["pools", "default", "buckets", Id, "docs", DocId] -> TODO add real doc for positive case
        "/pools/default/buckets/default/localRandomKey", //["pools", "default", "buckets", Id, "localRandomKey"] -> TODO add real docs
        "/pools/default/buckets/default/nodes/127.0.0.1%3A8091/stats/FAKE", //["pools", "default", "buckets", Id, "stats", StatName] -> TODO add verification with real StatName
        "/settings/replications/FAKE", //["settings", "replications", XID] -> //TODO add real XID
        "/settings/readOnlyAdminName", //["settings", "readOnlyAdminName"] -> //TODO add read ROuser
        "/nodes/FAKE", // ["nodes", NodeId] ->
        "/dot/FAKE", //["dot", Bucket] ->
        "/dotsvg/FAKE", //["dotsvg", Bucket] ->
    ];
    common.sendRequests(t, paths, options, 404, false, function () {

    });
});



test("GET 500 Internal Server Error with Auth", function (t) {
    options = extend({}, request_options);
    options.auth = "Administrator:password";

    paths = [
                "/diag/vbuckets", //["diag", "vbuckets"] -> {auth, fun handle_diag_vbuckets/1}; MB-10977 bucket is not specified
    ];
    common.sendRequests(t, paths, options, 500, false, function () {

    });
});