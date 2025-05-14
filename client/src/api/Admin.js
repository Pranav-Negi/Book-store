import {Axios} from "./Axios"

Axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token")
    if(token){
        config.headers.Authorization = `${token}`
    }
    return config
})

export const getbook =async (userid)=>{
    const response =  await Axios.get("/admin/books",{
        params:{
            userid
        }
    })
    return response.data
}