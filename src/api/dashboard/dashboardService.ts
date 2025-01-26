

import { fetchDashboardProducts } from "./services/fetchDashboardProducts";
import { Authenticate } from "./services/Authenticate";
import { addProduct } from "./services/AddProductService";
import { removeProductById } from "./services/removeProductById";
import { updateProductById } from "./services/updateProductService";
import { fetchOrders } from "./services/FetchOrders";



export const dashboardService = {
    Authenticate,
    addProduct,
    removeProductById,
    updateProductById,
    fetchDashboardProducts,
    fetchOrders,
};
