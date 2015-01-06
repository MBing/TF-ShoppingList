var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    item: String
});
var Item = mongoose.model('Item', itemSchema);

exports.create = function(req, res){
    if (!req.param('item')) {
        res.send('Item not valid');
        res.statusCode = 400;
    } else {
        var item = new Item({ item: req.param('item')});
        console.log(item);
        item.save(function (err, item) {
            if (err) return console.error(err);
            res.send("adding " + item);
        });
    }
};

exports.retrieveAll = function(req, res){
    Item.find(function (err, items) {
        if (err) return console.error(err);
        res.send(items);
    })
};

exports.retrieveOne = function(req, res) {
    Item.find({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, item) {
        if (err) return console.error(err);
        res.send(item);
    });
}
exports.update = function(req, res) {
    Item.findByIdAndUpdate(mongoose.Types.ObjectId(req.param('id')), {'item':req.param('item')}, function (err, result) {
        if (err) return console.error(err);
        res.send(result);
    })
}
exports.delete = function(req, res) {
    Item.remove({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, result) {
        if (err) return console.error(err);
        res.send({});
    })
}