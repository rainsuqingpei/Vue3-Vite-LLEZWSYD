// https://blog.csdn.net/gentleman_hua/article/details/121313342
import axios from "axios";
// import qs from "qs";//qs为序列化数据的js库

//设置baseUrl
axios.defaults.baseURL = "/zwzzj";
// axios.defaults.baseURL = process.env.NODE_ENV === "production" ? "https://xxxxx" : "/api";

//设置请求头
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
//设置超时
axios.defaults.timeout = 10000;
//请求拦截器
axios.interceptors.request.use(
  (config) => {
    // const token = store.state.token;
    // token && (config.headers.Authorization = token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//响应拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.status == 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    alert(`异常请求：${JSON.stringify(error.message)}`);
  }
);

//封装post/get请求
export default {
  post(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url,
        data,
        //data: qs.stringify(data), //参数序列化
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  POSTbyJSON(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url,
        data,
        headers: {
          "Content-Type": "application/json;",
        },
        //data: qs.stringify(data), //参数序列化
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  get(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url,
        params: data,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
