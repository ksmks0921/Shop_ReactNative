const initialState = {
	cardNum:0,
}
export default (state = initialState, action) => {
	switch(action.type) {
		case 'CART_INIT': {
			return {
				...state,
				cardNum: action.payload
			}
		}
		case 'CART_ADD': {
			return {
				...state,
				cardNum: action.payload
			}
		}

		case 'CART_REDUCE': {
			return {
				...state,
				cardNum: action.payload
			}
		}
		case 'CART_ClEAR': {
			return {
				...state,
				cardNum: action.payload
			}
		}

		default:
			return state;
	}
}