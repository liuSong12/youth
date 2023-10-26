import App from './App.vue'

// #ifndef VUE3
import Vue from 'vue' 
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {createPinia} from 'pinia';
import { createSSRApp } from 'vue';  
const pinia = createPinia(); 

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  return {
    app
  }
}
// #endif