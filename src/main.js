import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.prototype.selection = window.getSelection();

new Vue({
  render: h => h(App),
}).$mount('#app')
