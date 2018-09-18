import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'test',
    //   component: require('@/pages/test').default
    // },
    {
      path: '/',
      name: 'index',
      component: require('@/pages/index').default
    }
  ]
})
