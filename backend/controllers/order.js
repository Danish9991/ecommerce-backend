const {Order, ProductCart} = require('../models/order');

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
    .populate('products.product', 'name price')
    .exec((err, order) => {
        if(err){
            return res.status(200).json({
                error: "order not found in DB"
            })
        }
        req.order = order;
        next();
    })
}

exports.createOrder = (Req, res, next) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, order) => {
        if(err){
            return res.status(400).json({
                error: "No order Found in DB"
            })
        }
        res.status(200).json(order)
    })
}

exports.getAllOrders = (req, res, next) => {
    Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
        if(err){
            return res.status(400).json({
                error: "order not found in DB"
            })
        }
        res.status(200).json(orders)
    })

}

exports.getOrderStatus = (req, res, next) => {
    res.json(Order.schema.path("status").emumValues)
}

exports.updateStatus = (req, res, next) => {
    Order.findByIdAndUpdate({_id: req.body.orderId}, {$set: {status: req.body.status}}, (err, order) => {
        if(err){
            res.status(400).json({
                error: "order not found in DB"
            })
        }
        res.status(400).json(order)
    })
}
