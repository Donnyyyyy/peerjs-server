var express = require('express');
var ExpressPeerServer = require('./lib').ExpressPeerServer;
var pug = require('pug');


var app = express();

var server = app.listen(9000);

var options = {
    debug: true
}

var peerServer = ExpressPeerServer(server, options)
app.use('/api', peerServer);
app.use(express.static('public'))
app.get('/', (req, res, next) => res.send(pug.renderFile('./templates/index.pug')));
app.get('/leecher', (req, res, next) => res.send(pug.renderFile('./templates/leecher.pug')));
peerServer.on('connection', function (id) {
    console.log('New peer: ' + id)
});

console.log('Server listening on port 9000!')
