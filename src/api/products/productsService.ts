import { getProductById } from "./services/getProductByIdService";
import { fetchHomeProducts  } from "./services/fetchHomeProducts";
import { addProduct } from "./services/AddProductService";
import { removeProductById } from "./services/removeProductById";
import { fetchDashboardProducts } from "./services/fetchDashboardProducts";

export const ProductsService = {
    fetchHomeProducts ,
    addProduct,
    getProductById,
    removeProductById,
    fetchDashboardProducts
};
