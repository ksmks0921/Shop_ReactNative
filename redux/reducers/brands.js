const initialState = {
    brands: [],
    loading: false
}
export default (state = initialState, action) => {
    switch(action.type) {
        case 'GET_BRANDS': {
            return {
                ...state,
                loading: false,
                brands: action.payload
            }
        }
        case 'LOADING_BRANDS': {
            return {
                ...state,
                loading: true,
            }
        }

        default:
            return state;
    }
}