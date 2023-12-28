const Order = require('../models/order.js');

const userOrder = async (req, res) => {
  try {
    const { userId, productId, 
      totalPrice, 
      name, mobileNo, 
      paymentMethod, houseNo, street, city, state
    } = req.body;

    if(!totalPrice || !name || !mobileNo || !paymentMethod || !houseNo || !street || !city || !state){
      return res.status(400).json({
        error: 'All fields are required'
      })
    }
    
    // Correct the instantiation of the Order object
    const newOrder = new Order({
      userId: userId,
      productId: productId,
      totalPrice: totalPrice,
      deliveryAddress: {
        name: name,
        mobileNo: mobileNo,
        houseNo: houseNo,
        street: street,
        city: city,
        state: state,
      },
      paymentMethod: paymentMethod,
    });

    // Save the order before sending the response
    await newOrder.save();
    res.status(200).json({
      message: 'Your order has been sent successfully',
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      message: 'An error occurred while processing your request',
    });
  }
};

const orderHistory = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { userOrder, orderHistory };
