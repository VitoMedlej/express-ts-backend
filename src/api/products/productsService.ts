import { fetchHomeProducts  } from "./services/fetchHomeProducts";
import { fetchDashboardProducts } from "../dashboard/services/fetchDashboardProducts";
import { fetchByCategoryService } from "./services/fetchByCategoryService";
import { searchProductService } from "./services/searchProductService";
import { getProductById } from "./services/getProductByIdService";

export const ProductsService = {
    fetchHomeProducts ,
    getProductById,
    fetchDashboardProducts,
    fetchByCategoryService,
    searchProductService
};
