import Settings from './settings'
import VueRouter from 'vue-router'

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'settings',
      component: Settings
    }
  ]
})

export default {
  name: 'App',

  router,

  data () {
    return {}
  },

  render () {
    return (
      <router-view />
    )
  }
}
