
import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'

const initialState = {
    products: []
}

export const resetCart = createAsyncThunk('cart/resetCart', async (_, {dispatch}) => {
    dispatch(cartSlice.actions.clearCart())
})

export const cartSlice = createSlice({
    name: 'cart',
    initialState, 
    reducers: {
        addToCart: ( state, action ) => {
            const item = state.products.find((item) => item.id === action.payload.id)
            if (item){
                item.quantity += action.payload.quantity
            }
            else {
                state.products.push(action.payload)
            }
        },

        updateCartQuantity: (state, action) => {
            state.products = action.payload
        },

        removeItem: (state, action) => {
            state.products = state.products.filter(item => item.id !== action.payload)
        },

        clearCart: (state) => {
            state.products = []
        }
    }
})

export const {addToCart, updateCartQuantity, removeItem, clearCart } = cartSlice.actions

export default cartSlice.reducer

