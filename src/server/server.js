let http = require("http");
let router = require("http-router");
let fs = require("fs");
let path = require("path");
let ini = require("ini");
let url = require("url");

let QGuardListener = require("./qguard_listener.js");

class Server {
  constructor(port, save_logs) {
    this.port = port;

    this.root_dir = "../../";
    this.log_dir = this.root_dir + "logs/";
    this.config_dir = this.root_dir + "config/";
    this.not_found = "<html><body><p>404 not found</p></body></html>";
    
    this.messages = {};
    this.qguard_listeners = [];
    this.routes = router.createRouter();

    this.configure();
    this.create_listeners(save_logs);
    this.create_routes();
  }

  configure() {
    // Load configuration
    this.config = ini.parse(
      fs.readFileSync(this.config_dir + "config.ini", "utf-8")
    );
    
    this.client_dir = this.root_dir + "src/clients/";

    if (this.config.client
     && this.config.client.type) {
      this.client_dir += this.config.client.type + "/";
    }
  }

  create_listeners(save_logs) {
    // Create listeners 
    let server_names = Object.keys(this.config.servers);
    for (let i=0; i<server_names.length; ++i) {
      this.qguard_listeners.push(
        new QGuardListener(server_names[i],
                           this.config.servers[server_names[i]],
                           save_logs,
                           this.log_dir)
      );
    }

    for (let i=0; i<this.qguard_listeners.length; ++i) {
      this.qguard_listeners[i].attempt_connection();
    }
  }

  create_routes() {
    this.routes
      // index.html 
      .get("/", (req, res, next) => {
        let index_html_path = this.client_dir + "index.html";
        fs.readFile(index_html_path, (err, index_html) => {
          if (err) {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end(this.not_found);
            return;
          }
          
          res.writeHead(200, {"Content-Type": "text/html"});
          res.end(index_html);
        });
      })
      // Geographic Coordinate Object List
      .get("/api/object_list/geo", (req, res, next) => {
        res.writeHead(200, {"Content-Type": "application/json"});
      
        let message = this.prepare_api_message("geo");
        res.end(JSON.stringify(message));
      })
      // Cartesian Coordinate Object List
      .get("/api/object_list/cart", (req, res, next) => {
        res.writeHead(200, {"Content-Type": "application/json"});
        
        let message = this.prepare_api_message("cart");
        res.end(JSON.stringify(message));
      })
      // File in client directory
      .get("/:file", (req, res, next) => {
        let filepath = this.client_dir + req.params.file;
        fs.readFile(filepath, (err, file_contents) => {
          if (err) {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end(this.not_found);
            return;
          }

          res.writeHead(200, {"Content-Type": "text/css"});
          res.end(file_contents);
        });
      })
      // File in a folder in the client directory
      .get("/:dir/:file", (req, res, next) => {
        let filepath = this.client_dir + req.params.dir + "/" + 
                       req.params.file;
        fs.readFile(filepath, (err, file_contents) => {
          if (err) {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end(this.not_found);
            return;
          }

          res.writeHead(200, {"Content-Type": "text/css"});
          res.end(file_contents);
        });
      });
  }

  prepare_api_message(type) {
    let message = [];
    
    for (let i=0; i<this.qguard_listeners.length; i++) {
      if (type == "geo") {
        message.push(this.qguard_listeners[i].create_api_output_geo());
      }
      else if (type == "cart") {
        message.push(this.qguard_listeners[i].create_api_output_cart());
      }
    }

    return message;
  }

  start() {
    http.createServer((req, res) => {
      let url_data = url.parse(req.url);
      let uri = url_data.pathname;
      req.url = uri;

      if (uri != "/api/object_list/geo" &&
          uri != "/api/object_list/cart") {
        console.log(uri);
      }
      if (!this.routes.route(req, res)) {
        res.writeHead(501);
        res.end(http.STATUS_CODES[501] + "\n");
      }
    }).listen(this.port);
    console.log("Web server started! Listening for connections on port " + 
                this.port + 
                ".\n");
  }
}

module.exports = Server;
