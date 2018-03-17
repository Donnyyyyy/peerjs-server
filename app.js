var express = require('express');
var ExpressPeerServer = require('./lib').ExpressPeerServer;
var pug = require('pug');
var bodyParser = require('body-parser');


var app = express();

var server = app.listen(9000);

var options = {
    debug: true
}

let routingDict = {}
var peerServer = ExpressPeerServer(server, options)
app.use('/api', peerServer);
app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/', (req, res, next) => res.send(pug.renderFile('./templates/index.pug')));
app.get('/leecher', (req, res, next) => res.send(pug.renderFile('./templates/leecher.pug')));

app.post('/stored/', (req, res, next) => {
    storeSeeder(routingDict, req.body.peerid, req.body.filename)
    res.send('Okay')
});

app.post('/getseeder/', (req, res, next) => {
    let id = getSeeder(routingDict, req.body.filename)
    res.send(id)
});

peerServer.on('connection', function (id) {
    console.log('New peer: ' + id)
});

console.log('Server listening on port 9000!')

//
function storeSeeder(routingDict, id, filename){
    routingDict[filename] = id
    return routingDict
}
//
function getSeeder (routingDict, filename){
    return routingDict[filename] !== undefined ? routingDict[filename] : undefined
}