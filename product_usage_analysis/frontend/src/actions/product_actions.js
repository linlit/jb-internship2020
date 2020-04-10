import { productActionConstants } from '../constants'
import axios from "axios"
import { apiURL } from '../config'

export function get_product_usage_list() {
    return dispatch => {
        const PRODUCT_USAGE_LIST_ENDPOINT = `${apiURL}/api/products`;
        
        axios.get(PRODUCT_USAGE_LIST_ENDPOINT) 
            .then((response) => {
                dispatch( {type: productActionConstants.PRODUCTS_SUCCESS, payload: response.data} )
            })
            .catch((error) => {
                console.log(error);
            })
    }
}
