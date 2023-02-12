import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './plugins/axios'
import VueCookies from 'vue-cookies'
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"

createApp(App).use(store).use(router).use(axios).use(VNetworkGraph).use(VueCookies).mount('#app')
