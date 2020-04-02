import axios from "axios"
const BASEURL= "https://app.shoppingrunway.mx/api/v1";

export const getProducts = (brandId, categoryId) => dispatch => {
    axios.get(`${BASEURL}/products/${brandId}/${categoryId}`)
       .then(res => {
           dispatch({
               type: "LOADING_PRODUCTS"
           })
           dispatch({
               type: "GET_PRODUCTS",
               payload: res.data.products
           })
       })
       .catch(e => console.error(e))
}

export const getProductsWithBrand = brandId => dispatch => {
    axios.get(`${BASEURL}/products/${brandId}`)
       .then(res => {
           dispatch({
               type: "LOADING_PRODUCTS"
           })
           dispatch({
               type: "GET_PRODUCTS",
               payload: res.data.products
           })
       })
       .catch(e => console.error(e))
}

export const getProductDetails = id => dispatch => {
    axios.get(`${BASEURL}/details/${id}`)
      .then(res => {
          dispatch({
               type: "LOADING_PRODUCTS"
           })
          dispatch({
              type: "GET_PRODUCT",
              payload: res.data.product
          })
      })
      .catch(e => console.error(e))
}

export const addCart = () => ({
    type: "ADD_CART"
})
