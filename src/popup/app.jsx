import SitesList from './sites-list'
import SiteForm from './site-form'
import VueRouter from 'vue-router'
import Icon from './icon'
import HomeIcon from '@fortawesome/fontawesome-free/svgs/solid/home.svg'

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'sites-list',
      component: SitesList,
      meta: { title: 'Prod Guard' }
    },
    {
      path: '/new',
      name: 'sites-new',
      component: SiteForm,
      meta: { title: 'Add site' }
    },
    {
      path: '/edit/:id',
      name: 'sites-edit',
      component: SiteForm,
      props: true,
      meta: { title: 'Edit site' }
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
      <div>
        <div class='title-bar'>
          <router-link to='/'>
            <Icon svg={HomeIcon} title='Home' />
          </router-link>

          <h1>{this.$router.currentRoute.meta.title}</h1>
        </div>

        <div class='page-content'>
          <router-view />
        </div>
      </div>
    )
  }
}
