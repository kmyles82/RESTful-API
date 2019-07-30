const express = require('express'); 
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product')

//Handle GET request to /products
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    })
})

//Handle POST request to /products
router.post('/', (req, res, next) => {
    
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(result => {
        console.log(result)
            .catch(err => {
            console.log(err)
        })
    });

    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    })
})

//Handle GET request to a single product at /products:id
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id,
        })
    } else {
        res.status(200).json({
            message: 'You passed an ID',
        })
    }
})

//Handle PATCH request to update a single product at /products:id
router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated Product',
    })
})

//Handle DELETE request to a single product at /products:id
router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted Product',
    })
})

module.exports = router;