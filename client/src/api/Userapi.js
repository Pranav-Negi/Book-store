import { Axios } from "./Axios";

Axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;    
})

export const register = async (data) => {
    const response = await Axios.post("/user/register", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
}

export const login = async (data) => {
    const response = await Axios.post("/user/login", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
}

export const getProfile = async (userId) => {
    const response = await Axios.get("user/profile",
        { params: { userId } },
    );
    return response.data;
}

export const updateProfile = async (data) => {
    const response = await Axios.patch("/user/update", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
}

export const deleteProfile = async (id) => {
    const response = await Axios.delete("/user/delete", { params: { id } });
    return response.data;
}