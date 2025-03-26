import '@/styles/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueMatomo from 'vue-matomo';

import App from './App.vue';

const app = createApp(App);

app.use(VueMatomo, {
  host: 'https://kiser.codes/analytics/',
  siteId: 1,
  enableLinkTracking: true,
  disableCookies: true,
  debug: true,
});

app.use(createPinia());

app.mount('#app');
