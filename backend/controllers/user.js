const User = require('../models/user');
const Order = require('../models/order');

exports.getUserById = (req, res, next, id) => {

  User.findById({_id:id}, (err, user) => {
    if(err || !user){
        res.status(400).json({
            error: 'no user with this id found'
        });
         
    }
   const {_id, name, email,purchases,role} = user;
   req.profile = {_id, name, email,purchases,role};
    next();
  })
}

exports.getUser = (req, res, next) => {
   var user = {};
    res.status(200).json({
        user : req.profile,
    })
}

exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate({_id: req.profile._id}, req.body ,{new:true}, (err, user) => {
       if(err || !user){
           res.status(400).json({
               error: "user not updated"
           })
       }
       const {_id, name, email,purchases,role} = user;
       req.profile = {_id, name, email,purchases,role};
       res.status(200).json({
           user: req.profile
       })
  })
}

exports.userPurchasesList = (req, res, next) => {
    Order.find({user:req.profile._id})
    .populate("user", "_id name")
    .exec((err, order) => {
        if(err){
            res.status(400).json({
                error: "no order found with this user"
            })
        }
        res.status(200).json({
            order: order
        })
    })
}
exports.pushOrderInPurchaseList = (req, res , next) => {
    let purchases = [];
    req.body.orders.products.forEach((product) => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.orders.amount,
            transaction_id: req.body.orders.transaction_id
        });
    });
    
    //store this into DB

    User.findOneAndUpdate(
        {_id: req.profile.id},
        {$push: {purchases: purchases}},
        {new: true},
        (err, purchases) => {
            if(err){
                res.status(400).json({
                    error: "Unable to save purchases"
                });
            }
            next();
        }
        
        );
}