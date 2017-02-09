import Vue from 'vue'
import App from './App.vue'
import KeenUI from 'keen-ui';

Vue.use(KeenUI);

new Vue({
  el: '#app',
  render: h => h(App)
})
