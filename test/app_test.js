suite("app", function() {
  var assert  = require('assert');
  var path    = require('path');
  var base    = require('../');
  var request = require('superagent-promise');

  // Test app creation
  test("app({port: 1459})", function() {
    // Create a simple app
    var app = base.app({
      port:       1459,
      env:        'development',
      forceSSL:   false,
      trustProxy: false
    });
    assert(app, "Should have an app");

    // Add an end-point
    app.get("/test", function(req, res) {
      res.status(200).send("Okay this works");
    });

    // Create server
    var server = null;
    return app.createServer().then(function(server_) {
      server = server_;
      return request.get('http://localhost:1459/test').end();
    }).then(function(res) {
      assert(res.ok, "Got response");
      assert(res.text == "Okay this works", "Got the right text");
      return server.terminate();
    });
  });
});

