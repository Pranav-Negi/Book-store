import { Axios } from "./Axios";

Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export const getbook = async (userid) => {
  const response = await Axios.get("/admin/books", {
    params: {
      userid,
    },
  });
  return response.data;
};

export const uploadbook = async (userid, formdata) => {
  try {
    const response = await Axios.post("/admin/upload/", formdata, {
      headers: {
        "content-type": "multipart/form-data",
      },
      params: {
        userid
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateBook = async (id,data) => {
    const response = await Axios.put("/update",{params:{id}} ,book, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const deleteBook = async (id) => {
    const response = await Axios.delete("/deletebook", { params: { id } });
    return response.data;
}

