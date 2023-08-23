
import VueRouter from 'vue-router'
// 还需要对push和replace方法进行重写
/* 先把VueRouter原型对象的push，先保存一份 */
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
// 接下来重写push和replace方法,所以原本使用push方法需要的参数我们还是需要,重写的原因是我们重复点击之后就会报错
// 第一个参数：告诉原来的push方法，要转到哪个网页（传递哪些参数）
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        /* 这里为了确保上下文都是VueRouter的实例，所以就直接改变了this的指向,我感觉确保上下文的作用是，push的源码中使用到了this指向，如果不绑定
            那么正常指向就是windows了，就无法使用了，还有就是我们改变不能改变这个函数的上下文，我们只是为了解决问题的
        call和apply传递参数的区别，call传递参数用逗号隔开，apply传递数组
        */
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
}


VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
}


// 重写完之后我们来写路径
export default new VueRouter({
    routes: [
        // 我们进行一次重定向，当path是/的时候，我们直接重定向到home
        {
            path: '/',
            redirect: '/sanguoPage',
        },
        {
            path:'/sanguoPage',
            component:()=>import('../views/sgsPage.vue')
        }

    ]
})