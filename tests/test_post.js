var test = require("tap").test;
var fs = require('fs');
var common = require("../lib/common");
var extend = require('util')._extend;

certificate = process.env.CERIFICATE || 0;


/* https://github.com/membase/ns_server/blob/master/src/menelaus_web.erl
  
  'POST' ->
                     case PathTokens of
                         D["uilogin"] ->
                             {done, handle_uilogin(Req)};
                         D["uilogout"] ->
                             {done, handle_uilogout(Req)};
                         ["sampleBuckets", "install"] ->
                             {auth, fun handle_post_sample_buckets/1};
                         ["engageCluster2"] ->
                             {auth, fun handle_engage_cluster2/1};
                         ["completeJoin"] ->
                             {auth, fun handle_complete_join/1};
                         ["node", "controller", "doJoinCluster"] ->
                             {auth, fun handle_join/1};
                         ["node", "controller", "rename"] ->
                             {auth, fun handle_node_rename/1};
                         ["nodes", NodeId, "controller", "settings"] ->
                             {auth, fun handle_node_settings_post/2,
                              [NodeId]};
                         ["nodes", NodeId, "controller", "resources"] ->
                             {auth, fun handle_node_resources_post/2,
                              [NodeId]};
                         ["settings", "web"] ->
                             {auth, fun handle_settings_web_post/1};
                         ["settings", "alerts"] ->
                             {auth, fun handle_settings_alerts_post/1};
                         ["settings", "alerts", "testEmail"] ->
                             {auth, fun handle_settings_alerts_send_test_email/1};
                         ["settings", "stats"] ->
                             {auth, fun handle_settings_stats_post/1};
                         ["settings", "autoFailover"] ->
                             {auth, fun handle_settings_auto_failover_post/1};
                         ["settings", "autoFailover", "resetCount"] ->
                             {auth, fun handle_settings_auto_failover_reset_count/1};
                         ["settings", "maxParallelIndexers"] ->
                             {auth, fun handle_settings_max_parallel_indexers_post/1};
                         ["settings", "viewUpdateDaemon"] ->
                             {auth, fun handle_settings_view_update_daemon_post/1};
                         ["settings", "readOnlyUser"] ->
                             {auth, fun handle_settings_read_only_user_post/1};
                         ["settings", "replications"] ->
                             {auth, fun menelaus_web_xdc_replications:handle_global_replication_settings_post/1};
                         ["settings", "replications", XID] ->
                             {auth, fun menelaus_web_xdc_replications:handle_replication_settings_post/2, [XID]};
                         ["internalSettings"] ->
                             {auth, fun handle_internal_settings_post/1};
                         ["internalSettings", "visual"] ->
                             {auth, fun handle_visual_internal_settings_post/1};
                         ["pools", "default"] ->
                             {auth, fun handle_pool_settings/2,
                              ["default"]};
                         ["controller", "ejectNode"] ->
                             {auth, fun handle_eject_post/1};
                         ["controller", "addNode"] ->
                             {auth, fun handle_add_node/1};
                         ["pools", "default", "serverGroups", UUID, "addNode"] ->
                             {auth, fun handle_add_node_to_group/2, [UUID]};
                         ["controller", "failOver"] ->
                             {auth, fun handle_failover/1};
                         ["controller", "startGracefulFailover"] ->
                             {auth, fun handle_start_graceful_failover/1};
                         ["controller", "rebalance"] ->
                             {auth, fun handle_rebalance/1};
                         ["controller", "reAddNode"] ->
                             {auth, fun handle_re_add_node/1};
                         ["controller", "stopRebalance"] ->
                             {auth, fun handle_stop_rebalance/1};
                         ["controller", "setRecoveryType"] ->
                             {auth, fun handle_set_recovery_type/1};
                         ["controller", "setAutoCompaction"] ->
                             {auth, fun handle_set_autocompaction/1};
                         ["controller", "createReplication"] ->
                             {auth, fun menelaus_web_xdc_replications:handle_create_replication/1};
                         ["controller", "cancelXDCR", XID] ->
                             {auth, fun menelaus_web_xdc_replications:handle_cancel_replication/2, [XID]};
                         ["controller", "cancelXCDR", XID] ->
                             {auth, fun menelaus_web_xdc_replications:handle_cancel_replication/2, [XID]};
                         ["controller", "resetAlerts"] ->
                             {auth, fun handle_reset_alerts/1};
                         ["controller", "setFastWarmup"] ->
                             {auth, fun handle_set_fast_warmup/1};
                         ["controller", "setReplicationTopology"] ->
                             {auth, fun handle_set_replication_topology/1};
                         ["controller", "regenerateCertificate"] ->
                             {auth, fun handle_regenerate_certificate/1};
                         ["pools", "default", "buckets", Id] ->
                             {auth_check_bucket_uuid, fun menelaus_web_buckets:handle_bucket_update/3,
                              ["default", Id]};
                         ["pools", "default", "buckets"] ->
                             {auth, fun menelaus_web_buckets:handle_bucket_create/2,
                              ["default"]};
                         ["pools", "default", "buckets", Id, "docs", DocId] ->
                             {auth, fun menelaus_web_crud:handle_post/3, [Id, DocId]};
                         ["pools", "default", "buckets", Id, "controller", "doFlush"] ->
                             {auth_bucket_mutate,
                              fun menelaus_web_buckets:handle_bucket_flush/3, ["default", Id]};
                         D["pools", "default", "buckets", Id, "controller", "compactBucket"] ->
                             {auth_check_bucket_uuid,
                              fun menelaus_web_buckets:handle_compact_bucket/3, ["default", Id]};
                         ["pools", "default", "buckets", Id, "controller", "unsafePurgeBucket"] ->
                             {auth_check_bucket_uuid,
                              fun menelaus_web_buckets:handle_purge_compact_bucket/3, ["default", Id]};
                         ["pools", "default", "buckets", Id, "controller", "cancelBucketCompaction"] ->
                             {auth_check_bucket_uuid,
                              fun menelaus_web_buckets:handle_cancel_bucket_compaction/3, ["default", Id]};
                         ["pools", "default", "buckets", Id, "controller", "compactDatabases"] ->
                             {auth_check_bucket_uuid,
                              fun menelaus_web_buckets:handle_compact_databases/3, ["default", Id]};
                         ["pools", "default", "buckets", Id, "controller", "cancelDatabasesCompaction"] ->
                             {auth_check_bucket_uuid,
                              fun menelaus_web_buckets:handle_cancel_databases_compaction/3, ["default", Id]};
                         ["pools", "default", "buckets", Id, "controller", "startRecovery"] ->
                             {auth, fun menelaus_web_recovery:handle_start_recovery/3, ["default", Id]};
                         ["pools", "default", "buckets", Id, "controller", "stopRecovery"] ->
                             {auth, fun menelaus_web_recovery:handle_stop_recovery/3, ["default", Id]};
                         ["pools", "default", "buckets", Id, "controller", "commitVBucket"] ->
                             {auth, fun menelaus_web_recovery:handle_commit_vbucket/3, ["default", Id]};
                         ["pools", "default", "buckets", Id,
                          "ddocs", DDocId, "controller", "compactView"] ->
                             {auth_check_bucket_uuid,
                              fun menelaus_web_buckets:handle_compact_view/4, ["default", Id, DDocId]};
                         ["pools", "default", "buckets", Id,
                          "ddocs", DDocId, "controller", "cancelViewCompaction"] ->
                             {auth_check_bucket_uuid,
                              fun menelaus_web_buckets:handle_cancel_view_compaction/4, ["default", Id, DDocId]};
                         ["pools", "default", "buckets", Id,
                          "ddocs", DDocId, "controller", "setUpdateMinChanges"] ->
                             {auth_check_bucket_uuid,
                              fun menelaus_web_buckets:handle_set_ddoc_update_min_changes/4, ["default", Id, DDocId]};
                         ["pools", "default", "remoteClusters"] ->
                             {auth, fun menelaus_web_remote_clusters:handle_remote_clusters_post/1};
                         ["pools", "default", "remoteClusters", Id] ->
                             {auth, fun menelaus_web_remote_clusters:handle_remote_cluster_update/2, [Id]};
                         ["pools", "default", "serverGroups"] ->
                             {auth, fun menelaus_web_groups:handle_server_groups_post/1};
                         ["logClientError"] -> {auth,
                                                fun (R) ->
                                                        User = menelaus_auth:extract_auth_user(R),
                                                        ?MENELAUS_WEB_LOG(?UI_SIDE_ERROR_REPORT,
                                                                          "Client-side error-report for user ~p on node ~p:~nUser-Agent:~s~n~s~n",
                                                                          [User, node(),
                                                                           Req:get_header_value("user-agent"), binary_to_list(R:recv_body())]),
                                                        R:ok({"text/plain", add_header(), <<"">>})
                                                end};
                         ["diag", "eval"] -> {auth, fun handle_diag_eval/1};
                         ["erlwsh" | _] ->
                             {done, erlwsh_web:loop(Req, erlwsh_deps:local_path(["priv", "www"]))};
                         ["couchBase" | _] -> {done, capi_http_proxy:handle_proxy_req(Req)};
                         _ ->
                             ?MENELAUS_WEB_LOG(0001, "Invalid post received: ~p", [Req]),
                             {done, Req:not_found()}
 
*/


var post_options = {
	    host: 'localhost',
	    method : 'POST',
	    headers: {'Content-Type' : 'application/x-www-form-urlencoded'}

	};


	if (certificate) {
		post_options.ca = [fs.readFileSync('./cacert.pem')];
	    protocol = require('https');
	    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
	    post_options.agent = false;
	    post_options.port = 18091;
	} else {
	    protocol = require('http');
	    post_options.port = 8091;
	    //	request_options.agent = false;
	}


	test("POST uilogin/uilogout", function (t) {
	    options = extend({}, post_options);
	    paths = ["/uilogin", //["uilogin"] ->
	             "/uilogout", //["uilogout"] ->

	    ];
	    post_data = ["user=Administrator&password=password",
	                 "user=Administrator&password=password"
	                 ];

	    common.sendPostRequests(t, paths, post_data, options, 200, false, function () {

	    });
	});

	test("POST 200 with Auth", function (t) {
	    options = extend({}, post_options);
	    options.auth = "Administrator:password";

	    paths = ["/pools/default/buckets/default/controller/compactDatabases", //["pools", "default", "buckets", Id, "controller", "compactDatabases"] ->

	    ];
	    post_data = ["",];

	    common.sendPostRequests(t, paths, post_data, options, 200, false, function () {

	    });
	});
