import { productActionConstants } from '../constants'
import axios from "axios"

export function get_product_usage_list() {
    return dispatch => {
        const PRODUCT_USAGE_LIST_ENDPOINT = `https://localhost:8000/api/products`;

        axios.get(PRODUCT_USAGE_LIST_ENDPOINT) 
            .then((response) => {
                dispatch( {type: productActionConstants.PRODUCTS_SUCCESS, payload: response.data} )
            })
            .then((error) => {
                console.log(error);
            })
    }
}
