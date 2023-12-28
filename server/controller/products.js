const Products = require('../models/products.js')

//posting products
const postProducts = async (req, res) => {
    try {
        const { name, price, rate, quantity, image, description, category } = req.body;

        if (!name || !price || !quantity || !image || !description || !category || !rate) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        const product = await Products.create({
            name, 
            price,
            quantity,
            rate, 
            image, 
            description, 
            category
        })

       await product.save()
       res.status(200).json({
        message: 'Products saved successfully',
        product
       })
        
    } catch (error) {
        console.log(`Error message: ${error.message}`);
        res.status(500).json({ error: "An error occurred while processing the request" });
    }
};

//finding single in the database by id
const getProductById = async (req, res) => {
    const { productId } = req.params;
    try {
        const oneProduct = await Products.findOne({ _id: productId });

        if (!oneProduct) {
            return res.status(404).json({
                message: `Product with ID ${productId} not found`,
            });
        }

        return res.status(200).json({
            message: `Product with ID ${productId} found successfully`,
            data: oneProduct,
        });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while processing the request",
            errorMessage: error.message,
        });
    }
};


//deleting a single product
const deleteSingleProduct = async(req, res) => {
    const { productId } = req.params
    try{
        const oneProduct = await Products.findOneAndDelete({_id: productId})
        if (!oneProduct){
            res.status(400).json({
                error: 'Failed to get product'
            })
        }
        else{
            res.status(200).json({
                message: `Product with ${productId} deleted successfully`,
                oneProduct
            })
        }
    }
    catch(error){
        console.log(`Error message: ${error.message}`);
        res.status(500).json({ error: "An error occurred while processing the request" });
    }
}

//updating a single product
const updateSingleProduct = async(req, res) => {
    const { productId } = req.params
    try{
        const oneProduct = await Products.findOneAndUpdate({_id: productId})
        if (!oneProduct){
            res.status(400).json({
                error: `Failed to update product ${productId}`
            })
        }
        else{
            res.status(200).json({
                message: `Product ${productId} updated successfully`,
                oneProduct
            })
        }
    }
    catch(error){
        console.log(`Error message: ${error.message}`);
        res.status(500).json({ error: "An error occurred while processing the request" });
    }
}

//getting all products
const getAllProduct = async (req, res) => {
    try{
        const products = await Products.find({})
        if (products){
            res.status(200).json({
                message: 'All products fetched successfully',
                products
            })
        }
        else{
            res.status(400).json({
                error: 'Failed to get all products'
            })
        }
    }
    catch(error) {
        console.log(`Error: ${error.message}`)
    }
    
}

module.exports = {
    postProducts,
    getAllProduct,
    updateSingleProduct,
    deleteSingleProduct,
    getProductById
}
