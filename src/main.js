import Vue from 'vue'
import App from './App.vue'
// 引入elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
// 配置好的router需要暴露
import router from './router';
// mock也需要引入
import './mock/mockserve'
import store from './store';
// 引入cookie
import Cookie from 'js-cookie'
import Vant from 'vant';
import 'vant/lib/index.css';
import { Button } from 'vant';
import { Toast } from 'vant';
import { Popup } from 'vant';

Vue.use(Popup);
Vue.use(Toast);
Vue.use(Button);
Vue.use(Vant);
// 作为插件使用
Vue.use(ElementUI);  
Vue.use(VueRouter)
Vue.config.productionTip = false


// 添加全局前置导航守卫
/* router.beforeEach((to,from,next)=>{
  // 判断token,存不存在
  const token=Cookie.get('token')
  // token不存在，就说明当前用户是未登录，应该跳转至登录页面,但是如果在登录页面就会死循环，所以要加上我们的判断
  if(!token&&to.name!='login'){
    // 不存在就使用next函数，跳转至登录页
    next({name:'login'})
  }else if(token&&to.name=='login'){
    // token存在，说明用户登录，此时跳转至首页
    next({name:'home'})
  }
  else{
    next()
  }
}) */
// 
new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate(){
    // 全局事件总线
    Vue.prototype.$bus=this
  }
}).$mount('#app')
