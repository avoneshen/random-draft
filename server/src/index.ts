import path from "path";
import http from "http";
import express from "express";
import socketio from "socket.io";
import home from "./controllers/home.js";
import { handleIo } from "./controllers/sockets.js";

const port = 8080;

// TODO: Gross, but the best we can do until top level await is in Node :(
const __dirname = path.resolve(path.dirname(""));
const app = express();
app.use(express.static(__dirname + "/public"));
app.get("/", home);

// Setup Server
const server = http.createServer(app);
server.listen(port);
console.log(`Dev server running at http://localhost:${port}`);

// Setup Socket.IO
const io = socketio.listen(server);
// This creates the socket subscriptions and handlers
handleIo(io);
