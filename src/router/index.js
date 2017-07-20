import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Hello from '@/components/Hello'
import Indice from '@/components/Indice'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },
    {
      path: '/indice',
      name: 'Indice',
      component: Indice
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    }
  ]
})
