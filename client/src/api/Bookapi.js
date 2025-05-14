import { Axios } from "./Axios";

Axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
})

export const uploadBook = async (book) => {
    const response = await Axios.post("/upload", book, {
        headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': localStorage.getItem('token')
        },
    });
    return response.data;
}

export const getBooks = async (data ,page) => {
    const response = await Axios.get(`/books/get/?page=${page}&limit=5&search=${data.search}&category=${data.category}&sort=${data.sort}`);
    return response.data;
}

export const getBookbyid = async (id) => {
    const response = await Axios.get("/getone", { params: { id } });
    return response.data;
}

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

export const addReview = async (bookid,userid, review) => {
    const response = await Axios.put("/addreview",{param : {
        bookid, userid
    }} ,{ review });
    return response.data;
}

export const deleteReview = async (bookid,userid, review) => {
    const response = await Axios.delete("/deletereview",{param : {
        bookid, userid
    }} ,{ review });
    return response.data;
}

export const getTopRatedBooks = async () => {
    const response = await Axios.get("/books/gettopratedbooks/?search=&category=");
    return response.data;
}
