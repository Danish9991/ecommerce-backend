const Category = require('../models/category');

exports.getCategoryById = (req, res, next, id) => {
    Category.findById({_id:id}, (err, category) => {
        if(err || !category){
           return res.status(400).json({
                error: "no category found"
            });
        }
        req.category = category;
        next();
    })
}

exports.getCategory = (req, res, next) => {
   return res.status(200).json(req.category);
}

exports.createCategory = (req, res, next) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if(err || !category){
           return res.status(400).json({
                error: "category not saved in DB"
            })
        }
        res.status(200).json(category);
    })
};

exports.getAllCategory = (req, res, next) => {
    Category.find({}, (err, categories) => {
        if(err || !categories){
          return res.status(400).json({
                error: "no categories found in json"
            })
        }
        res.status(200).json(categories);
    })
}

exports.updateCategory = (req, res, next) => {
    Category.findOneAndUpdate({_id: req.category._id}, req.body, {new: true}, (err, category) => {
        if(err || !category){
           return res.status(400).json({
                error: "category not updated"
            })
        }
        res.status(200).json(category)
    })
};

exports.removeCategory = (req, res, next) => {
    Category.findOneAndRemove({_id: req.category._id}, (err, category) => {
        if(err || !category){
            return res.status(400).json({
                error: "category not deleted"
            })
        }
        res.status(200).json(category);
    })
}
