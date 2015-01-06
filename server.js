var http = require('http');
var url = require('url');
var items = [];
var myitems = require('./items');
var mongoose = require('mongoose');

var server = http.createServer(function (req, res) {
    switch (req.method) {
    case 'POST':
        var item = '';
        req.setEncoding('utf8');
        req.on('data', function (chunk) {
            item += chunk;
        });
        req.on('end', function () {
            items.push(item);
            res.end('Item added\n');
        });
        break;
    case 'GET':
        items.forEach(function (item, i) {
            res.write(i + '. ' + item + '\n');
        });
        res.end();
        break;
    case 'DELETE':
        var pathname = url.parse(req.url).pathname;
        var i = parseInt(pathname.slice(1),10);

        if (isNaN(i)) {
            res.statusCode = 400;
            res.end('Not a valid number');
        } else if (!items[i]) {
            res.statusCode = 404;
            res.end('Item not found');
        } else {
            items.splice(i, 1);
            res.end('Item deleted succesfully');
        }
        break;
    case 'PUT':
        var pathname = url.parse(req.url).pathname;
        var i = parseInt(pathname.slice(1), 10);

        if (isNaN(i)) {
            res.statusCode = 400;
            res.end('Not a valid number');
        } else if (!items[i]) {
            res.statusCode = 404;
            res.end('Item not found');
        } else {
            req.on('data', function (chunk) {
                items[i] = chunk;
            });
            res.end('Item updated succesfully');
        }
    }
});

mongoose.connect('mongodb://martin:martinshop@ds031561.mongolab.com:31561/tf_shopping_list');

var db = mongoose.connection;
db.on('error', function callback () {
    console.error('connection error');
});
db.once('open', function callback () {
    console.error('connection success');
});

var port = process.env.PORT || 9000;
server.listen(port, function() {
    console.log("Listening on %d", port);
});