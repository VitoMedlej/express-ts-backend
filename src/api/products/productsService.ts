import {getProductById} from "./services/getProductByIdService";
import {getHomeProducts} from "./services/getHomeProducts";
import {addProduct} from "./services/AddProductService";
import { removeProductById } from "./services/removeProductById";

export class productsService {

    getHomeProducts = getHomeProducts;

    addProduct = addProduct;

    getProductById = getProductById;
    
    removeProductById= removeProductById;
}

export const ProductsService = new productsService();
