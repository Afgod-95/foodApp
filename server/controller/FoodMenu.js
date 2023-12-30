const { default: mongoose } = require('mongoose')
const FoodMenu = require('../models/foodMenu.js')
const objectId = mongoose.Types.ObjectId

const restaurantMenu = {
    postMenu: async (req, res) => {
        try {
            const { name, image, description, rate } = req.body

            if (!name || !image || !description || !rate) {
                return res.status(400).json({
                    error: 'All fields are required'
                })
            }

            const foodMenuList = new FoodMenu({
                name: name,
                image: image,
                description: description,
                rate: rate,
            })

            await foodMenuList.save()

            res.status(200).json({
                message: 'Food menu saved successfully'
            })
        } catch (error) {
            console.log(error.message)
            res.status(400).json({
                error: error.message
            })
        }
    },

    getAllFoodMenu: async (req, res) => {
        try {
            const allFoodMenuList = await FoodMenu.find()
            res.status(200).json({
                message: 'Foods menu fetched successfully',
                allFoodMenuList
            })
        } catch (error) {
            console.log(error.message)
            res.status(400).json({
                error: error.message
            })
        }
    },

    deleteFoodMenuById: async (req, res) => {
        try {
            const { id } = req.params

            const deletedMenu = await FoodMenu.findByIdAndDelete({ _id: objectId(id)})

            if (deletedMenu) {
                return res.status(200).json({
                    message: 'Food menu deleted successfully'
                })
            } else {
                return res.status(404).json({
                    error: 'Menu not found'
                })
            }
        } catch (error) {
            console.log(error.message)
            res.status(400).json({
                error: error.message
            })
        }
    },

    updateFoodMenuById: async (req, res) => {
        try {
            const { id, name, image, description, rate } = req.body
            const updatedMenu = await FoodMenu.findByIdAndUpdate( { _id: id }, {
                name: name,
                image: image,
                description: description,
                rate: rate,
            }, { new: true })

            if (updatedMenu) {
                return res.status(200).json({
                    message: "Menu updated successfully"
                })
            } else {
                return res.status(404).json({
                    error: 'Menu not found'
                })
            }
        } catch (error) {
            console.log(error.message)
            res.status(400).json({
                error: error.message
            })
        }
    }
}

module.exports = restaurantMenu
