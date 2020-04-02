const initialState = {
    products: [],
    loading: false,
    product: {},
    newAdded: false
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'LOADING_PRODUCTS': {
            return {
                ...state,
                loading: true,
                products: []
            }
        }
        case 'GET_PRODUCTS': {
            return {
                ...state,
                loading: false,
                product: action.payload
            }
        }
        case  "ADD_CART":
            const newAdded = !state.newAdded;
            return {
                ...state,
                newAdded
            };
        default:
            return [];
    }
}
