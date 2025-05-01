

import { fetchDashboardProducts } from "./services/fetchDashboardProducts";
import { Authenticate } from "./services/Authenticate";
import { addProduct } from "./services/AddProductService";
import { removeProductById } from "./services/removeProductById";
import { updateProductById } from "./services/updateProductService";
import { fetchOrders } from "./services/FetchOrders";
import { removeOrderById } from "./services/removeOrderById";
import { fetchUsers } from "./services/fetchUsers";
import { updateProductStatus } from "./services/updateProductStatus";
import { GenerateDescription } from "./services/GenerateDescription";



export const dashboardService = {
    Authenticate,
    addProduct,
    removeProductById,
    updateProductById,
    fetchDashboardProducts,
    fetchOrders,
    removeOrderById,
    fetchUsers,
    updateProductStatus,
    GenerateDescription
};
