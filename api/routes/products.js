const express = require('express'); 
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product')

//Handle GET request to /products
router.get('/', (req, res, next) => {
    //gets all products
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        }
                    }
                })
            };
            // if (docs.length >= 0) {
            res.status(200).json(response)
            // } else {
            //     res.status(404).json({
            //         message: 'No entries found'
            //     })
            // }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

//Handle POST request to /products
router.post('/', upload.single('productImage') ,(req, res, next) => {
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };

    //create new product
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    //save new product to db
    product.save()
    .then(result => {
        console.log(result)
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + result._id
                }
            }
        });
            
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
});

//Handle GET request to get a single product by id
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    //find product by id
    Product.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(doc => {
            console.log("From database:", doc)
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost/products"
                    }
                })
            } else {
                res.status(404).json({
                    message: "No valid entry found for that id"
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });
})

//Handle PATCH request to update a single product by id
router.patch('/:productId', (req, res, next) => {
    //grab product id
    const id = req.params.productId;
    //check operations
    const updateOps = {};
    //loop through all operations of request body
    for (const ops of req.body) {
        //add a new property and value to updateOps
        updateOps[ops.propName] = ops.value;    
    }

    //update the name and/or price to product
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            // console.log(result)
            res.status(200).json({
                message: "Product updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products" + id
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });
})

//Handle DELETE request to delete a single product by id
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number'}
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})

module.exports = router;