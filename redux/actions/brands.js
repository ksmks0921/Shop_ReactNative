import axios from "axios"
const BASEURL= "https://app.shoppingrunway.mx/api/v1";

export const getBrands = () => dispatch => {
    axios.get(`${BASEURL}/categories`)
      .then(res => {
        dispatch({
            type: 'LOADING_BRANDS'
        })
        dispatch({
            type: 'GET_BRANDS',
            payload: res.data.brands
        })
      })
      .catch(e => console.error(e))
}
