const express = require('express'); 
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product')

//Handle GET request to /products
router.get('/', (req, res, next) => {
    //gets all products
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs)
            // if (docs.length >= 0) {
            res.status(200).json(docs)
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
router.post('/', (req, res, next) => {
    
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };

    //create new product
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    //save new product to db
    product.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Handling POST requests to /products',
                createdProduct: result
            })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
    });

    
})

//Handle GET request to get a single product by id
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    //find product by id
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("From database:", doc)
            if (doc) {
                res.status(200).json(doc)    
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
        })
    
    
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
            console.log(result)
            res.status(200).json(result)
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
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})

module.exports = router;