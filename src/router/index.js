import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Hello from '@/components/Hello'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    }
  ]
})
