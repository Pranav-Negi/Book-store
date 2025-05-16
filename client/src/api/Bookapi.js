import { Axios } from "./Axios";

Axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
})

export const getBooks = async (data ,page) => {
    const response = await Axios.get(`/books/get/?page=${page}&limit=5&search=${data.search}&category=${data.category}&sort=${data.sort}`);
    return response.data;
}

export const getTopRatedBooks = async () => {
    const response = await Axios.get("/books/gettopratedbooks/?search=&category=");
    return response.data;
}

export const getBookbyid = async (id) => {
    const response = await Axios.get("/books/getone", { params: { bookid :id } });
    return response.data;
}

export const addReview = async (bookid,Userid, review) => {
    const response = await Axios.put("/books/addreview", review,
    {params : {
        bookid, Userid
    }} );
    return response.data;
}

export const deleteReview = async (bookid,reviewid) => {
    const response = await Axios.delete("/books/deletereview",{params : {
        bookid, reviewid
    }});
    return response.data;
}

