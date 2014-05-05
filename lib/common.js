  var http = require("http"),
      async = require("async"),
      events = require('events'),
      logger = require("../lib/log"),
      extend = require('util')._extend;
   //  config = require('../config/' + conf_file),



  var common = module.exports = {



      get_api: function (t, protocol, options, expectedStatus, stream, callback) {
          protocol.get(options, function (response) {
              var body = '';

              response.on('data', function (chunk) {
                  body += chunk;
              }, setTimeout(function () {
                  if (stream) {
                      console.log("sleep 5 sec");
                      response.connection.end();
                  } else {

                  }

              }, (function () {
                  if (stream) {
                      return 5000;
                  } else {
                      return 0;
                  }
              })()));

              response.on('error', function (e) {
                  logger.error("Got error: " + e.message);
                  t.fail("ERROR:", e);
              });

              response.on('aborted', function (e) {
                  if (!stream) {
                      logger.error("Got error: ", e);
                      t.fail("ERROR aborted:", e);
                  }
              });


              response.on('end', function () {
                  logger.info(response.statusCode + " from http://" + options.host + ":" + options.port + options.path);
                  if (response.statusCode == '200' || response.statusCode == '201') {
                      t.equals(response.statusCode, expectedStatus, "response status code " + options.path + ": " + response.statusCode + ". Expected: " + expectedStatus);
                      try {
                          body = JSON.parse(body);
                      } catch (err) {
//                          logger.info("not json format of response body", options.path, body);
                      }
                      callback(body);
                  } else {
                      if (response.statusCode == expectedStatus.toString()) {
                          console.log("got expected status " + options.path + ": ", expectedStatus);
                          try {
                              body = JSON.parse(body);
                          } catch (err) {
//                              logger.info("not json format of response body", options.path, body);
                          }
                          callback(body);
                      } else {
                          t.fail("wrong response status code " + response.statusCode + " from http://" +
                              options.host + ":" + options.port + options.path + " for :" + JSON.stringify(options));
                          callback(body);
                      }
                      t.end();
                  }

              });
          }, notifycaller.call(t, callback));
      },


      post_api: function (t, protocol, post_data, options, callback) {
          var body = '';
          var req = protocol.request(options, function (response) {

              response.setEncoding('utf8');

              response.on('data', function (chunk) {
                  console.log(chunk);
                  body += chunk;
                  callback(body);
              });

              response.on('error', function (e) {
                  logger.error("Got error: " + e.message);
                  t.fail("ERROR ");
                  t.end();
              });

              response.on('end', function () {
                  logger.info(response.statusCode + " from http://" + options.host + ":" + options.port + options.path);

                  if (response.statusCode == '200' || response.statusCode == '202') {
                      try {
                          body = JSON.parse(body);
                      } catch (err) {
                          logger.warn("not json format:" + body);
                      }
                      logger.info("callback");
                      callback(body);
                  } else {
                      logger.info(body);
                      t.fail("response status code " + response.statusCode + " from http://" + options.host + ":" + options.port + options.path);
                      t.end();
                  }
              });
          });
          logger.info(post_data);
          req.write(post_data);
          req.end();
      },

  
  
  sendRequests: function(t, paths, options, status, stream) {
	    async.times(paths.length, function (i, next) {
	            obj = extend({}, options);
	            console.log(paths[i]);
	            obj.path = paths[i];
	            common.get_api(t, protocol, obj, status, stream, function (callback) {}, next);
	        }, function () {},
	        setTimeout(function () {
	            console.log("sleep 5 sec");
	            t.end();
	        }, (function () {

	            return 5000;
	        })())
	    );
	},
	
	
	  
  };

   //multi-purpose helper for async methods
   //
   // primary purpose is to return a callback which complies with completion of async loops
   // * can emit an event on completion
   // * can emit an event during innter loop completion and call it's callback
  function notifycaller(args) {

      if (args && typeof (args) == 'string') {
          args = {
              emits: args
          };
      }
      var tctx = this;
      return function (err, json) {
          if (args) {

              if (args.emits) {
                  common.ee.emit(args.emits, err, json);
              }

              if (args.cb) {
                  args.cb(err, json);
              }
          } else {
              // nothing to do, end test
              if (err) {
                  tctx.fail(JSON.stringify(err));
              }
              tctx.end();
          }

      };

  }