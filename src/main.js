import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import axios from "axios";
import VueAxios from "vue-axios";

Vue.config.productionTip = false
Vue.use(Vuetify);
Vue.use(VueAxios, axios);

new Vue({
  store,
  vuetify : new Vuetify(),
  render: h => h(App)
}).$mount('#app')
