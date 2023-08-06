"use strict";
    
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-gater';

// Port where we'll run the websocket server
// var fs = require('fs');
// websocket and http servers

const express = require('express');
const app = express();
var WebSocket = require('ws');
var server = require('http').createServer(app);
var path = require('path');
var cors = require('cors');

const wss = new WebSocket.Server ({ server:server});

wss.on ('connection', function connection (ws) {
    console.log('A new client connected');
    let msgToSend = JSON.stringify({ type: "gateInstruction", errorcode: 1000, errortext : "Connection confirmed", instruction: "nothing" });
    ws.send (msgToSend);
    
    ws.on('message', function message(data, isBinary) {
        console.log ('Message received: ' + data);
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
});

app.use(cors());       

app.get ('/gate', (req, res) => { res.send ('Hallo, mai Liebä'); console.log("Got a gate request");});
// not sure, when to use this: Works when entering url in browser: localhost:61421/gate

server.listen(61422, () => console.log('Listening on Port : 61422'));
