const express = require('express');
const router = express.Router();

//Handle GET request to /orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        orders: 'Orders were fetched'
    })
})

//Handle POST request to create an order -> /orders
router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        orders: 'Orders was created',
        order: order
    })
})

//Handle GET request to a single /orders/:id
router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        orders: 'Orders details',
        orderId: req.params.orderId
    })
})

//Handle DELETE request to a single /orders:id
router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        orders: 'Orders deleted',
        
    })
})
module.exports = router;