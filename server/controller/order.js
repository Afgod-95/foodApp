const Order = require('../models/order.js')

const userOrder = async () => {
    try{
        const { userId, productIds, totalPrice, deliveryAddress, paymentMethod } = req.body;
        const newOrder = new newOrder({
            userId, 
            productIds, 
            totalPrice, 
            deliveryAddress, 
            paymentMethod 
        })
       
        if (newOrder){
            res.status(200).json({
                message: 'Your order have been sent successfully'
            })

            await newOrder.save()
        }

        else{ 
            res.status(400).json({
                message: 'An error occured whilst processing your request'
            })
        }
    }
    catch(error){
        console.log(error.message)
    }
}

const orderHistory = async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { userOrder, orderHistory }

