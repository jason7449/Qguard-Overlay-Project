let process = require("process");
let Server = require("./server.js");

let args = process.argv.slice(2);
let save_logs = args.includes("--log");
let version = "0.2.2";

console.log("QGuard Web Client v" + version + "\n");
let server = new Server(process.env.PORT || 3000, save_logs); 

server.start();
