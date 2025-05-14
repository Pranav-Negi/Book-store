import { Axios } from './Axios';

Axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export const addToOrder = async (userid,data) => {
    const response = await Axios.post("/order/createorder", data, {
        params: { userid }
    });
    return response.data;
}

export const orderbyid = async (id) => {
    const response = await Axios.get("/order/getbyid", {
        params: { userid }
    });
    return response.data;
}

export const getmyorder = async (userid) => {
    const response = await Axios.get("/order/getmyorder", {
        params: { userid }
    });
    return response.data;
}

export const updateOrderTodelivered = async (id) => {
    const response = await Axios.patch("/order/updateOrderTodelivered", {
        params: { id }
    });
    return response.data;
}

export const updateOrderToPaid = async (id) => {
    const response = await Axios.patch("/order/updateOrderToPaid", {
        params: { id }
    });
    return response.data;
}

export const cancelOrder = async (id) => {
    const response = await Axios.patch("/order/cancelOrder", {
        params: { id }
    });
    return response.data;
}