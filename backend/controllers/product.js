const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { updateOne } = require('../models/product');

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate('Category')
    .exec((err, product) => {
        if(err || !product){
            return res.status(400).json({
                error: "product not found in DB"
            })
        }
        req.product = product;
        next();
    })
   
}

exports.createProduct = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
      //destructure the fields
      const { name, description, price, category, stock } = fields;
  
      if (!name || !description || !price || !category || !stock) {
        return res.status(400).json({
          error: "Please include all fields"
        });
      }
  
      var product = new Product(fields);
  
      //handle file here
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!"
          });
        }
        // product.photo = {};
        console.log(product);
        product.photo = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
      }
      // console.log(product);
  
      //save to the DB
      product.save((err, product) => {
        if (err) {
          res.status(400).json({
            error: "Saving tshirt in DB failed"
          });
        }
        res.json(product);
      });
    });
  };

exports.getProduct = (req, res, next) => {
    req.product.photo = undefined;
    res.json(req.product);
}

//middleware
exports.photo = (req, res, next) => {
   if(req.product.photo.data){
       res.set('Content-Type', req.product.photo.contentType);
       return res.send(req.product.photo.data);
   }
}

exports.removeProduct = (req, res, next) => {
    Product.findByIdAndRemove(req.product._id, (err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "error in deleteing the product"
            })
        }
        res.status(200).json({
            message: "product deleted successfully",
            deletedProduct
        })
    })

}

exports.updateProduct = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
  
      var product = req.product;
      product = _.extend(product, fields);
  
      //handle file here
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!"
          });
        }
        console.log(product);
        product.photo = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
      }
      // console.log(product);
  
      //save to the DB
      product.save((err, product) => {
        if (err) {
          res.status(400).json({
            error: "updated tshirt in DB failed"
          });
        }
        res.json(product);
      });
    });
}

exports.getAllProducts = (req, res, next) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    .populate('category')
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                error: "error in products"
            })
        }
        res.status(200).json(products)
    })
}

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.orders.products.map(prod => {
      return{
        updateOne: {
            filter: {_id: prod._id},
            update: { $inc: {stock: -prod.count, sold: +prod.count}}
        }
      }
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
      if(err){
          return res.status(400).json({
              error: "bulk operation failed"
          })
      }
      next();
  })
}

exports.getAllUniqueCategories = (req, res, next) => {
    Product.distinct("category", {}, (err, category) => {
        if(err){
            return res.status(400).json({
                error: "error in category"
            })
        }
        res.status(200).json(category)
    })
}

  