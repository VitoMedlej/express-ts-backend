import { getProductById } from "./services/getProductByIdService";
import { fetchHomeProducts  } from "./services/fetchHomeProducts";
import { addProduct } from "./services/AddProductService";
import { removeProductById } from "./services/removeProductById";
import { fetchDashboardProducts } from "./services/fetchDashboardProducts";
import { updateProductById } from "./services/updateProductService";
import { fetchByCategoryService } from "./services/fetchByCategoryService";
import { searchProductService } from "./services/searchProductService";

export const ProductsService = {
    fetchHomeProducts ,
    addProduct,
    getProductById,
    removeProductById,
    updateProductById,
    fetchDashboardProducts,
    fetchByCategoryService,
    searchProductService
};
