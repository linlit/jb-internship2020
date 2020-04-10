import { productActionConstants } from '../constants'

const initialState = {
    products_info: {}
}

export function products_info(state = initialState, action) {
    switch (action.type) {
        case productActionConstants.PRODUCTS_SUCCESS: {
            let products = { ...state.products_info };
            for (const value of action.payload)
                products[value.id] = value;

            return { products_info: products }
        }

        default:
            return state;
    }
}