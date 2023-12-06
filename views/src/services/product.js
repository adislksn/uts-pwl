import axiosInstance from "../api/interceptor";

const getProducts = async () => {
    try {
        const response = await axiosInstance.get("/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
    }

const editProduct = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/product-update?id=${id}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    }

const deleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/product-delete?id=${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    }

const getDetailProduct = async (id) => {
    try {
        const response = await axiosInstance.get(`/product?id=${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    }

const updateProduct = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/product-update?id=${id}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
    }
const serviceProduct = {
    getProducts,
    editProduct,
    deleteProduct,
    getDetailProduct,
    updateProduct
};

export default serviceProduct;