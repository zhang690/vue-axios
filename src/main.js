import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
axios.defaults.timeout = 5000
// 热加载已注释，在 node_module/sockjs-client/dist/sockjs.js 中的第 1606 行
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.$baseURL = 'https://file.qingtingshuxia.com/'
  


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
