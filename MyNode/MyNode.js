/**
 * MyNode.js
 *
 * The goal is that sometimes you want to quickly implement a end to end app.
 * Full-stack technique in one file, db > service > ui, that is MyNode.js
 *
 */
(function() {
  "use strict";

  // run it!
  return MyNode();

  function MyNode() {
      console.log("Server start");
      var sqlite3 = require('sqlite3'),
        http = require('http'),
        httpProxy = require('http-proxy'),
        url = require('url'),
        fs = require('fs'),
        mime = require('mime-types');
      var db = new sqlite3.Database(':memory:', function() {
        db.run("CREATE TABLE IF NOT EXISTS MY_NODE (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(36), value varchar(255))", function() {
          var port = 8086;
          var hproxy = httpProxy.createProxyServer();
          http.createServer(function(req, res) {
            console.log(req.url);
            var q = url.parse(req.url, true);
            // API
            if (q.pathname === "/shutdown") {
              console.log("process exit!");
              process.exit();
            }
            if (q.pathname === "/api/hello") {
              res.write("hello");
              return res.end();
            }
            if (q.pathname === "/api/create" && req.method == 'POST') {
              var data = '';
              req.on('data', function(chunk) {
                data += chunk.toString();
              });
              req.on('end', function() {
                console.log(data);
                var oData = JSON.parse(data);
                db.run("INSERT INTO MY_NODE(name,value) VALUES (?,?)", oData.name, oData.value, function(err) {
                  console.log(this.lastID);
                  res.write(JSON.stringify({
                    result: "success",
                    objectId: this.lastID
                  }));
                  res.end();
                });
              });
              return;
            }
            if (q.pathname === "/api/get") {
              db.all("SELECT * FROM MY_NODE", function(err, rows) {
                console.log(rows);
                res.write(JSON.stringify(rows));
                res.end();
              });
              return;
            }
            // Index.html
            if (q.pathname === "/") {
              res.write(Buffer.from('<!DOCTYPE html><html><head><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta charset="utf-8"><title>My Node</title><script id="sap-ui-bootstrap"src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js"data-sap-ui-theme="sap_belize"data-sap-ui-libs="sap.m"data-sap-ui-preload="async"></script></head><body class="sapUiBody" id="content"></body><script src="/MyNode.js"></script></html>').toString());
              return res.end();
            }
            // proxy
            var aPrefixes = [
              "/proxy/"
            ]
            for (var iPrefix in aPrefixes) {
              var proxy_cfg = {
                // the prefix you use to call your backend functions via the proxy server
                prefix: aPrefixes[iPrefix],
                // the host of your backend server
                host: "proxy",
                // port of your backend server
                port: "8080"
              };
              if (q.pathname.startsWith(proxy_cfg.prefix)) {
                hproxy.on('error', function(err, preq, pres) {
                  console.log("backend error");
                  console.log(err);
                });
                hproxy.on('proxyRes', function(proxyRes, preq, pres) {
                  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
                });
                hproxy.on('close', function(preq, socket, head) {
                  // view disconnected websocket connections
                  console.log('Client disconnected');
                });
                req.headers.host = proxy_cfg.host;
                req.url = req.url.slice(proxy_cfg.prefix.length);
                hproxy.web(req, res, {
                  target: 'http://' + proxy_cfg.host + (proxy_cfg.port ? ':' + proxy_cfg.port : '') + '/'
                });
                return;
              }
            }
            // server
            var filename = "." + q.pathname;
            fs.readFile(filename, function(err, data) {
              if (err) {
                res.writeHead(404, {
                  'Content-Type': 'text/html'
                });
                return res.end("404 Not Found");
              }
              res.writeHead(200, {
                'Content-Type': mime.lookup(filename)
              });
              res.write(data);
              return res.end();
            });
          }).listen(port);
          console.log("listen port: " + port + " ...");
        });
      });
    }
  }
})();
