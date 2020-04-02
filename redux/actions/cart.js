import {AsyncStorage} from "react-native";

export const cartInit = () => (dispatch, getState) => {
	AsyncStorage.getItem("cartProducts").then((cartProducts) => {
		if (cartProducts !== null) {
			const carNum = JSON.parse(cartProducts).length;
			dispatch({
				type: "CART_INIT",
				payload: carNum
			})
		}
	})


}

export const cartAdd = (num) => (dispatch, getState) => {
	dispatch({
		type: "CART_ADD",
		payload: num + 1
	})

}


export const cartReduce = (num) => (dispatch, getState) => {
	dispatch({
		type: "CART_REDUCE",
		payload: num - 1
	})
}

export const cartClear = () => (dispatch, getState) => {
	dispatch({
		type: "CART_ClEAR",
		payload: 0
	})
}

