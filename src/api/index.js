import request from "./request";


// 定义一个请求首页数据的接口
export const getData=()=>{
    // 返回一个promise对象
        return request.get('/skill')
}
/* api/index.js--get请求携带参数 */