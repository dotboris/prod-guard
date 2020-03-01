import 'webextension-polyfill'
import 'content-scripts-register-polyfill'
import './index.scss'
import App from './app'
import Vue from 'vue'
import VueRouter from 'vue-router'

main()

async function main () {
  Vue.use(VueRouter)
  const app = new (Vue.extend(App))

  const root = document.createElement('div')
  document.body.append(root)
  app.$mount(root)
}

