import SitesList from './sites-list'
import SiteForm from './site-form'
import VueRouter from 'vue-router'

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'sites-list',
      component: SitesList
    },
    {
      path: '/new',
      name: 'sites-new',
      component: SiteForm
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
