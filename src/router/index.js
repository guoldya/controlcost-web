import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import Cookies from 'js-cookie';
import {setToken, getToken, canTurnTo ,toDefaultPage} from '@/libs/util'

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})


router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  const token = getToken();
  if (!Cookies.get('user') && to.name !== 'login') {
    // 未登录且要跳转的页面不是登录页
    next({
      name: 'login' // 跳转到登录页
    })
  } else if (!Cookies.get('user') && to.name === 'login') {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (Cookies.get('user') && to.name == 'login') {
    // 已登录且要跳转的页面是登录页
    next({
      name: localStorage.rolePage // 跳转到home页
    })
  }
  else  if(Cookies.get('user')){
    next()
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
