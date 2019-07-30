const express = require('express'); 
const router = express.Router();
const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

//Handle GET request to /orders
router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json({
                count: docs.length,
                order: docs.map(doc => {
                    return {
                        _id: doc.id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
                
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
})

//Handle POST request to create an order -> /orders
router.post('/', (req, res, next) => {
    //check if product from the order exist
    Product.findById(req.body.productId)
        .then(product => {
            //check if product does not exist in db
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Order stored',
                createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
})

//Handle GET request to a single /orders/:id
router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .exec()
        .then(order => {
            //check if order does not exist
            if (!order) {
                return res.status(404).json({
                   message: 'Order not found'
               }) 
            }
            res.status(200).json({
                orders: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

//Handle DELETE request to a single /orders:id
router.delete('/:orderId', (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId }).exec()
        .then(result => {
            res.status(200).json({
                orders: 'Orders deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: {
                        productId: 'ID',
                        quantity: 'Number'
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
    })
})
module.exports = router;