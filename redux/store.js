import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk';

import user from './reducers/user'
import brands from './reducers/brands'
import products from './reducers/products'
import cart from './reducers/cart'


const middleware = [thunk];
const initialState = {};

const reducers = combineReducers({
    brands,
    products,
    user,cart
})

const store = createStore(
    reducers,
    initialState,
    compose(
        applyMiddleware(...middleware)
            )
)

export default store