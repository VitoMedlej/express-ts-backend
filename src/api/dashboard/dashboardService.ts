

import { fetchDashboardProducts } from "./services/fetchDashboardProducts";
import { Authenticate } from "./services/Authenticate";
import { addProduct } from "./services/AddProductService";
import { removeProductById } from "./services/removeProductById";
import { updateProductById } from "./services/updateProductService";



export const dashboardService = {
    Authenticate,
    addProduct,
    removeProductById,
    updateProductById,
    fetchDashboardProducts,
};
