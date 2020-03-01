import './index.scss'
import App from './app'
import Vue from 'vue'

main()

async function main () {
  const app = new (Vue.extend(App))
  app.$mount('body')
}

