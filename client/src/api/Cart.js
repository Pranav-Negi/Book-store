import {Axios} from './Axios';

Axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
})

export const addToCart = async (data) => {
    const response = await Axios.post("/cart/addtocart", data);
    return response.data;
}

export const getCart = async (Userid) => {
    const response = await Axios.get("/cart/viewcart", {
        params: {Userid }});
    return response.data;
}

export const removeFromCart = async (id, Userid) => {
    const response = await Axios.delete("/cart/deletefromcart", {
        params: { id, Userid }});
    return response.data;
}
export const clearCart = async (Userid) => {
    const response = await Axios.delete("/cart/deletewholecart", {
        params: { Userid }});
    return response.data;
}