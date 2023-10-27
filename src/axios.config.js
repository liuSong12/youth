import axios from "axios"
import GlobalConfig from "./GlobalConfig"

// Add a request interceptor
axios.defaults.baseURL = GlobalConfig.DEFAULT_URL
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
	let token = localStorage.getItem("token")
	config.headers.Authorization = `Bearer ${token}`
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
	const token = response.headers.authorization
	token && localStorage.setItem("token",token)
    return response;
  }, function (error) {
	  if(error.response.status===401){
		  localStorage.removeItem("token")
		  window.location.href = "#/login"
	  }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });