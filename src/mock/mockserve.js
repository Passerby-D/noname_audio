import Mock from "mockjs";
import nameApi from './home'
// 引用mock，随后Mock.mock()
// 定义请求拦截
Mock.mock('/api/skill',nameApi.getName)
// 获取用户列表的数据，写死路径是拦截不到携带params的请求的，所以我们需要改成正则表达式


