import axios from "axios";
import nprogress from "nprogress";
import 'nprogress/nprogress.css'
//第一步是创建新的request
const request=axios.create({
    // 配置基础的路径api，配置完之后还需要到vue.config.js里面配置
   baseURL:'/api',
    timeout:5000
})
//第二步是配置拦截器,发送拦截器
request.interceptors.request.use((config)=>{
    nprogress.start()
    console.log(config);
    return config
})
// 响应拦截器
request.interceptors.response.use((res)=>{
    nprogress.done()
    return res.data
},(error)=>{
   return  Promise.reject(new Error('fail'))
})  
export default request