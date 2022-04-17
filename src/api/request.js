import axios from "axios"
import store from "@/store"

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "content-type": "application/json; charset=utf-8",
  },
  timeout: 5000,
  withCredentials: true, // 跨域请求是否提供凭据信息（cookie、HTTP认证及客户端SSL证明等）
})

request.interceptors.request.use((config) => {
    return config
  }, (err) => {
    console.log(err)
  },
)

request.interceptors.response.use((res) => {
    return res.data
  }, (err) => {
    if (err.response == null) {
      console.log(err)
    } else {
      if (err.response.status === 401) {
        return err.response.data
      } else if (err.response.status === 400) {
        store.commit("alert", {message: "请求参数错误", type: "error"})
      }else if (err.response.status === 404) {
        store.commit("alert", {message: "404 (Not Found)", type: "error"})
      } else {
        console.log(err.response)
      }
    }
  },
)

export default request
